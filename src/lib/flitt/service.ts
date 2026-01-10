import crypto from 'crypto';
import type {
  FlittConfig,
  FlittCheckoutData,
  FlittRecurringChargeData,
  FlittCheckoutResponse,
  FlittCallbackData,
  FlittRecurringResponse,
  CreateOrderData,
  ChargeRectokenData,
  CheckoutResult,
  ChargeResult,
  SUBSCRIPTION_PLANS,
  TRIAL_AMOUNT_TETRI,
} from './types';

class FlittService {
  private merchantId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(config?: FlittConfig) {
    this.merchantId = config?.merchantId || process.env.FLITT_MERCHANT_ID || '';
    this.secretKey = config?.secretKey || process.env.FLITT_SECRET_KEY || '';

    let baseUrl = config?.baseUrl || process.env.FLITT_API_URL || 'https://pay.flitt.com';
    // Extract hostname if full URL is provided
    if (baseUrl.includes('://')) {
      baseUrl = baseUrl.split('://')[1].split('/')[0];
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.merchantId && this.secretKey);
  }

  /**
   * Generate SHA1 signature for Flitt API requests
   * Signature format: SHA1(secret|value1|value2|...) with alphabetically sorted keys
   */
  private generateSignature(
    data: Record<string, unknown>,
    fieldsToExclude: string[] = ['signature', 'response_signature_string']
  ): string {
    // Create a copy to avoid modifying the original
    const dataForSigning = { ...data };

    // Remove excluded fields
    fieldsToExclude.forEach((key) => {
      if (key in dataForSigning) {
        delete dataForSigning[key];
      }
    });

    // Get keys with non-empty values
    const keysToInclude = Object.keys(dataForSigning).filter((key) => {
      const value = dataForSigning[key];
      return value !== undefined && value !== null && String(value) !== '';
    });

    // Sort keys alphabetically
    keysToInclude.sort();

    // Map to string values
    const orderedValues = keysToInclude.map((key) => String(dataForSigning[key]));

    // Create signature string: secret|value1|value2|...
    const signatureString = [this.secretKey, ...orderedValues].join('|');

    // Calculate SHA1 hash
    return crypto.createHash('sha1').update(signatureString).digest('hex').toLowerCase();
  }

  /**
   * Validate callback signature from Flitt webhook
   * Supports both MD5 and SHA1 formats
   */
  validateCallback(data: FlittCallbackData): boolean {
    // Bypass in development with test key
    if (this.secretKey === 'test' && process.env.NODE_ENV === 'development') {
      return true;
    }

    if (!data.signature || !this.secretKey) {
      return false;
    }

    const { signature, ...rest } = data;

    // Format 1: MD5 of "param=value&...&secret" (current Flitt callbacks)
    const alphaKeys = Object.keys(rest).sort();
    const md5String = alphaKeys.map((k) => `${k}=${rest[k as keyof typeof rest]}`).join('&') + this.secretKey;
    const md5Expected = crypto.createHash('md5').update(md5String).digest('hex').toLowerCase();

    if (signature.toLowerCase() === md5Expected) {
      return true;
    }

    // Format 2: SHA1 of "secret|value1|value2|..." (future proof)
    const presentVals = alphaKeys
      .filter((k) => {
        const val = rest[k as keyof typeof rest];
        return val !== undefined && val !== null && String(val) !== '';
      })
      .map((k) => String(rest[k as keyof typeof rest]));

    const sha1String = [this.secretKey, ...presentVals].join('|');
    const sha1Expected = crypto.createHash('sha1').update(sha1String, 'utf8').digest('hex').toLowerCase();

    return signature.toLowerCase() === sha1Expected;
  }

  /**
   * Make HTTP request to Flitt API
   */
  private async makeRequest<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const requestPayload = { request: data };

    const response = await fetch(`https://${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const result = await response.json();
    return result as T;
  }

  /**
   * Create checkout session for initial payment or trial
   */
  async createCheckout(orderData: CreateOrderData): Promise<CheckoutResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        orderId: orderData.orderId,
        error: 'Flitt service not configured',
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const amountInTetri = Math.round(orderData.amount * 100);

    const checkoutData: FlittCheckoutData = {
      merchant_id: this.merchantId,
      order_id: orderData.orderId,
      amount: String(amountInTetri),
      currency: orderData.currency || 'GEL',
      order_desc: orderData.description || 'AI Literacy Platform Subscription',
      response_url: `${appUrl}/pricing?success=true&order_id=${orderData.orderId}`,
      server_callback_url: `${appUrl}/api/flitt/callback`,
      required_rectoken: 'Y', // Always request rectoken for future charges
      sender_email: orderData.customerEmail || '',
      merchant_data: JSON.stringify({
        userId: orderData.userId,
        tier: orderData.tier,
      }),
    };

    // Add signature
    const signature = this.generateSignature(checkoutData as unknown as Record<string, unknown>);
    const dataWithSignature = { ...checkoutData, signature };

    try {
      const response = await this.makeRequest<{ response?: FlittCheckoutResponse } & FlittCheckoutResponse>(
        '/api/checkout/url',
        dataWithSignature as unknown as Record<string, unknown>
      );

      // Handle different response formats
      const checkoutUrl = response.response?.checkout_url || response.checkout_url;
      const paymentId = response.response?.payment_id || response.payment_id || response.token;

      if (checkoutUrl) {
        return {
          success: true,
          checkoutUrl,
          orderId: orderData.orderId,
          paymentId,
        };
      }

      // Handle token-based response (build checkout URL manually)
      if (response.token) {
        const merchantHash = 'c04d03956badcd79a8b227df02add23d579711e3'; // From Mypen
        const builtUrl = `https://pay.flitt.com/merchants/${merchantHash}/default/index.html?token=${response.token}`;
        return {
          success: true,
          checkoutUrl: builtUrl,
          orderId: orderData.orderId,
          paymentId: response.token,
        };
      }

      return {
        success: false,
        orderId: orderData.orderId,
        error: response.response?.error_message || response.error_message || 'Failed to create checkout',
      };
    } catch (error) {
      return {
        success: false,
        orderId: orderData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Charge a saved rectoken for subscription renewal
   */
  async chargeRectoken(chargeData: ChargeRectokenData): Promise<ChargeResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        orderId: chargeData.orderId,
        error: 'Flitt service not configured',
      };
    }

    if (!chargeData.rectoken) {
      return {
        success: false,
        orderId: chargeData.orderId,
        error: 'Rectoken is required',
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const amountInTetri = Math.round(chargeData.amount * 100);

    const recurringData: FlittRecurringChargeData = {
      merchant_id: this.merchantId,
      rectoken: chargeData.rectoken,
      order_id: chargeData.orderId,
      amount: String(amountInTetri),
      currency: chargeData.currency || 'GEL',
      order_desc: chargeData.description || 'Subscription Renewal',
      server_callback_url: `${appUrl}/api/flitt/callback`,
      sender_email: chargeData.customerEmail || '',
      merchant_data: JSON.stringify({
        userId: chargeData.userId,
        tier: chargeData.tier,
        isRecurringCharge: true,
      }),
    };

    const signature = this.generateSignature(recurringData as unknown as Record<string, unknown>);
    const dataWithSignature = { ...recurringData, signature };

    try {
      const response = await this.makeRequest<{ response?: FlittRecurringResponse } & FlittRecurringResponse>(
        '/api/recurring',
        dataWithSignature as unknown as Record<string, unknown>
      );

      // Check for approved status
      const orderStatus = response.response?.order_status || response.order_status;
      const transactionId = response.response?.transaction_id || response.transaction_id ||
                           response.response?.payment_id || response.payment_id;

      if (orderStatus === 'approved') {
        return {
          success: true,
          orderId: chargeData.orderId,
          transactionId,
        };
      }

      return {
        success: false,
        orderId: chargeData.orderId,
        error: response.response?.error_message || response.error_message || 'Charge failed',
      };
    } catch (error) {
      return {
        success: false,
        orderId: chargeData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get order status from Flitt
   */
  async getOrderStatus(orderId: string): Promise<FlittRecurringResponse> {
    const statusData = {
      merchant_id: this.merchantId,
      order_id: orderId,
    };

    const signature = this.generateSignature(statusData);
    const dataWithSignature = { ...statusData, signature };

    return this.makeRequest<FlittRecurringResponse>('/api/status', dataWithSignature);
  }
}

// Export singleton instance
export const flittService = new FlittService();

// Export class for testing
export { FlittService };
