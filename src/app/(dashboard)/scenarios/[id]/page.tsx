'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ExerciseContainer } from '@/components/exercise/exercise-container';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: lesson, isLoading, error } = trpc.scenario.getById.useQuery({ lessonId: id });

  const handleComplete = () => {
    // Could show a celebration, then redirect to dashboard
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <TerminalWindow title={`~/scenarios/${id}`}>
          <TerminalLine prefixColor="muted" animate>
            loading scenario...
          </TerminalLine>
        </TerminalWindow>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <TerminalWindow title="~/error">
          <div className="space-y-4">
            <TerminalLine prefix="error:" prefixColor="error">
              scenario not found
            </TerminalLine>
            <TerminalLine prefixColor="muted">
              the requested scenario &quot;{id}&quot; does not exist.
            </TerminalLine>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-[#333] bg-transparent text-[#E5E5E5] hover:bg-[#333] font-mono"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              back to dashboard
            </Button>
          </div>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Button
        onClick={() => router.push('/')}
        variant="ghost"
        size="sm"
        className="text-[#737373] hover:text-[#E5E5E5] hover:bg-transparent font-mono"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        back to scenarios
      </Button>

      {/* Exercise */}
      <ExerciseContainer lesson={lesson} onComplete={handleComplete} />
    </div>
  );
}
