'use client';

import { Mic, Calendar } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function SpeakingSection() {
  const { t } = useI18n();

  return (
    <section id="speaking" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.speaking.command}</span>
        </div>

        {/* Timeline */}
        <div className="space-y-1">
          {t.speaking.items.map((item, i) => (
            <div
              key={i}
              className="relative pl-6 pb-4 border-l border-[#333] last:border-l-transparent last:pb-0"
            >
              {/* Dot */}
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-[#D97706]" />

              <div className="p-3 border border-[#333] rounded bg-[#252525]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-[#D97706]" />
                    <h3 className="font-mono text-sm font-medium text-[#E5E5E5]">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[#737373]">
                    <Calendar className="w-3 h-3" />
                    <span className="font-mono text-xs">{item.date}</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-[#D97706] mb-1">{item.topic}</p>
                <p className="font-mono text-xs text-[#A3A3A3] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
