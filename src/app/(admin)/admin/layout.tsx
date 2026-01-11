'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const adminNavLinks = [
  { href: '/admin', label: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/lessons', label: 'lessons', icon: BookOpen },
  { href: '/admin/users', label: 'users', icon: Users },
  { href: '/admin/analytics', label: 'analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Check if user is admin
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#737373] font-mono animate-pulse">
          authenticating admin access...
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-[#333] bg-[#1A1A1A] transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#333]">
          {sidebarOpen && (
            <Link href="/admin" className="text-[#D97706] font-mono font-bold">
              ADMIN
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525] rounded transition-colors"
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors',
                  isActive
                    ? 'bg-[#D97706]/10 text-[#D97706]'
                    : 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-[#333]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525] rounded font-mono text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {sidebarOpen && <span>back to app</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-[#333] bg-[#1A1A1A]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#737373] hover:text-[#E5E5E5] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-[#D97706] font-mono font-bold md:hidden">ADMIN</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#737373] font-mono hidden sm:inline">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 text-[#737373] hover:text-[#EF4444] transition-colors font-mono text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-b border-[#333] bg-[#1A1A1A] px-4 py-2">
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors',
                    isActive
                      ? 'bg-[#D97706]/10 text-[#D97706]'
                      : 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#252525]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
