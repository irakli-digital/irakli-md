'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { ChevronLeft, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import Link from 'next/link';

export default function LessonEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'scenario' | 'evaluation' | 'context'>(
    'scenario'
  );
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isDirty, setIsDirty] = useState(false);

  const { data: lesson, isLoading } = trpc.admin.lessons.getById.useQuery({ id });
  const updateMutation = trpc.admin.lessons.update.useMutation({
    onSuccess: () => {
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    }
  }, [lesson]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      id,
      data: {
        title: formData.title as string,
        context: formData.context as string,
        goal: formData.goal as string,
        constraints: formData.constraints as string[],
        hints: formData.hints as string[],
        exampleInput: formData.exampleInput as string,
        difficulty: formData.difficulty as number,
        estimatedMinutes: formData.estimatedMinutes as number,
        tags: formData.tags as string[],
        rubric: formData.rubric as {
          id: string;
          name: string;
          weight: number;
          description: string;
          scoringGuide: {
            excellent: string;
            good: string;
            adequate: string;
            poor: string;
          };
        }[],
        passingScore: formData.passingScore as number,
        idealResponse: formData.idealResponse as string,
        commonMistakes: formData.commonMistakes as string[],
        keyElements: formData.keyElements as string[],
        antiPatterns: formData.antiPatterns as string[],
        isPublished: formData.isPublished as boolean,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading lesson...</div>
    );
  }

  if (!lesson) {
    return <div className="text-[#EF4444] font-mono">lesson not found</div>;
  }

  const tabs = [
    { id: 'scenario', label: 'scenario' },
    { id: 'evaluation', label: 'evaluation' },
    { id: 'context', label: 'evaluator context' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/lessons"
            className="p-2 text-[#737373] hover:text-[#E5E5E5] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-mono text-[#E5E5E5]">{id}</h1>
            <p className="text-sm text-[#737373] font-mono mt-0.5">
              stage {lesson.stage} / {lesson.skill}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'px-2 py-1 rounded text-xs font-mono',
              formData.isPublished
                ? 'bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#737373]/20 text-[#737373]'
            )}
          >
            {formData.isPublished ? 'published' : 'draft'}
          </span>
          <button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-colors',
              isDirty
                ? 'bg-[#D97706] text-[#1A1A1A] hover:bg-[#F59E0B]'
                : 'bg-[#333] text-[#737373] cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#333]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-2 font-mono text-sm transition-colors relative',
              activeTab === tab.id
                ? 'text-[#D97706]'
                : 'text-[#737373] hover:text-[#E5E5E5]'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#252525] border border-[#333] rounded-lg p-6">
        {activeTab === 'scenario' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">title</label>
              <input
                type="text"
                value={(formData.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
              />
            </div>

            {/* Context */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                context
              </label>
              <textarea
                value={(formData.context as string) || ''}
                onChange={(e) => handleChange('context', e.target.value)}
                rows={4}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">goal</label>
              <textarea
                value={(formData.goal as string) || ''}
                onChange={(e) => handleChange('goal', e.target.value)}
                rows={2}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                constraints
              </label>
              <ArrayEditor
                items={(formData.constraints as string[]) || []}
                onChange={(items) => handleChange('constraints', items)}
                placeholder="add constraint..."
              />
            </div>

            {/* Hints */}
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">hints</label>
              <ArrayEditor
                items={(formData.hints as string[]) || []}
                onChange={(items) => handleChange('hints', items)}
                placeholder="add hint..."
              />
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  difficulty
                </label>
                <select
                  value={(formData.difficulty as number) || 1}
                  onChange={(e) => handleChange('difficulty', parseInt(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  est. minutes
                </label>
                <input
                  type="number"
                  value={(formData.estimatedMinutes as number) || 5}
                  onChange={(e) =>
                    handleChange('estimatedMinutes', parseInt(e.target.value))
                  }
                  min={1}
                  max={60}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#737373] font-mono text-sm mb-2">
                  published
                </label>
                <button
                  onClick={() => handleChange('isPublished', !formData.isPublished)}
                  className={cn(
                    'w-full px-4 py-2 rounded font-mono text-sm transition-colors',
                    formData.isPublished
                      ? 'bg-[#22C55E]/20 text-[#22C55E]'
                      : 'bg-[#333] text-[#737373]'
                  )}
                >
                  {formData.isPublished ? 'yes' : 'no'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                passing score
              </label>
              <input
                type="number"
                value={(formData.passingScore as number) || 70}
                onChange={(e) => handleChange('passingScore', parseInt(e.target.value))}
                min={50}
                max={100}
                className="w-32 bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                rubric items (weights must sum to 100)
              </label>
              <div className="text-[#737373] font-mono text-sm">
                rubric editor - see lesson JSON for structure
              </div>
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                ideal response
              </label>
              <textarea
                value={(formData.idealResponse as string) || ''}
                onChange={(e) => handleChange('idealResponse', e.target.value)}
                rows={8}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-2 text-sm font-mono text-[#E5E5E5] focus:border-[#D97706] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                common mistakes
              </label>
              <ArrayEditor
                items={(formData.commonMistakes as string[]) || []}
                onChange={(items) => handleChange('commonMistakes', items)}
                placeholder="add common mistake..."
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                key elements
              </label>
              <ArrayEditor
                items={(formData.keyElements as string[]) || []}
                onChange={(items) => handleChange('keyElements', items)}
                placeholder="add key element..."
              />
            </div>

            <div>
              <label className="block text-[#737373] font-mono text-sm mb-2">
                anti-patterns
              </label>
              <ArrayEditor
                items={(formData.antiPatterns as string[]) || []}
                onChange={(items) => handleChange('antiPatterns', items)}
                placeholder="add anti-pattern..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for editing string arrays
function ArrayEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded px-3 py-2"
        >
          <GripVertical className="h-4 w-4 text-[#525252] shrink-0" />
          <span className="flex-1 text-sm font-mono text-[#E5E5E5] truncate">{item}</span>
          <button
            onClick={() => handleRemove(index)}
            className="text-[#737373] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] placeholder:text-[#525252] focus:border-[#D97706] outline-none"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-[#333] text-[#737373] hover:text-[#E5E5E5] rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
