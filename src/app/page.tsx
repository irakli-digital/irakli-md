'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';
import { HeroSection } from '@/components/landing/hero-section';
import { AboutSection } from '@/components/landing/about-section';
import { ServicesSection } from '@/components/landing/services-section';
import { ContactSection } from '@/components/landing/contact-section';
import { ChatBubble } from '@/components/landing/chat-bubble';

function TerminalBar() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '/lab', label: t.nav.lab },
    { href: '/tools', label: t.nav.tools },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#252525] border-b border-[#333] rounded-t-lg">
      <div className="px-4 h-11 flex items-center gap-4">
        {/* Traffic lights */}
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#C75050]" />
          <div className="w-3 h-3 rounded-full bg-[#C9A644]" />
          <div className="w-3 h-3 rounded-full bg-[#4AC75A]" />
        </div>

        {/* Title */}
        <a href="#hero" className="font-mono text-xs text-[#A3A3A3] hover:text-[#D97706] transition-colors flex-shrink-0">
          ~/irakli.md
        </a>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs text-[#737373] hover:text-[#E5E5E5] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <LanguageToggle />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#737373] hover:text-[#E5E5E5] font-mono text-xs p-1"
          >
            {mobileMenuOpen ? '[x]' : '[=]'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#333] bg-[#252525] px-4 py-3 space-y-2 animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm text-[#A3A3A3] hover:text-[#D97706] py-1 transition-colors"
            >
              <span className="text-[#D97706] mr-2">{'>'}</span>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function ToolsBanner() {
  const { t } = useI18n();

  const highlightColors = ['#D946EF', '#3B82F6'];

  return (
    <section id="tools" className="pt-8">
      <div className="border-t border-[#333] mb-8" />
      <div className="space-y-4">
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.tools.command}</span>
        </div>

        {/* Highlighted tools — two boxes side by side */}
        <div className="grid sm:grid-cols-2 gap-4">
          {t.tools.highlightedTools.map((tool, idx) => {
            const color = highlightColors[idx] || '#D97706';
            return (
              <a
                key={tool.slug}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border rounded-lg p-5 bg-[#252525] transition-all duration-300"
                style={{ borderColor: `${color}30` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                    style={{
                      color,
                      borderColor: `${color}40`,
                      backgroundColor: `${color}10`,
                    }}
                  >
                    {tool.label}
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color }}
                  />
                </div>
                <h4 className="font-mono text-sm font-medium text-[#E5E5E5] mb-0.5">
                  {tool.name}
                </h4>
                <p className="font-mono text-[10px] mb-2" style={{ color: `${color}CC` }}>
                  {tool.tagline}
                </p>
                <p className="font-mono text-xs text-[#A3A3A3] leading-relaxed">
                  {tool.description}
                </p>
              </a>
            );
          })}
        </div>

        {/* Full tools banner card */}
        <a
          href="/tools"
          className="group block border border-[#333] rounded-lg p-6 bg-[#252525] hover:border-[#D97706] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-mono text-base text-[#E5E5E5] group-hover:text-[#D97706] transition-colors">
                {t.tools.title}
              </h3>
              <p className="font-mono text-xs text-[#A3A3A3]">
                {t.tools.bannerDesc}
              </p>
              {/* Mini tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {t.tools.items.slice(0, 4).map((tool) => (
                  <span
                    key={tool.slug}
                    className="font-mono text-[10px] text-[#737373] border border-[#333] rounded px-2 py-0.5"
                  >
                    {tool.name}
                  </span>
                ))}
                <span className="font-mono text-[10px] text-[#737373] border border-[#333] rounded px-2 py-0.5">
                  +{t.tools.items.length - 4} more
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-10 h-10 rounded-full border border-[#333] group-hover:border-[#D97706] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D97706]/10">
                <ArrowRight className="w-4 h-4 text-[#737373] group-hover:text-[#D97706] transition-colors group-hover:translate-x-0.5 duration-300" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function LabBanner() {
  const { t } = useI18n();

  const totalProjects = t.lab.workItems.length + t.lab.personalItems.length;
  const liveCount = [...t.lab.workItems, ...t.lab.personalItems].filter(
    (item) => item.status === 'live'
  ).length;

  return (
    <section id="lab" className="pt-8">
      <div className="border-t border-[#333] mb-8" />
      <div className="space-y-4">
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.lab.command}</span>
        </div>

        {/* Banner card */}
        <a
          href="/lab"
          className="group block border border-[#333] rounded-lg p-6 bg-[#252525] hover:border-[#D97706] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-mono text-base text-[#E5E5E5] group-hover:text-[#D97706] transition-colors">
                {t.lab.title}
              </h3>
              <p className="font-mono text-xs text-[#A3A3A3]">
                {t.lab.bannerDesc}
              </p>
              {/* Mini tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[...t.lab.workItems, ...t.lab.personalItems].slice(0, 3).map((p) => (
                  <span
                    key={p.slug}
                    className="font-mono text-[10px] text-[#737373] border border-[#333] rounded px-2 py-0.5"
                  >
                    {p.name}
                  </span>
                ))}
                <span className="font-mono text-[10px] text-[#737373] border border-[#333] rounded px-2 py-0.5">
                  +{totalProjects - 3} more
                </span>
                <span className="font-mono text-[10px] text-[#22C55E] border border-[#22C55E40] rounded px-2 py-0.5 bg-[#22C55E10]">
                  {liveCount} live
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-10 h-10 rounded-full border border-[#333] group-hover:border-[#D97706] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D97706]/10">
                <ArrowRight className="w-4 h-4 text-[#737373] group-hover:text-[#D97706] transition-colors group-hover:translate-x-0.5 duration-300" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function LandingFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-4">
      <div className="flex items-center justify-between py-3">
        <span className="font-mono text-xs text-[#737373]">{t.footer.left}</span>
        <span className="font-mono text-xs text-[#737373] flex items-center gap-1">
          {t.footer.right} <span className="text-[#D97706]">Claude</span>
        </span>
      </div>
    </footer>
  );
}

function LandingContent() {
  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Single boxed terminal */}
        <div className="border border-[#333] rounded-lg overflow-hidden bg-[#1A1A1A]">
          <TerminalBar />

          {/* Terminal content */}
          <div className="p-6 text-sm text-[#E5E5E5] font-mono">
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <ToolsBanner />
            <LabBanner />
            <ContactSection />
          </div>
        </div>

        <LandingFooter />
      </div>

      <ChatBubble />
    </div>
  );
}

export default function LandingPage() {
  return (
    <I18nProvider>
      <LandingContent />
    </I18nProvider>
  );
}
