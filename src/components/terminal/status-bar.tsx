'use client';

import { cn } from '@/lib/utils';

interface StatusBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function StatusBar({ left, center, right, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 h-8 bg-[#252525] border-t border-[#333]',
        'flex items-center justify-between px-4 font-mono text-xs text-[#737373]',
        className
      )}
    >
      <div>{left}</div>
      <div>{center}</div>
      <div className="flex items-center gap-2">
        {right}
        <span className="text-[#D97706]">Claude</span>
      </div>
    </div>
  );
}
