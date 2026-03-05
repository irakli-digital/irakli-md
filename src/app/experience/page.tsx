'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';

const projectColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];

function ExperienceContent() {
  const { t } = useI18n();
  const [bootDone, setBootDone] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const bootLines = [
    '> cd ~/experience',
    'loading career data...',
    `found ${t.projects.items.length} positions`,
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
              ~/irakli.md/experience
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

                {/* Career Timeline */}
                <div className="space-y-4">
                  {t.projects.items.map((project, i) => {
                    const color = projectColors[i % projectColors.length];
                    return (
                      <div
                        key={project.slug}
                        className="border border-[#333] rounded-lg p-4 bg-[#252525] animate-fade-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {/* Project header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-mono text-xs text-[#737373]">
                              {project.metric}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="font-mono text-sm font-medium mb-1"
                          style={{ color }}
                        >
                          {project.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[#A3A3A3] font-mono text-xs leading-relaxed mb-3">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-[10px] font-mono border"
                              style={{
                                borderColor: `${color}40`,
                                color: color,
                                backgroundColor: `${color}10`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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

export default function ExperiencePage() {
  return (
    <I18nProvider>
      <ExperienceContent />
    </I18nProvider>
  );
}
