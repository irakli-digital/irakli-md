import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from '@/lib/trpc/provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Irakli Chkheidze | Builder, Educator, Digital Strategist',
  description: 'Building products, teaching AI, scaling digital. Head of Digital Acquisition & Telesales at TBC/Payme. AI Educator & Builder.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#1A1A1A] text-[#E5E5E5]`}>
        <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
