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
  title: 'Irakli Chkheidze | Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.',
  description: 'Head of Digital Acquisition & Telesales at TBC/Payme. 19.4M+ users, 300+ team, $15M+ budgets. AI Educator & Builder.',
  metadataBase: new URL('https://irakli.md'),
  openGraph: {
    title: 'Irakli Chkheidze',
    description: 'Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.',
    siteName: 'irakli.md',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Irakli Chkheidze — Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Irakli Chkheidze',
    description: 'Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.',
    creator: '@IrakliDigital',
    images: ['/opengraph-image'],
  },
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
