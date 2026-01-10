'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'write your prompt here...',
  maxLength = 5000,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && value.trim().length >= 10) {
        onSubmit();
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <span className="absolute left-3 top-3 text-[#D97706] font-mono text-sm">{'>'}</span>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            'w-full min-h-[150px] pl-8 pr-4 py-3 resize-none',
            'bg-[#2D2D2D] border border-[#333] rounded-lg',
            'text-[#E5E5E5] font-mono text-sm placeholder:text-[#737373]',
            'focus:outline-none focus:border-[#D97706] transition-colors',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#737373] font-mono">
          {value.length}/{maxLength} chars
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#737373] font-mono">cmd+enter to submit</span>
          <Button
            onClick={onSubmit}
            disabled={disabled || value.trim().length < 10}
            size="sm"
            className="bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono"
          >
            <Send className="h-4 w-4 mr-2" />
            submit
          </Button>
        </div>
      </div>
    </div>
  );
}
