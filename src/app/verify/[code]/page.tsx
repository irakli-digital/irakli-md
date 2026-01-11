'use client';

import { use } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Award, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { data: result, isLoading } = trpc.certifications.verify.useQuery({ code });

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Terminal Header */}
        <div className="rounded-t-lg border border-[#333] bg-[#252525] px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          </div>
          <span className="text-[#737373] text-sm ml-2">~/verify/{code}</span>
        </div>

        {/* Content */}
        <div className="rounded-b-lg border border-t-0 border-[#333] bg-[#1A1A1A] p-6">
          {isLoading ? (
            <div className="text-center">
              <div className="text-[#737373] font-mono animate-pulse">
                verifying certificate...
              </div>
            </div>
          ) : result?.valid ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E]/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-[#22C55E]" />
                </div>
                <h1 className="text-[#22C55E] font-mono text-lg">verified</h1>
              </div>

              <div className="bg-[#252525] border border-[#333] rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-[#D97706]" />
                  <div>
                    <p className="text-[#E5E5E5] font-mono text-sm">
                      {result.certification?.name}
                    </p>
                    <p className="text-[#737373] font-mono text-xs">
                      AI Literacy Certification
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <p className="text-[#737373]">holder</p>
                    <p className="text-[#E5E5E5]">{result.certification?.holderName}</p>
                  </div>
                  <div>
                    <p className="text-[#737373]">score</p>
                    <p className="text-[#E5E5E5]">{result.certification?.score}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#737373]">issued</p>
                    <p className="text-[#E5E5E5]">
                      {result.certification?.issuedAt
                        ? new Date(result.certification.issuedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-[#525252] font-mono text-xs">
                this certificate was issued by AI Literacy Platform
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EF4444]/10 mb-4">
                <XCircle className="h-8 w-8 text-[#EF4444]" />
              </div>
              <div>
                <h1 className="text-[#EF4444] font-mono text-lg">not found</h1>
                <p className="text-[#737373] font-mono text-sm mt-2">
                  this verification code is invalid or does not exist
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#333]">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-[#737373] hover:text-[#E5E5E5] font-mono text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              back to ai literacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
