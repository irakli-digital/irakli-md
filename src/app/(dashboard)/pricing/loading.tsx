import { TerminalWindow } from '@/components/terminal/terminal-window';

export default function PricingLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-2">
        <div className="h-8 w-48 bg-[#333] rounded animate-pulse mx-auto" />
        <div className="h-4 w-64 bg-[#333] rounded animate-pulse mx-auto" />
      </div>

      {/* Status Skeleton */}
      <TerminalWindow title="~/subscription/status">
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-6 w-32 bg-[#333] rounded animate-pulse" />
          <div className="h-6 w-24 bg-[#333] rounded animate-pulse" />
        </div>
      </TerminalWindow>

      {/* Plan Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-[#252525] rounded-lg border border-[#333]">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-[#333] rounded animate-pulse" />
              <div className="h-10 w-32 bg-[#333] rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#333] rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[#333] rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-[#333] rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-[#333] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
