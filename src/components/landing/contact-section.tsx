'use client';

import { useState } from 'react';
import { ExternalLink, Send, Loader2, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

const socialLinks = [
  {
    key: 'linkedin' as const,
    url: 'https://www.linkedin.com/in/iraklichkheidze/',
    color: '#3B82F6',
  },
  {
    key: 'twitter' as const,
    url: 'https://x.com/IrakliDigital',
    color: '#E5E5E5',
  },
];

export function ContactSection() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || t.contact.form.errorGeneric);
        setStatus('error');
        return;
      }

      setStatus('sent');
      setEmail('');
      setMessage('');

      // Reset back to idle after 4 seconds
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setErrorMsg(t.contact.form.errorGeneric);
      setStatus('error');
    }
  }

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

        {/* Email Contact Form */}
        <div className="border border-[#333] rounded-lg p-4 bg-[#252525] mt-4">
          <div className="font-mono text-xs text-[#737373] mb-3">
            <span className="text-[#D97706]">{'>'}</span> {t.contact.form.title}
          </div>

          {status === 'sent' ? (
            <div className="flex items-center gap-2 py-3">
              <Check className="w-4 h-4 text-[#22C55E]" />
              <span className="font-mono text-sm text-[#22C55E]">
                {t.contact.form.success}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contact.form.emailPlaceholder}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 font-mono text-sm text-[#E5E5E5] placeholder:text-[#737373] focus:outline-none focus:border-[#D97706] transition-colors"
                />
              </div>
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.form.messagePlaceholder}
                  required
                  rows={3}
                  maxLength={2000}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 font-mono text-sm text-[#E5E5E5] placeholder:text-[#737373] focus:outline-none focus:border-[#D97706] transition-colors resize-none"
                />
              </div>

              {status === 'error' && errorMsg && (
                <p className="font-mono text-xs text-[#EF4444]">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex items-center gap-2 px-4 py-2 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {t.contact.form.send}
                  </>
                )}
              </button>
            </form>
          )}
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
