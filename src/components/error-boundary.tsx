'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-[#252525] rounded-lg border border-[#EF4444]/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div>
                <p className="font-mono text-sm text-[#E5E5E5]">Something went wrong</p>
                <p className="font-mono text-xs text-[#737373] mt-1">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="font-mono text-xs border-[#333] hover:bg-[#333]"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use
interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="p-6 bg-[#252525] rounded-lg border border-[#EF4444]/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
        <div className="space-y-3">
          <div>
            <p className="font-mono text-sm text-[#E5E5E5]">Something went wrong</p>
            <p className="font-mono text-xs text-[#737373] mt-1">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              size="sm"
              className="font-mono text-xs border-[#333] hover:bg-[#333]"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
