'use client';

import { cn } from '@/lib/utils';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  prompt?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CommandInput({
  value,
  onChange,
  onSubmit,
  prompt = '>',
  placeholder = 'type a command...',
  disabled = false,
  className,
}: CommandInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 bg-[#2D2D2D] rounded px-3 py-2 border border-[#333] focus-within:border-[#D97706] transition-colors font-mono',
        className
      )}
    >
      <span className="text-[#D97706]">{prompt}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-[#E5E5E5] text-sm placeholder:text-[#737373] outline-none"
      />
      <span className="w-2 h-5 bg-[#D97706] animate-cursor-blink" />
    </div>
  );
}
