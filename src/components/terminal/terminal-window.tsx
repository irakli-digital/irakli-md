'use client';

import { cn } from '@/lib/utils';

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  showControls?: boolean;
  className?: string;
}

export function TerminalWindow({
  title,
  children,
  showControls = true,
  className,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#333] bg-[#1A1A1A] overflow-hidden font-mono',
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252525] border-b border-[#333]">
        {showControls && (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#C75050]" />
            <div className="w-3 h-3 rounded-full bg-[#C9A644]" />
            <div className="w-3 h-3 rounded-full bg-[#4AC75A]" />
          </div>
        )}
        {title && (
          <span className="text-xs text-[#A3A3A3] ml-2 flex-1 text-center">{title}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 text-sm text-[#E5E5E5]">{children}</div>
    </div>
  );
}
