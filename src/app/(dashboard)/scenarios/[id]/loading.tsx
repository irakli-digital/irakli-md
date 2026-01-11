import { TerminalWindow } from '@/components/terminal/terminal-window';

export default function ScenarioLoading() {
  return (
    <div className="space-y-6">
      {/* Scenario Header Skeleton */}
      <TerminalWindow title="~/scenario/loading">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-[#3B82F6]/30 rounded animate-pulse" />
            <div className="h-5 w-20 bg-[#333] rounded animate-pulse" />
          </div>
          <div className="h-6 w-64 bg-[#333] rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#333] rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-[#333] rounded animate-pulse" />
          </div>
        </div>
      </TerminalWindow>

      {/* Goal Skeleton */}
      <TerminalWindow title="~/goal">
        <div className="space-y-3">
          <div className="h-4 w-full bg-[#333] rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-[#333] rounded animate-pulse" />
        </div>
      </TerminalWindow>

      {/* Input Skeleton */}
      <TerminalWindow title="~/input">
        <div className="space-y-4">
          <div className="h-32 bg-[#1A1A1A] rounded border border-[#333] animate-pulse" />
          <div className="flex justify-end">
            <div className="h-9 w-24 bg-[#D97706]/30 rounded animate-pulse" />
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
