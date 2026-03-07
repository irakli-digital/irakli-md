'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';

const categoryColors: Record<string, string> = {
  AI: '#8B5CF6',
  Code: '#3B82F6',
  Hosting: '#10B981',
  Automation: '#F59E0B',
  Database: '#EC4899',
  Integration: '#6366F1',
};

function CheckItem({ label, index }: { label: string; index: number }) {
  const [checked, setChecked] = useState(false);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className="flex items-center gap-3 w-full text-left py-1.5 group animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span
        className={`w-4 h-4 border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
          checked
            ? 'bg-[#D97706] border-[#D97706] text-[#1A1A1A]'
            : 'border-[#555] group-hover:border-[#888]'
        }`}
      >
        {checked && <span className="text-xs font-bold">x</span>}
      </span>
      <span
        className={`font-mono text-xs transition-colors ${
          checked ? 'text-[#737373] line-through' : 'text-[#E5E5E5]'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function AmiStartContent() {
  const { t } = useI18n();
  const [bootDone, setBootDone] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const ami = t.amiStart;

  useEffect(() => {
    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= ami.bootLines.length - 1) {
          clearInterval(timer);
          setTimeout(() => setBootDone(true), 150);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [ami.bootLines.length]);

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
              ~/irakli.md/ami-start
            </span>
            <div className="flex-1" />
            <LanguageToggle />
          </nav>

          {/* Content */}
          <div className="p-6 text-sm text-[#E5E5E5] font-mono">
            {/* Boot sequence */}
            <div className="space-y-1 mb-6">
              {ami.bootLines.slice(0, bootStep + 1).map((line, i) => (
                <div
                  key={i}
                  className="font-mono text-sm animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={i === 0 ? 'text-[#D97706]' : 'text-[#737373]'}>{line}</span>
                  {line.includes('found') && <span className="text-[#22C55E]"> ✓</span>}
                  {line.includes('ნაპოვნია') && <span className="text-[#22C55E]"> ✓</span>}
                  {(line === 'ready.' || line === 'მზადაა.') && <span className="text-[#22C55E]"> ✓</span>}
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
                  {ami.backHome}
                </a>

                {/* ASCII Art Title */}
                <div className="mb-6">
                  {/* Desktop */}
                  <pre className="text-[#D97706] text-[8px] sm:text-[10px] md:text-xs leading-tight hidden sm:block whitespace-pre mb-4">{`
 █████╗ ██╗    ██████╗  ██████╗  ██████╗
██╔══██╗██║    ╚════██╗██╔════╝ ██╔═████╗
███████║██║     █████╔╝███████╗ ██║██╔██║
██╔══██║██║     ╚═══██╗██╔═══██╗████╔╝██║
██║  ██║██║    ██████╔╝╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚═╝    ╚═════╝  ╚═════╝  ╚═════╝`.trimStart()}</pre>

                  {/* Mobile */}
                  <div className="sm:hidden overflow-x-auto mb-4">
                    <pre className="text-[#D97706] text-[5px] leading-tight whitespace-pre">{`
 █████╗ ██╗    ██████╗  ██████╗  ██████╗
██╔══██╗██║    ╚════██╗██╔════╝ ██╔═████╗
███████║██║     █████╔╝███████╗ ██║██╔██║
██╔══██║██║     ╚═══██╗██╔═══██╗████╔╝██║
██║  ██║██║    ██████╔╝╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚═╝    ╚═════╝  ╚═════╝  ╚═════╝`.trimStart()}</pre>
                  </div>

                  <p className="text-[#E5E5E5] text-base sm:text-lg leading-relaxed">
                    {ami.subtitle.split(ami.beforeHighlight)[0]}
                    <span className="text-[#F59E0B] font-bold">{ami.beforeHighlight}</span>
                    {ami.subtitle.split(ami.beforeHighlight)[1]}
                  </p>
                </div>

                {/* Section 1: Required Accounts */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{ami.accounts.title}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ami.accounts.items.map((account, index) => {
                      const color = categoryColors[account.category] || '#D97706';
                      return (
                        <div
                          key={index}
                          className="border border-[#333] rounded-lg p-4 bg-[#252525] group animate-fade-in"
                          style={{ animationDelay: `${index * 60}ms` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                              style={{
                                color,
                                borderColor: `${color}40`,
                                backgroundColor: `${color}10`,
                              }}
                            >
                              {account.category}
                            </span>
                          </div>
                          <h3 className="font-mono text-sm font-medium text-[#E5E5E5] mb-1">
                            {account.name}
                          </h3>
                          <p className="text-[#A3A3A3] font-mono text-xs leading-relaxed mb-2">
                            {account.description}
                          </p>
                          <p className="text-[#555] font-mono text-[10px] mb-3">
                            {account.cost}
                          </p>
                          <a
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-[#D97706] hover:text-[#F59E0B] transition-colors"
                          >
                            {ami.accounts.signUp}
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 1b: Nice to Have */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#555]">{'-- '}</span>
                    <span className="text-[#555]">{ami.optional.title}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ami.optional.items.map((account, index) => (
                      <div
                        key={index}
                        className="border border-[#2A2A2A] rounded-lg p-4 bg-[#1E1E1E] opacity-60 animate-fade-in"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <h3 className="font-mono text-sm text-[#A3A3A3] mb-1">
                          {account.name}
                        </h3>
                        <p className="text-[#555] font-mono text-xs leading-relaxed mb-1">
                          {account.description}
                        </p>
                        <p className="text-[#555] font-mono text-[10px]">
                          {account.cost}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Software to Install */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{ami.software.title}</span>
                  </div>
                  {ami.software.items.map((sw, index) => (
                    <div
                      key={index}
                      className="border border-[#333] rounded-lg p-4 bg-[#252525] animate-fade-in"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#D97706] text-[10px] font-mono">step {index + 1}</span>
                        <h3 className="font-mono text-sm font-medium text-[#E5E5E5]">
                          {sw.name}
                        </h3>
                      </div>
                      <p className="text-[#A3A3A3] font-mono text-xs leading-relaxed mb-2">
                        {sw.what}
                      </p>
                      <a
                        href={sw.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[#D97706] hover:text-[#F59E0B] transition-colors mb-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {sw.url}
                      </a>
                      <p className="text-[#555] font-mono text-[10px] italic">
                        {sw.verify}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Section 3: Verification Checklist */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{ami.checklist.title}</span>
                  </div>
                  <div className="border border-[#333] rounded-lg p-4 bg-[#252525]">
                    <p className="text-[#555] font-mono text-[10px] mb-3">
                      {ami.checklist.hint}
                    </p>
                    <div className="space-y-0.5">
                      {ami.checklist.items.map((item, i) => (
                        <CheckItem key={i} label={item} index={i} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 4: Costs */}
                <div className="space-y-3 mb-8">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{ami.costs.title}</span>
                  </div>
                  <div className="border border-[#333] rounded-lg p-4 bg-[#252525]">
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">{ami.costs.claudeRecommended}</span>
                        <span className="text-[#E5E5E5]">$100/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">{ami.costs.claudeMinimum}</span>
                        <span className="text-[#E5E5E5]">$20/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">{ami.costs.everythingElse}</span>
                        <span className="text-[#E5E5E5]">{ami.costs.free}</span>
                      </div>
                      <div className="border-t border-[#333] pt-2 flex justify-between">
                        <span className="text-[#D97706] font-bold">{ami.costs.totalRecommended}</span>
                        <span className="text-[#D97706] font-bold">$100/month</span>
                      </div>
                    </div>
                    <p className="text-[#555] font-mono text-[10px] leading-relaxed">
                      {ami.costs.note}
                    </p>
                  </div>
                </div>

                {/* Section 5: Don't Worry */}
                <div className="space-y-3">
                  <div className="font-mono text-sm">
                    <span className="text-[#D97706]">{'> '}</span>
                    <span className="text-[#A3A3A3]">{ami.dontWorry.title}</span>
                  </div>
                  <div className="border border-[#333] rounded-lg p-4 bg-[#252525]">
                    {ami.dontWorry.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 py-1 animate-fade-in"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <span className="text-[#22C55E] flex-shrink-0 text-xs">~</span>
                        <span className="text-[#A3A3A3] text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-off */}
                <div className="pt-6 mt-6 border-t border-[#333] text-center">
                  <p className="text-[#D97706] text-sm mb-1">{ami.signOff}</p>
                  <p className="text-[#555] text-xs">
                    <span className="text-[#737373]">$</span> exit
                  </p>
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

export default function AmiStartPage() {
  return (
    <I18nProvider defaultLang="ka">
      <AmiStartContent />
    </I18nProvider>
  );
}
