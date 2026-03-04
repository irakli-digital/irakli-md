'use client';

import { useI18n } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      onClick={toggleLang}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border border-[#333] hover:border-[#D97706] transition-colors',
        className
      )}
    >
      <span className={cn(lang === 'en' ? 'text-[#D97706]' : 'text-[#737373]')}>EN</span>
      <span className="text-[#333]">/</span>
      <span className={cn(lang === 'ka' ? 'text-[#D97706]' : 'text-[#737373]')}>KA</span>
    </button>
  );
}
