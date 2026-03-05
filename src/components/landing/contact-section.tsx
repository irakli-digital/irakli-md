'use client';

import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

const socialLinks = [
  {
    key: 'linkedin' as const,
    url: 'https://www.linkedin.com/in/iraklichkheidze/',
    color: '#3B82F6',
  },
  {
    key: 'github' as const,
    url: 'https://github.com/irakli-digital',
    color: '#E5E5E5',
  },
  {
    key: 'email' as const,
    url: 'mailto:irakli.digital@gmail.com',
    color: '#D97706',
  },
  {
    key: 'twitter' as const,
    url: 'https://twitter.com/iraklichkheidze',
    color: '#3B82F6',
  },
];

export function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="pt-8 pb-4">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.contact.command}</span>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#252525] transition-colors group"
            >
              <span className="text-[#D97706] font-mono text-sm">{'>'}</span>
              <span className="font-mono text-sm text-[#E5E5E5] group-hover:text-[#D97706] transition-colors">
                {t.contact.links[link.key]}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#737373] ml-auto group-hover:text-[#D97706] transition-colors" />
            </a>
          ))}
        </div>

        {/* Final CTA */}
        <div className="font-mono text-sm pt-2">
          <span className="text-[#D97706]">{'> '}</span>
          <span className="text-[#22C55E]">echo</span>
          <span className="text-[#E5E5E5]"> &quot;{t.contact.cta}&quot;</span>
        </div>
      </div>
    </section>
  );
}
