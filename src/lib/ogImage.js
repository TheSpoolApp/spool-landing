import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

// Branded 1200x630 social preview with the post title, shared by /blog and /compare.
export async function renderOgImage({ title, eyebrow }) {
  const logo = await readFile(join(process.cwd(), 'public/images/spooli_logo.jpg'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #dff1fb 0%, #f3e8ff 55%, #ffe1ea 100%)',
          color: '#1A1A1A',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logoSrc} alt="" width={72} height={72} style={{ borderRadius: 18 }} />
          <span style={{ fontSize: 40, fontWeight: 700 }}>Spool</span>
          <span style={{ marginLeft: 'auto', fontSize: 26, color: '#FF6B35', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
            {eyebrow}
          </span>
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 60 ? 58 : 68, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#4a4a4a' }}>
          Stop doomscrolling with voice check-ins · thespoolapp.com
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
