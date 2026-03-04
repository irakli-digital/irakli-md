'use client';

import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

const projectColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

export function ProjectsSection() {
  const { t } = useI18n();

  return (
    <section id="projects" className="pt-8">
      {/* Divider */}
      <div className="border-t border-[#333] mb-8" />

      <div className="space-y-4">
        {/* Command */}
        <div className="font-mono text-sm">
          <span className="text-[#D97706]">{t.projects.command}</span>
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {t.projects.items.map((project, i) => {
            const color = projectColors[i % projectColors.length];
            return (
              <div
                key={project.slug}
                className="group border border-[#333] rounded-lg p-4 bg-[#252525] hover:border-opacity-80 transition-all cursor-pointer"
              >
                {/* Project header */}
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <ArrowUpRight
                    className="w-4 h-4 text-[#737373] group-hover:text-[#E5E5E5] transition-colors"
                  />
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

                {/* Metric */}
                <div className="font-mono text-xs mb-3">
                  <span className="text-[#22C55E]">{project.metric}</span>
                </div>

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
    </section>
  );
}
