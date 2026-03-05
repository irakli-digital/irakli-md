'use client';

import { useState, useCallback } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/landing/language-toggle';
import { HeroSection } from '@/components/landing/hero-section';
import { AboutSection } from '@/components/landing/about-section';
import { ProjectsSection } from '@/components/landing/projects-section';
import { ServicesSection } from '@/components/landing/services-section';
import { SpeakingSection } from '@/components/landing/speaking-section';
import { LabSection } from '@/components/landing/lab-section';
import { ContactSection } from '@/components/landing/contact-section';
import { ChatBubble } from '@/components/landing/chat-bubble';

function TerminalBar() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#about', label: t.nav.about },
    { href: '#projects', label: t.nav.projects },
    { href: '#services', label: t.nav.services },
    { href: '#speaking', label: t.nav.speaking },
    { href: '#lab', label: t.nav.lab },
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
  const [bootDone, setBootDone] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Single boxed terminal */}
        <div className="border border-[#333] rounded-lg overflow-hidden bg-[#1A1A1A]">
          {/* Terminal title bar - becomes nav after boot */}
          {bootDone ? (
            <TerminalBar />
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252525] border-b border-[#333]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#C75050]" />
                <div className="w-3 h-3 rounded-full bg-[#C9A644]" />
                <div className="w-3 h-3 rounded-full bg-[#4AC75A]" />
              </div>
              <span className="text-xs text-[#A3A3A3] ml-2 flex-1 text-center font-mono">~/irakli.md</span>
            </div>
          )}

          {/* Terminal content */}
          <div className="p-6 text-sm text-[#E5E5E5] font-mono">
            <HeroSection onBootComplete={handleBootComplete} />

            {bootDone && (
              <div className="animate-fade-in">
                <AboutSection />
                <ProjectsSection />
                <ServicesSection />
                <SpeakingSection />
                <LabSection />
                <ContactSection />
              </div>
            )}
          </div>
        </div>

        {bootDone && <LandingFooter />}
      </div>

      {bootDone && <ChatBubble />}
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
