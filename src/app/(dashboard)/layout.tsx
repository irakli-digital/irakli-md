'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { StatusBar } from '@/components/terminal/status-bar';
import { TrialBanner } from '@/components/subscription/trial-banner';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'dashboard' },
  { href: '/progress', label: 'progress' },
  { href: '/achievements', label: 'achievements' },
  { href: '/leaderboard', label: 'leaderboard' },
  { href: '/pricing', label: 'pricing' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { data: progress } = trpc.progress.getOverview.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
  const { data: subscription } = trpc.subscription.getStatus.useQuery(undefined, {
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
            <span className="text-[#737373] hidden md:inline">{'//'}</span>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
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
          <div className="flex items-center gap-2 md:gap-4 text-sm">
            <span className="text-[#737373] hidden sm:inline truncate max-w-[150px] md:max-w-none">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-[#737373] hover:text-[#EF4444] transition-colors font-mono text-xs"
            >
              logout
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#737373] hover:text-[#E5E5E5] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#333] bg-[#1A1A1A]">
            <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 text-sm font-mono rounded transition-colors',
                    pathname === link.href
                      ? 'text-[#D97706] bg-[#D97706]/10'
                      : 'text-[#737373] hover:text-[#A3A3A3] hover:bg-[#252525]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 text-xs text-[#525252] border-t border-[#333] mt-2 pt-2 sm:hidden">
                {session.user?.email}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Subscription Banner */}
      {subscription && pathname !== '/pricing' && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <TrialBanner
            tier={subscription.tier as 'free' | 'trial' | 'pro'}
            daysRemaining={subscription.daysRemaining}
            isExpired={subscription.isExpired}
          />
        </div>
      )}

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
