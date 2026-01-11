'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState<'free' | 'trial' | 'pro' | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.users.list.useQuery({
    search: search || undefined,
    subscriptionTier: tier,
    page,
    limit: 20,
  });

  const updateSubscription = trpc.admin.users.updateSubscription.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">users</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          manage user accounts and subscriptions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
          <input
            type="text"
            placeholder="search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#252525] border border-[#333] rounded px-10 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#737373] focus:border-[#D97706] outline-none"
          />
        </div>
        <div className="flex gap-2">
          {[undefined, 'free', 'trial', 'pro'].map((t) => (
            <button
              key={t ?? 'all'}
              onClick={() => setTier(t as typeof tier)}
              className={cn(
                'px-3 py-2 rounded font-mono text-xs transition-colors',
                tier === t
                  ? 'bg-[#D97706]/20 text-[#D97706]'
                  : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
              )}
            >
              {t ?? 'all'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#252525] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-[#333] text-[#737373]">
              <th className="text-left px-4 py-3">email</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">level</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">xp</th>
              <th className="text-center px-4 py-3">subscription</th>
              <th className="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  loading...
                </td>
              </tr>
            ) : data?.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  no users found
                </td>
              </tr>
            ) : (
              data?.users.map((user) => (
                <tr key={user.id} className="border-b border-[#333] last:border-0">
                  <td className="px-4 py-3 text-[#E5E5E5] truncate max-w-[200px]">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden md:table-cell">
                    {user.level}
                  </td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden sm:table-cell">
                    {user.totalXp?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs',
                        user.subscriptionTier === 'pro'
                          ? 'bg-[#D97706]/20 text-[#D97706]'
                          : user.subscriptionTier === 'trial'
                            ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                            : 'bg-[#333] text-[#737373]'
                      )}
                    >
                      {user.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.subscriptionTier || 'free'}
                        onChange={(e) =>
                          updateSubscription.mutate({
                            userId: user.id,
                            tier: e.target.value as 'free' | 'trial' | 'pro',
                          })
                        }
                        className="bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-xs font-mono text-[#E5E5E5]"
                      >
                        <option value="free">free</option>
                        <option value="trial">trial</option>
                        <option value="pro">pro</option>
                      </select>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 text-[#737373] hover:text-[#D97706] transition-colors"
                        title="View Details"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#333]">
            <span className="text-[#737373] text-sm">
              page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
