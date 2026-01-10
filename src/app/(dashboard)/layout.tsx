'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { StatusBar } from '@/components/terminal/status-bar';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'dashboard' },
  { href: '/progress', label: 'progress' },
  { href: '/achievements', label: 'achievements' },
  { href: '/leaderboard', label: 'leaderboard' },
  { href: '/pricing', label: 'pricing' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { data: progress } = trpc.progress.getOverview.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#737373] font-mono animate-pulse">loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-8">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#1A1A1A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#D97706] font-bold hover:text-[#F59E0B] transition-colors">
              AI_LIT
            </Link>
            <span className="text-[#737373]">//</span>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-2 py-1 text-sm font-mono rounded transition-colors',
                    pathname === link.href
                      ? 'text-[#D97706] bg-[#D97706]/10'
                      : 'text-[#737373] hover:text-[#A3A3A3]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#737373]">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-[#737373] hover:text-[#EF4444] transition-colors font-mono text-xs"
            >
              logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Status Bar */}
      <StatusBar
        left={<span>{session.user?.email}</span>}
        center={<span>level {progress?.level || 1} | {progress?.totalXP?.toLocaleString() || 0} XP</span>}
        right={<span>streak: {progress?.streak?.currentStreak || 0}</span>}
      />
    </div>
  );
}
