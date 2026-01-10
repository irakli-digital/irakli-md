'use client';

import { cn } from '@/lib/utils';

interface TerminalLineProps {
  prefix?: string;
  prefixColor?: 'accent' | 'success' | 'error' | 'info' | 'muted';
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}

const colorClasses = {
  accent: 'text-[#D97706]',
  success: 'text-[#22C55E]',
  error: 'text-[#EF4444]',
  info: 'text-[#3B82F6]',
  muted: 'text-[#737373]',
};

export function TerminalLine({
  prefix,
  prefixColor = 'accent',
  children,
  animate = false,
  className,
}: TerminalLineProps) {
  return (
    <div className={cn('font-mono text-sm', animate && 'animate-fade-in', className)}>
      {prefix && <span className={cn(colorClasses[prefixColor], 'mr-2')}>{prefix}</span>}
      <span className="text-[#E5E5E5]">{children}</span>
    </div>
  );
}
