'use client';

import { useState } from 'react';
import { ExternalLink, Send } from 'lucide-react';
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
    url: 'mailto:hello@irakli.md',
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
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

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

        {/* Newsletter */}
        <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
          <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2 border border-[#333] focus-within:border-[#D97706] transition-colors">
            <span className="text-[#D97706] font-mono text-sm">{'>'}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.contact.subscribe.placeholder}
              className="flex-1 bg-transparent text-[#E5E5E5] text-sm font-mono placeholder:text-[#737373] outline-none"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono text-xs rounded transition-colors"
            >
              {t.contact.subscribe.button}
              <Send className="w-3 h-3" />
            </button>
          </div>
          <p className="font-mono text-xs text-[#737373]">
            {t.contact.subscribe.note}
          </p>
        </form>

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
