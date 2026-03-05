'use client';

import { useI18n } from '@/lib/i18n/context';

const statusColors = {
  live: '#22C55E',
  building: '#D97706',
  idea: '#737373',
};

function ProgressBar({ progress }: { progress: number }) {
  const filled = Math.round((progress / 100) * 8);
  const empty = 8 - filled;
  return (
    <span className="font-mono text-xs">
      <span className="text-[#D97706]">{'█'.repeat(filled)}</span>
      <span className="text-[#333]">{'░'.repeat(empty)}</span>
      <span className="text-[#737373] ml-1">{progress}%</span>
    </span>
  );
}

export function LabSection() {
  const { t } = useI18n();

  return (
    <section id="lab" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.lab.command}</span>
        </div>

        {/* Subtitle */}
        <p className="text-[#737373] font-mono text-xs">
          {t.lab.subtitle}
        </p>

        {/* Lab Cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          {t.lab.items.map((item) => {
            const color = statusColors[item.status];
            return (
              <div
                key={item.slug}
                className="border border-[#333] rounded-lg p-4 bg-[#252525]"
              >
                {/* Status badge + dot */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                    style={{
                      color,
                      borderColor: `${color}40`,
                      backgroundColor: `${color}10`,
                    }}
                  >
                    [{t.lab.statusLabels[item.status]}]
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-mono text-sm font-medium text-[#E5E5E5] mb-1">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-[#A3A3A3] font-mono text-xs leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Progress bar */}
                <ProgressBar progress={item.progress} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
