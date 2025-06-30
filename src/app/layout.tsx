// File: src/app/layout.tsx (Server Component)

import type { Metadata } from 'next';
import ThemeRegistry from './ThemeRegistry';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Using MUI with Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
