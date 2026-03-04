'use client';

import { FileText } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function BlogPreview() {
  const { t } = useI18n();

  return (
    <section id="blog" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.blog.command}</span>
        </div>

        {/* Coming soon state */}
        {t.blog.posts.length === 0 && (
          <div className="border border-dashed border-[#333] rounded p-6 text-center">
            <FileText className="w-6 h-6 text-[#737373] mx-auto mb-2" />
            <p className="font-mono text-sm text-[#737373]">
              {t.blog.comingSoon}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
