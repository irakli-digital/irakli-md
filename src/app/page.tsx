'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, Cpu, Rocket } from 'lucide-react';

const bootSequence = [
  'initializing session...',
  'loading modules... done',
  'connecting to platform... connected',
  'ready.',
];

const stages = [
  {
    number: 1,
    name: 'Prompting',
    description: 'Get correct reasoning and output from AI',
    color: '#3B82F6',
    icon: Target,
  },
  {
    number: 2,
    name: 'Structuring',
    description: 'Turn AI output into machine-usable data',
    color: '#8B5CF6',
    icon: Cpu,
  },
  {
    number: 3,
    name: 'Automation',
    description: 'Wire AI into workflows that run autonomously',
    color: '#F59E0B',
    icon: Zap,
  },
  {
    number: 4,
    name: 'Productization',
    description: 'Ship real products with AI assistance',
    color: '#10B981',
    icon: Rocket,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bootStep, setBootStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Boot sequence animation
  useEffect(() => {
    if (status === 'loading') return;

    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= bootSequence.length - 1) {
          clearInterval(timer);
          setTimeout(() => setShowContent(true), 300);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [status]);

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#737373] font-mono animate-pulse">loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Terminal Window */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Terminal Header */}
        <div className="rounded-t-lg border border-[#333] bg-[#252525] px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          </div>
          <span className="text-[#737373] text-sm ml-2">~/ai-literacy</span>
        </div>

        {/* Terminal Content */}
        <div className="rounded-b-lg border border-t-0 border-[#333] bg-[#1A1A1A] p-6 min-h-[600px]">
          {/* Boot Sequence */}
          <div className="space-y-1 mb-8">
            {bootSequence.slice(0, bootStep + 1).map((line, i) => (
              <div
                key={i}
                className="font-mono text-sm animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-[#737373]">{line}</span>
                {line.includes('done') && <span className="text-[#22C55E]"> done</span>}
                {line.includes('connected') && <span className="text-[#22C55E]"> connected</span>}
              </div>
            ))}
          </div>

          {/* Main Content */}
          {showContent && (
            <div className="space-y-8 animate-fade-in">
              {/* ASCII Logo */}
              <pre className="text-[#D97706] text-xs sm:text-sm leading-tight">
{`   █████╗ ██╗    ██╗     ██╗████████╗
  ██╔══██╗██║    ██║     ██║╚══██╔══╝
  ███████║██║    ██║     ██║   ██║
  ██╔══██║██║    ██║     ██║   ██║
  ██║  ██║██║    ███████╗██║   ██║
  ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝   ╚═╝   `}
              </pre>

              {/* Tagline */}
              <div className="space-y-2">
                <p className="text-[#E5E5E5] text-lg font-mono">
                  learn AI by doing. not watching.
                </p>
                <p className="text-[#A3A3A3] font-mono text-sm">
                  practice-first AI literacy platform. 60 scenarios. 4 stages. real skills.
                </p>
              </div>

              {/* The 4 Stages */}
              <div className="border border-[#333] rounded-lg p-4 bg-[#252525]">
                <p className="text-[#737373] text-sm font-mono mb-4">
                  {'> '}the 4-stage framework:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {stages.map((stage) => (
                    <div
                      key={stage.number}
                      className="flex items-start gap-3 p-3 rounded border border-[#333] bg-[#1A1A1A]"
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${stage.color}20` }}
                      >
                        <stage.icon className="w-4 h-4" style={{ color: stage.color }} />
                      </div>
                      <div>
                        <p className="font-mono text-sm" style={{ color: stage.color }}>
                          stage {stage.number}: {stage.name.toLowerCase()}
                        </p>
                        <p className="text-[#737373] text-xs font-mono mt-0.5">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm font-mono">
                <div>
                  <span className="text-[#D97706]">60</span>
                  <span className="text-[#737373] ml-1">scenarios</span>
                </div>
                <div>
                  <span className="text-[#D97706]">4</span>
                  <span className="text-[#737373] ml-1">certifications</span>
                </div>
                <div>
                  <span className="text-[#D97706]">AI-powered</span>
                  <span className="text-[#737373] ml-1">evaluation</span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-[#737373] font-mono text-sm">
                  <span>{'>'}</span>
                  <span className="text-[#E5E5E5]">ready to start?</span>
                  <span className="w-2 h-4 bg-[#D97706] animate-pulse" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono text-sm rounded transition-colors"
                  >
                    start learning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#333] hover:border-[#D97706] text-[#E5E5E5] font-mono text-sm rounded transition-colors"
                  >
                    sign in
                  </Link>
                </div>

                <p className="text-[#737373] font-mono text-xs">
                  free tier available. no credit card required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#737373]">
          <span>ai literacy platform v1.0</span>
          <span className="flex items-center gap-2">
            powered by <span className="text-[#D97706]">Claude</span>
          </span>
        </div>
      </div>
    </div>
  );
}
