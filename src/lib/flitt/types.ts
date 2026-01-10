// Flitt Payment Gateway Types

export interface FlittConfig {
  merchantId: string;
  secretKey: string;
  baseUrl?: string;
}

export interface FlittCheckoutData {
  merchant_id: string;
  order_id: string;
  amount: string; // in tetri (GEL cents)
  currency: string;
  order_desc: string;
  response_url: string;
  server_callback_url: string;
  required_rectoken?: 'Y' | 'N';
  sender_email?: string;
  merchant_data?: string; // JSON stringified
  recurring?: 'Y' | 'N';
  subscription?: 'Y' | 'N';
  subscription_callback_url?: string;
  recurring_data?: {
    every: string;
    period: 'day' | 'week' | 'month' | 'year';
    amount: string;
    start_time: string;
    state: 'y' | 'n' | 'hidden';
  };
}

export interface FlittRecurringChargeData {
  merchant_id: string;
  rectoken: string;
  order_id: string;
  amount: string;
  currency: string;
  order_desc: string;
  server_callback_url: string;
  sender_email?: string;
  merchant_data?: string;
}

export interface FlittCheckoutResponse {
  response_status: 'success' | 'failure' | 'error';
  checkout_url?: string;
  token?: string;
  payment_id?: string;
  error_message?: string;
  error_code?: string;
}

export interface FlittCallbackData {
  order_id: string;
  order_status: 'approved' | 'declined' | 'expired' | 'processing' | 'reversed' | 'created';
  signature: string;
  amount: string;
  currency: string;
  order_time?: string;
  response_status?: string;
  response_description?: string;
  sender_email?: string;
  merchant_data?: string;
  rectoken?: string;
  rectoken_lifetime?: string;
  transaction_id?: string;
  payment_id?: string;
  error_message?: string;
  error_code?: string;
}

export interface FlittRecurringResponse {
  response_status: 'success' | 'failure' | 'error';
  order_status?: 'approved' | 'declined' | 'expired' | 'processing';
  payment_id?: string;
  transaction_id?: string;
  error_message?: string;
  error_code?: string;
  rectoken?: string;
}

export interface CreateOrderData {
  orderId: string;
  userId: string;
  amount: number; // in GEL
  currency?: string;
  description?: string;
  customerEmail?: string;
  tier: 'trial' | 'monthly' | 'annual';
  callbackUrl?: string;
}

export interface ChargeRectokenData {
  orderId: string;
  userId: string;
  rectoken: string;
  amount: number; // in GEL
  currency?: string;
  description?: string;
  customerEmail?: string;
  tier: 'monthly' | 'annual';
}

export interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  orderId: string;
  paymentId?: string;
  error?: string;
}

export interface ChargeResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  error?: string;
}

// Subscription plans
export interface SubscriptionPlan {
  id: 'monthly' | 'annual';
  name: string;
  price: number; // in GEL
  priceInTetri: number;
  interval: 'month' | 'year';
  features: string[];
  savings?: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 29,
    priceInTetri: 2900,
    interval: 'month',
    features: [
      'All 4 learning stages',
      'Unlimited scenarios',
      'Detailed AI feedback',
      'Progress tracking',
      'Achievement badges',
      'Leaderboard access',
      'Certification exams',
    ],
  },
  annual: {
    id: 'annual',
    name: 'Pro Annual',
    price: 249,
    priceInTetri: 24900,
    interval: 'year',
    features: [
      'All 4 learning stages',
      'Unlimited scenarios',
      'Detailed AI feedback',
      'Progress tracking',
      'Achievement badges',
      'Leaderboard access',
      'Certification exams',
    ],
    savings: 'Save 28%',
  },
};

// Trial amount (minimum for card verification)
export const TRIAL_AMOUNT_TETRI = 1; // 0.01 GEL - Flitt minimum for verification
