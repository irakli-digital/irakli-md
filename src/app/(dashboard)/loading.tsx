import { TerminalWindow } from '@/components/terminal/terminal-window';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stats Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#252525] rounded-lg border border-[#333]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="h-8 w-20 bg-[#333] rounded animate-pulse" />
          <div className="h-6 w-16 bg-[#333] rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-[#333] rounded animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <TerminalWindow title="~/loading">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-[#D97706]/30 rounded animate-pulse" />
            <div className="h-4 w-32 bg-[#333] rounded animate-pulse" />
          </div>
          <div className="space-y-3 mt-4">
            <div className="h-20 bg-[#333] rounded animate-pulse" />
            <div className="h-20 bg-[#333] rounded animate-pulse" />
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
