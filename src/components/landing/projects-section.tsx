'use client';

import { useI18n } from '@/lib/i18n/context';

const projectColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];

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

        {/* Career Timeline */}
        <div className="space-y-4">
          {t.projects.items.map((project, i) => {
            const color = projectColors[i % projectColors.length];
            return (
              <div
                key={project.slug}
                className="border border-[#333] rounded-lg p-4 bg-[#252525]"
              >
                {/* Project header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-xs text-[#737373]">
                      {project.metric}
                    </span>
                  </div>
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
