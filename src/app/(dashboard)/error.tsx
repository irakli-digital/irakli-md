'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="space-y-6">
      <TerminalWindow title="~/error">
        <div className="space-y-4">
          <TerminalLine prefix="error:" prefixColor="error">
            something went wrong
          </TerminalLine>
          <p className="font-mono text-sm text-[#737373] pl-6">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <div className="pt-2">
            <Button
              onClick={reset}
              variant="outline"
              size="sm"
              className="font-mono text-xs border-[#333] hover:bg-[#333]"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
