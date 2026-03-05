'use client';

import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';

const categoryColors: Record<string, string> = {
  AI: '#8B5CF6',
  Automation: '#F59E0B',
  Hosting: '#3B82F6',
  Database: '#10B981',
  Design: '#EC4899',
  Productivity: '#6366F1',
  // Georgian categories
  'ავტომატიზაცია': '#F59E0B',
  'ჰოსტინგი': '#3B82F6',
  'მონაცემთა ბაზა': '#10B981',
  'დიზაინი': '#EC4899',
  'პროდუქტიულობა': '#6366F1',
};

function ToolsContent() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="border border-[#333] rounded-lg overflow-hidden bg-[#1A1A1A]">
          {/* Terminal title bar */}
          <nav className="bg-[#252525] border-b border-[#333] px-4 h-11 flex items-center gap-4">
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#C75050]" />
              <div className="w-3 h-3 rounded-full bg-[#C9A644]" />
              <div className="w-3 h-3 rounded-full bg-[#4AC75A]" />
            </div>
            <span className="font-mono text-xs text-[#A3A3A3] flex-shrink-0">
              ~/irakli.md/tools
            </span>
            <div className="flex-1" />
            <LanguageToggle />
          </nav>

          {/* Content */}
          <div className="p-6 text-sm text-[#E5E5E5] font-mono">
            {/* Back link */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[#737373] hover:text-[#D97706] transition-colors text-xs mb-6"
            >
              <ArrowLeft className="w-3 h-3" />
              {t.tools.backHome}
            </a>

            {/* Command */}
            <div className="font-mono text-sm mb-2">
              <span className="text-[#D97706]">{t.tools.command}</span>
            </div>

            {/* Subtitle */}
            <p className="text-[#737373] font-mono text-xs mb-6">
              {t.tools.subtitle}
            </p>

            {/* Tools Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {t.tools.items.map((tool) => {
                const color = categoryColors[tool.category] || '#D97706';
                return (
                  <div
                    key={tool.slug}
                    className="border border-[#333] rounded-lg p-4 bg-[#252525] group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                        style={{
                          color,
                          borderColor: `${color}40`,
                          backgroundColor: `${color}10`,
                        }}
                      >
                        {tool.category}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-mono text-sm font-medium text-[#E5E5E5] mb-1">
                      {tool.name}
                    </h3>

                    {/* Description */}
                    <p className="text-[#A3A3A3] font-mono text-xs leading-relaxed mb-3">
                      {tool.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#D97706] hover:text-[#F59E0B] transition-colors"
                    >
                      {t.tools.cta}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4">
          <div className="flex items-center justify-between py-3">
            <span className="font-mono text-xs text-[#737373]">{t.footer.left}</span>
            <span className="font-mono text-xs text-[#737373] flex items-center gap-1">
              {t.footer.right} <span className="text-[#D97706]">Claude</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <I18nProvider>
      <ToolsContent />
    </I18nProvider>
  );
}
