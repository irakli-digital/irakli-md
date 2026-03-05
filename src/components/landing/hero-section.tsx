'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface HeroSectionProps {
  onBootComplete: () => void;
}

export function HeroSection({ onBootComplete }: HeroSectionProps) {
  const { t } = useI18n();
  const [bootStep, setBootStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const bootLines = t.hero.boot;

  const skipBoot = useCallback(() => {
    if (showContent || skipped) return;
    setSkipped(true);
    setBootStep(bootLines.length - 1);
    setShowContent(true);
    onBootComplete();
  }, [showContent, skipped, bootLines.length, onBootComplete]);

  useEffect(() => {
    if (skipped) return;

    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= bootLines.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setShowContent(true);
            onBootComplete();
          }, 200);
          return prev;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [bootLines.length, onBootComplete, skipped]);

  useEffect(() => {
    const handleClick = () => skipBoot();
    const handleKeyDown = () => skipBoot();

    if (!showContent) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showContent, skipBoot]);

  return (
    <section id="hero" className="min-h-[70vh] flex flex-col justify-center">
      {/* Boot Sequence */}
      <div className="space-y-1 mb-8">
        {bootLines.slice(0, bootStep + 1).map((line, i) => (
          <div
            key={i}
            className="font-mono text-sm animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-[#737373]">{line}</span>
            {(line.includes('done') || line.includes('found') || line.includes('registered') || line.includes('generated')) && (
              <span className="text-[#22C55E]"> ✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      {showContent && (
        <div className="space-y-8 animate-fade-in">
          {/* ASCII Name */}
          <pre className="text-[#D97706] text-[10px] sm:text-xs md:text-sm leading-tight hidden sm:block">
{`██╗██████╗  █████╗ ██╗  ██╗██╗     ██╗
██║██╔══██╗██╔══██╗██║ ██╔╝██║     ██║
██║██████╔╝███████║█████╔╝ ██║     ██║
██║██╔══██╗██╔══██║██╔═██╗ ██║     ██║
██║██║  ██║██║  ██║██║  ██╗███████╗██║
╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝`}
          </pre>

          {/* Mobile name */}
          <div className="sm:hidden">
            <h1 className="text-2xl font-bold text-[#D97706]">IRAKLI</h1>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-[#E5E5E5] text-lg sm:text-xl font-mono">
              {t.hero.tagline}
            </p>
            <p className="text-[#A3A3A3] font-mono text-sm">
              {t.hero.subtitle}
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-[#737373] font-mono text-sm">
              <span className="text-[#D97706]">{'>'}</span>
              <span className="w-2 h-4 bg-[#D97706] animate-cursor-blink" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono text-sm rounded transition-colors font-medium"
              >
                {t.hero.cta.projects}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#333] hover:border-[#D97706] text-[#E5E5E5] font-mono text-sm rounded transition-colors"
              >
                {t.hero.cta.contact}
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
