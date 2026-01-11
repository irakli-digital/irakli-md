'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Award, CheckCircle, Lock, ExternalLink, Copy, Check, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const stageInfo = [
  {
    stage: 1,
    name: 'Prompt Engineer L1',
    description: 'Master the fundamentals of AI prompting',
    color: '#3B82F6',
  },
  {
    stage: 2,
    name: 'AI Systems Designer L2',
    description: 'Structure AI output for machine consumption',
    color: '#8B5CF6',
  },
  {
    stage: 3,
    name: 'AI Automation Specialist L3',
    description: 'Build autonomous AI-powered workflows',
    color: '#F59E0B',
  },
  {
    stage: 4,
    name: 'AI Product Builder L4',
    description: 'Ship real products with AI assistance',
    color: '#10B981',
  },
];

export default function CertificationsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const { data: certs, isLoading: certsLoading } = trpc.certifications.list.useQuery();
  const { data: eligibility, isLoading: eligibilityLoading } = trpc.certifications.checkEligibility.useQuery(
    { stage: selectedStage || 1 },
    { enabled: selectedStage !== null }
  );

  const issueMutation = trpc.certifications.issue.useMutation({
    onSuccess: () => {
      setSelectedStage(null);
    },
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (certsLoading) {
    return (
      <div className="text-[#737373] font-mono animate-pulse">loading certifications...</div>
    );
  }

  const earnedCerts = certs || [];
  const earnedStages = new Set(earnedCerts.map((c) => parseInt(c.type.replace('stage_', ''))));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono text-[#E5E5E5]">certifications</h1>
        <p className="text-sm text-[#737373] font-mono mt-1">
          earn certifications by completing all lessons in a stage
        </p>
      </div>

      {/* Earned Certifications */}
      {earnedCerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[#A3A3A3] font-mono text-sm">earned certificates</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#252525] border border-[#333] rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Award
                      className="h-5 w-5"
                      style={{ color: stageInfo[parseInt(cert.type.replace('stage_', '')) - 1]?.color }}
                    />
                    <span className="text-[#E5E5E5] font-mono text-sm">{cert.name}</span>
                  </div>
                  <span className="text-[#22C55E] font-mono text-sm">{cert.score}%</span>
                </div>

                <div className="text-[#737373] font-mono text-xs">
                  issued {new Date(cert.issuedAt!).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 bg-[#1A1A1A] rounded px-3 py-2">
                  <span className="text-[#737373] font-mono text-xs">verification:</span>
                  <code className="text-[#D97706] font-mono text-xs">{cert.verificationCode}</code>
                  <button
                    onClick={() => copyCode(cert.verificationCode!)}
                    className="ml-auto p-1 text-[#737373] hover:text-[#E5E5E5] transition-colors"
                  >
                    {copiedCode === cert.verificationCode ? (
                      <Check className="h-3 w-3 text-[#22C55E]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Certifications */}
      <div className="space-y-4">
        <h2 className="text-[#A3A3A3] font-mono text-sm">
          {earnedCerts.length > 0 ? 'more certifications' : 'available certifications'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {stageInfo.map((info) => {
            const isEarned = earnedStages.has(info.stage);
            const isSelected = selectedStage === info.stage;

            return (
              <div
                key={info.stage}
                className={cn(
                  'bg-[#252525] border rounded-lg p-4 space-y-3 transition-colors',
                  isEarned
                    ? 'border-[#22C55E]/30'
                    : isSelected
                      ? 'border-[#D97706]'
                      : 'border-[#333] hover:border-[#525252]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {isEarned ? (
                      <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                    ) : (
                      <Target className="h-5 w-5" style={{ color: info.color }} />
                    )}
                    <span className="text-[#E5E5E5] font-mono text-sm">{info.name}</span>
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${info.color}20`,
                      color: info.color,
                    }}
                  >
                    stage {info.stage}
                  </span>
                </div>

                <p className="text-[#737373] font-mono text-xs">{info.description}</p>

                {!isEarned && (
                  <button
                    onClick={() => setSelectedStage(isSelected ? null : info.stage)}
                    className={cn(
                      'w-full px-3 py-2 rounded font-mono text-xs transition-colors',
                      isSelected
                        ? 'bg-[#D97706]/20 text-[#D97706]'
                        : 'bg-[#333] text-[#737373] hover:text-[#E5E5E5]'
                    )}
                  >
                    {isSelected ? 'hide requirements' : 'check eligibility'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eligibility Modal */}
      {selectedStage !== null && (
        <div className="bg-[#252525] border border-[#333] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#E5E5E5] font-mono text-sm">
              stage {selectedStage} certification requirements
            </h3>
            <button
              onClick={() => setSelectedStage(null)}
              className="text-[#737373] hover:text-[#E5E5E5] font-mono text-xs"
            >
              close
            </button>
          </div>

          {eligibilityLoading ? (
            <div className="text-[#737373] font-mono text-sm animate-pulse">
              checking eligibility...
            </div>
          ) : eligibility?.alreadyCertified ? (
            <div className="flex items-center gap-2 text-[#22C55E] font-mono text-sm">
              <CheckCircle className="h-4 w-4" />
              already certified!
            </div>
          ) : eligibility?.progress ? (
            <div className="space-y-4">
              {/* Lessons Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-[#737373]">lessons completed</span>
                  <span
                    className={cn(
                      eligibility.progress.lessonsCompleted >= eligibility.progress.lessonsRequired
                        ? 'text-[#22C55E]'
                        : 'text-[#E5E5E5]'
                    )}
                  >
                    {eligibility.progress.lessonsCompleted} / {eligibility.progress.lessonsRequired}
                  </span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (eligibility.progress.lessonsCompleted / eligibility.progress.lessonsRequired) * 100)}%`,
                      backgroundColor:
                        eligibility.progress.lessonsCompleted >= eligibility.progress.lessonsRequired
                          ? '#22C55E'
                          : stageInfo[selectedStage - 1]?.color,
                    }}
                  />
                </div>
              </div>

              {/* Average Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-[#737373]">average score</span>
                  <span
                    className={cn(
                      eligibility.progress.averageScore >= eligibility.progress.requiredScore
                        ? 'text-[#22C55E]'
                        : 'text-[#E5E5E5]'
                    )}
                  >
                    {eligibility.progress.averageScore}% (min: {eligibility.progress.requiredScore}%)
                  </span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${eligibility.progress.averageScore}%`,
                      backgroundColor:
                        eligibility.progress.averageScore >= eligibility.progress.requiredScore
                          ? '#22C55E'
                          : stageInfo[selectedStage - 1]?.color,
                    }}
                  />
                </div>
              </div>

              {/* Claim Button */}
              {eligibility.eligible ? (
                <button
                  onClick={() => issueMutation.mutate({ stage: selectedStage })}
                  disabled={issueMutation.isPending}
                  className="w-full px-4 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] rounded font-mono text-sm transition-colors"
                >
                  {issueMutation.isPending ? 'issuing certificate...' : 'claim certification'}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-[#333] rounded text-[#737373] font-mono text-sm">
                  <Lock className="h-4 w-4" />
                  complete more lessons to unlock
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Verify Link */}
      <div className="text-center text-[#525252] font-mono text-xs">
        share your verification code to let others verify your certification
      </div>
    </div>
  );
}
