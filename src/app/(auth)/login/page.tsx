'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { CommandInput } from '@/components/terminal/command-input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailSubmit = () => {
    if (email.includes('@')) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = async () => {
    if (password.length < 6) return;

    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/');
    } else {
      setError('authentication failed. try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <TerminalWindow title="~/ai-literacy/login" className="w-full max-w-lg">
        <div className="space-y-4">
          {/* Boot sequence */}
          <div className="space-y-1">
            <TerminalLine prefixColor="muted">initializing session...</TerminalLine>
            <TerminalLine prefixColor="muted">
              loading authentication module... <span className="text-[#22C55E]">done</span>
            </TerminalLine>
          </div>

          {/* ASCII Logo */}
          <pre className="text-[#D97706] text-xs leading-tight my-6">
{`   █████╗ ██╗    ██╗     ██╗████████╗
  ██╔══██╗██║    ██║     ██║╚══██╔══╝
  ███████║██║    ██║     ██║   ██║
  ██╔══██║██║    ██║     ██║   ██║
  ██║  ██║██║    ███████╗██║   ██║
  ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝   ╚═╝   `}
          </pre>

          <TerminalLine prefixColor="muted">learn AI by doing. practice makes perfect.</TerminalLine>

          <div className="h-4" />

          {/* Email Input */}
          <div className="space-y-2">
            <TerminalLine prefix="email:" prefixColor="accent">
              {step === 'password' ? email : ''}
            </TerminalLine>
            {step === 'email' && (
              <CommandInput
                value={email}
                onChange={setEmail}
                onSubmit={handleEmailSubmit}
                prompt=">"
                placeholder="enter your email..."
              />
            )}
          </div>

          {/* Password Input */}
          {step === 'password' && (
            <div className="space-y-2">
              <TerminalLine prefix="password:" prefixColor="accent">
                {'•'.repeat(password.length)}
              </TerminalLine>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="enter password (min 6 chars)..."
                  className="flex-1 bg-[#2D2D2D] border border-[#333] rounded px-3 py-2 text-[#E5E5E5] font-mono text-sm placeholder:text-[#737373] outline-none focus:border-[#D97706]"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <TerminalLine prefix="error:" prefixColor="error">
              {error}
            </TerminalLine>
          )}

          {/* Submit Button */}
          {step === 'password' && (
            <Button
              onClick={handlePasswordSubmit}
              disabled={loading || password.length < 6}
              className="w-full bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono"
            >
              {loading ? 'authenticating...' : '[ authenticate ]'}
            </Button>
          )}

          <div className="h-2" />

          <TerminalLine prefixColor="muted" className="text-xs">
            new user? just enter any email to create an account.
          </TerminalLine>
        </div>
      </TerminalWindow>
    </div>
  );
}
