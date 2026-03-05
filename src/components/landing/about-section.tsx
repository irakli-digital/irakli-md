'use client';

import Image from 'next/image';
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

        {/* Photo + Bio layout */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="border border-[#D97706] rounded-lg overflow-hidden w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]">
              <Image
                src="/images/irakli.png"
                alt="Irakli Chkheidze"
                width={160}
                height={160}
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                priority
              />
            </div>
            <div className="font-mono text-[10px] text-[#737373] mt-1 text-center">
              irakli.png
            </div>
          </div>

          {/* Bio */}
          <p className="text-[#A3A3A3] font-mono text-sm leading-relaxed flex-1">
            {t.about.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-4 space-y-1">
          <div className="font-mono text-sm mb-2">
            <span className="text-[#D97706]">{t.about.stats.command}</span>
          </div>
          {t.about.stats.items.map((item, i) => (
            <div key={i} className="font-mono text-sm flex gap-2">
              <span className="text-[#737373] w-fit">{item.key}:</span>
              <span className="text-[#22C55E]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
