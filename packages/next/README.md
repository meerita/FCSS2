<!--
@file packages/next/README.md
@description @fcss/next integration guide for App Router and Pages Router.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/next

Official Next.js integration for [FCSS](../../README.md) — wraps your Next.js config with `withFcss()` to enable production CSS purging without hydration mismatches.

## Installation

```bash
pnpm add @fcss/core @fcss/next
```

## App Router

**`next.config.ts`** (Next.js 14+):

```typescript
import { withFcss } from '@fcss/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};
export default withFcss(nextConfig);
```

**`app/layout.tsx`**:

```tsx
import '@fcss/core/full.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Pages Router

**`pages/_app.tsx`**:

```tsx
import '@fcss/core/full.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## Configuration

Create `fcss.config.ts` in your project root to customise scanning paths:

```typescript
import type { FcssNextConfig } from '@fcss/next';

const config: FcssNextConfig = {
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', '!node_modules/**'],
};

export default config;
```

Default content paths (used when no config file is found):

- `app/**/*.{js,jsx,ts,tsx}`
- `pages/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `src/**/*.{js,jsx,ts,tsx}`

## Monorepo scanning

To scan components from a shared package in your monorepo, add the package path to `content`:

```typescript
const config: FcssNextConfig = {
  content: ['app/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}', '!node_modules/**'],
};
```

## CSS Modules

FCSS global utilities and CSS Modules coexist without conflict. Import `@fcss/core/full.css` once globally and use CSS Modules normally for component-scoped styles.

## Notes

- `withFcss()` does not add `'use client'` directives — FCSS classes are plain strings and work in Server Components without special handling.
- Production purging is CSS-only; no runtime JavaScript is added to the browser bundle.
- SSR and static generation are unaffected.
