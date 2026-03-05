'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-5">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.about.command}</span>
        </div>

        {/* Identity card: Photo + Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="border border-[#333] rounded-lg overflow-hidden w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
              <Image
                src="/images/irakli.png"
                alt="Irakli Chkheidze"
                width={140}
                height={140}
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                priority
              />
            </div>
            <div className="font-mono text-[10px] text-[#737373] mt-1 text-center">
              irakli.png
            </div>
          </div>

          {/* Identity + Bio */}
          <div className="flex-1 space-y-3">
            {/* Name & Role — terminal style key:value */}
            <div className="space-y-1">
              <div className="font-mono text-sm">
                <span className="text-[#737373]">name:</span>{' '}
                <span className="text-[#E5E5E5] font-semibold">Irakli Chkheidze</span>
              </div>
              <div className="font-mono text-sm">
                <span className="text-[#737373]">role:</span>{' '}
                <span className="text-[#E5E5E5]">{t.about.role}</span>
              </div>
              <div className="font-mono text-sm">
                <span className="text-[#737373]">org:</span>{' '}
                <span className="text-[#D97706]">{t.about.company}</span>
              </div>
              <div className="font-mono text-sm">
                <span className="text-[#737373]">loc:</span>{' '}
                <span className="text-[#A3A3A3]">{t.about.location}</span>
              </div>
            </div>

            {/* Bio as bullet points */}
            <div className="space-y-0.5">
              {t.about.bio.map((line, i) => (
                <div key={i} className="font-mono text-sm flex gap-2">
                  <span className="text-[#737373] flex-shrink-0">-</span>
                  <span className="text-[#A3A3A3]">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1">
          <div className="font-mono text-sm mb-2">
            <span className="text-[#D97706]">{t.about.stats.command}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
            {t.about.stats.items.map((item, i) => (
              <div key={i} className="font-mono text-sm flex gap-2">
                <span className="text-[#737373]">{item.key}:</span>
                <span className="text-[#22C55E]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
