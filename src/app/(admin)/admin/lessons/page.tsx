'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, Eye, EyeOff, Edit } from 'lucide-react';

export default function AdminLessonsPage() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.lessons.list.useQuery({
    search: search || undefined,
    stage,
    page,
    limit: 20,
  });

  const togglePublish = trpc.admin.lessons.togglePublish.useMutation({
    onSuccess: () => refetch(),
  });

  const stageColors: Record<number, string> = {
    1: '#3B82F6',
    2: '#8B5CF6',
    3: '#F59E0B',
    4: '#10B981',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">lessons</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">manage lesson content</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
          <input
            type="text"
            placeholder="search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#252525] border border-[#333] rounded px-10 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#737373] focus:border-[#D97706] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStage(undefined)}
            className={cn(
              'px-3 py-2 rounded font-mono text-xs transition-colors',
              stage === undefined
                ? 'bg-[#D97706]/20 text-[#D97706]'
                : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
            )}
          >
            all
          </button>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={cn(
                'px-3 py-2 rounded font-mono text-xs transition-colors',
                stage === s
                  ? 'text-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#E5E5E5] bg-[#252525]'
              )}
              style={{ backgroundColor: stage === s ? stageColors[s] + '33' : undefined }}
            >
              stage {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-[#252525] border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-[#333] text-[#737373]">
              <th className="text-left px-4 py-3">id</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">title</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">skill</th>
              <th className="text-center px-4 py-3">status</th>
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
            ) : data?.lessons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#737373]">
                  no lessons found
                </td>
              </tr>
            ) : (
              data?.lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-[#333] last:border-0">
                  <td className="px-4 py-3 text-[#E5E5E5]">{lesson.id}</td>
                  <td className="px-4 py-3 text-[#A3A3A3] hidden md:table-cell truncate max-w-[200px]">
                    {lesson.title}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: stageColors[lesson.stage] + '20',
                        color: stageColors[lesson.stage],
                      }}
                    >
                      {lesson.skill}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lesson.isPublished ? (
                      <span className="text-[#22C55E]">published</span>
                    ) : (
                      <span className="text-[#737373]">draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish.mutate({ id: lesson.id })}
                        className="p-1.5 text-[#737373] hover:text-[#E5E5E5] transition-colors"
                        title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {lesson.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="p-1.5 text-[#737373] hover:text-[#D97706] transition-colors"
                        title="Edit"
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
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 text-[#737373] hover:text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
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
