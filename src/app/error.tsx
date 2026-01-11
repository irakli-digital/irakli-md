'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-[#252525] rounded-lg border border-[#EF4444]/30">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-[#EF4444]/10 rounded-full">
            <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
          </div>
          <div>
            <h1 className="font-mono text-lg text-[#E5E5E5] mb-2">Something went wrong</h1>
            <p className="font-mono text-sm text-[#737373]">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={reset}
              variant="outline"
              className="font-mono text-sm border-[#333] hover:bg-[#333]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="font-mono text-sm text-[#737373] hover:text-[#E5E5E5]"
            >
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
