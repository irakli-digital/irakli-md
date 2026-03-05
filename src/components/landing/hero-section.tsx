'use client';

import { MessageSquare } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function HeroSection() {
  const { t } = useI18n();

  const bootLines = t.hero.boot;

  return (
    <section id="hero" className="min-h-[60vh] flex flex-col justify-center">
      {/* Boot Sequence — static, no animation */}
      <div className="space-y-1 mb-8">
        {bootLines.map((line, i) => (
          <div key={i} className="font-mono text-sm">
            <span className="text-[#737373]">{line}</span>
            {(line.includes('done') || line.includes('found') || line.includes('registered') || line.includes('generated')) && (
              <span className="text-[#22C55E]"> ✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-8 animate-fade-in">
        {/* ASCII Name — desktop */}
        <pre className="text-[#D97706] text-[8px] sm:text-[10px] md:text-xs leading-tight hidden sm:block whitespace-pre">
{`██╗██████╗  █████╗ ██╗  ██╗██╗     ██╗
██║██╔══██╗██╔══██╗██║ ██╔╝██║     ██║
██║██████╔╝███████║█████╔╝ ██║     ██║
██║██╔══██╗██╔══██║██╔═██╗ ██║     ██║
██║██║  ██║██║  ██║██║  ██╗███████╗██║
╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝`}
        </pre>
        <pre className="text-[#D97706] text-[8px] sm:text-[10px] md:text-xs leading-tight hidden sm:block whitespace-pre">
{` ██████╗██╗  ██╗██╗  ██╗██╗  ██╗███████╗██╗██████╗ ███████╗███████╗
██╔════╝██║  ██║██║ ██╔╝██║  ██║██╔════╝██║██╔══██╗╚══███╔╝██╔════╝
██║     ███████║█████╔╝ ███████║█████╗  ██║██║  ██║  ███╔╝ █████╗
██║     ██╔══██║██╔═██╗ ██╔══██║██╔══╝  ██║██║  ██║ ███╔╝  ██╔══╝
╚██████╗██║  ██║██║  ██╗██║  ██║███████╗██║██████╔╝███████╗███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚══════╝╚══════╝`}
        </pre>

        {/* Mobile name */}
        <div className="sm:hidden">
          <h1 className="text-2xl font-bold text-[#D97706]">Irakli Chkheidze</h1>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <p className="text-[#E5E5E5] text-lg sm:text-xl font-mono">
            {t.hero.tagline}
          </p>
          <p className="text-[#A3A3A3] font-mono text-sm">
            {t.hero.subtitle}
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#737373] font-mono text-sm">
            <span className="text-[#D97706]">{'>'}</span>
            <span className="w-2 h-4 bg-[#D97706] animate-cursor-blink" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                // Find and click the chat bubble button
                const chatBtn = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono text-sm rounded transition-colors font-medium"
            >
              {t.hero.cta.chat}
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
