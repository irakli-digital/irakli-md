import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Irakli Chkheidze — Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111111',
          fontFamily: 'monospace',
        }}
      >
        {/* Big /c */}
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            color: '#F59E0B',
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          /c
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#E5E5E5',
            marginBottom: 16,
          }}
        >
          Irakli Chkheidze
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 18,
            color: '#A3A3A3',
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 16,
            color: '#D97706',
            marginTop: 24,
          }}
        >
          irakli.md
        </div>
      </div>
    ),
    { ...size }
  );
}
