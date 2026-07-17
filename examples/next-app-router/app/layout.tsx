// @file examples/next-app-router/app/layout.tsx
// @description Root layout for the FCSS App Router example fixture.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import '@fcss/core/full.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FCSS App Router Example',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="margin--0 padding--0">{children}</body>
    </html>
  );
}
