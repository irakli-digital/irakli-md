'use client';

import { Target, Brain, TrendingUp, RefreshCw } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

const serviceIcons = [Target, Brain, TrendingUp, RefreshCw];
const serviceColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

export function ServicesSection() {
  const { t } = useI18n();

  return (
    <section id="services" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.services.command}</span>
        </div>

        {/* Services */}
        <div className="space-y-3">
          {t.services.items.map((service, i) => {
            const Icon = serviceIcons[i];
            const color = serviceColors[i];
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-3 border border-[#333] rounded bg-[#252525]"
              >
                <div
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-medium text-[#E5E5E5] mb-0.5">
                    {service.name}
                  </h3>
                  <p className="font-mono text-xs text-[#A3A3A3] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
