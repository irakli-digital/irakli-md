'use client';

import { useI18n } from '@/lib/i18n/context';

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.about.command}</span>
        </div>

        {/* Bio */}
        <p className="text-[#A3A3A3] font-mono text-sm leading-relaxed max-w-2xl">
          {t.about.bio}
        </p>

        {/* Stats */}
        <div className="mt-4 space-y-1">
          <div className="font-mono text-sm mb-2">
            <span className="text-[#D97706]">{t.about.stats.command}</span>
          </div>
          {t.about.stats.items.map((item, i) => (
            <div key={i} className="font-mono text-sm flex gap-2">
              <span className="text-[#737373] min-w-[200px]">{item.key}:</span>
              <span className="text-[#22C55E]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
