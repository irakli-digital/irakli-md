'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';

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

interface LabItem {
  slug: string;
  name: string;
  description: string;
  status: 'live' | 'building' | 'idea';
  progress: number;
}

function LabCard({
  item,
  statusLabels,
  index,
}: {
  item: LabItem;
  statusLabels: Record<string, string>;
  index: number;
}) {
  const color = statusColors[item.status];
  return (
    <div
      className="border border-[#333] rounded-lg p-4 bg-[#252525] animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
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
          [{statusLabels[item.status]}]
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
}

function LabContent() {
  const { t } = useI18n();
  const [bootDone, setBootDone] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const totalProjects = t.lab.workItems.length + t.lab.personalItems.length;

  const bootLines = [
    '> cd ~/lab',
    'scanning projects...',
    `found ${totalProjects} projects`,
    'ready.',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= bootLines.length - 1) {
          clearInterval(timer);
          setTimeout(() => setBootDone(true), 150);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [bootLines.length]);

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
              ~/irakli.md/lab
            </span>
            <div className="flex-1" />
            <LanguageToggle />
          </nav>

          {/* Content */}
          <div className="p-6 text-sm text-[#E5E5E5] font-mono">
            {/* Boot sequence */}
            <div className="space-y-1 mb-6">
              {bootLines.slice(0, bootStep + 1).map((line, i) => (
                <div
                  key={i}
                  className="font-mono text-sm animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={i === 0 ? 'text-[#D97706]' : 'text-[#737373]'}>{line}</span>
                  {line.includes('found') && <span className="text-[#22C55E]"> ✓</span>}
                  {line === 'ready.' && <span className="text-[#22C55E]"> ✓</span>}
                </div>
              ))}
            </div>

            {bootDone && (
              <div className="animate-fade-in">
                {/* Back link */}
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[#737373] hover:text-[#D97706] transition-colors text-xs mb-6"
                >
                  <ArrowLeft className="w-3 h-3" />
                  cd ~/
                </a>

                {/* Subtitle */}
                <p className="text-[#737373] font-mono text-xs mb-6">
                  {t.lab.subtitle}
                </p>

                {/* Work Projects */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{t.lab.workSubtitle}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {t.lab.workItems.map((item, i) => (
                      <LabCard
                        key={item.slug}
                        item={item}
                        statusLabels={t.lab.statusLabels}
                        index={i}
                      />
                    ))}
                  </div>
                </div>

                {/* Personal / Hobby Projects */}
                <div className="space-y-3">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{t.lab.personalSubtitle}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {t.lab.personalItems.map((item, i) => (
                      <LabCard
                        key={item.slug}
                        item={item}
                        statusLabels={t.lab.statusLabels}
                        index={t.lab.workItems.length + i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
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

export default function LabPage() {
  return (
    <I18nProvider>
      <LabContent />
    </I18nProvider>
  );
}
