# Next.js Guide

`@functionalcss/next` wraps your Next.js config so `next build` purges the classes you don't
use. App Router and Pages Router both work. Supported: Next.js 14, 15 and 16.

## Install

```bash
npm install @functionalcss/core @functionalcss/next
# or
bun add @functionalcss/core @functionalcss/next
```

## Configure

```ts
// next.config.ts
import type { NextConfig } from 'next';
import { withFcss } from '@functionalcss/next';

const nextConfig: NextConfig = {
  // your existing config
};

export default withFcss(nextConfig);
```

## Import the stylesheet

App Router:

```tsx
// app/layout.tsx
import '@functionalcss/core/full.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Pages Router:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@functionalcss/core/full.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## Build

Next.js 16 builds with Turbopack by default. FCSS purges through webpack, so on 16 the build
script needs the flag:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack"
  }
}
```

Then `npm run build` or `bun run build`. Next.js 14 and 15 already build with webpack and need
nothing extra.

Forget the flag on 16 and the build stops with an error telling you to add it. That's on
purpose: the alternative is quietly shipping the full 28 MB stylesheet to every visitor.
`next dev` works with either bundler.

## Content paths

By default the plugin scans:

- `app/**/*.{js,jsx,ts,tsx}`
- `pages/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `src/**/*.{js,jsx,ts,tsx}`

Anything else goes in an `fcss.config.ts` at the project root:

```ts
// fcss.config.ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  safelist: ['display--none', 'display--block', { pattern: /^color--/ }],
});
```

`defineConfig` comes from `@functionalcss/cli` (`npm install -D @functionalcss/cli` or
`bun add -d @functionalcss/cli`). A plain object export works too if you'd rather skip it.

## Using classes

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="display--flex flex-direction--column align-items--center gap--32 padding--64">
      <h1 className="font-size--4xl font-weight--700 color--black text-align--center">
        Write CSS. Use classes.
      </h1>
      <p className="font-size--xl color--gray text-align--center line-height--relaxed">
        Utility CSS with the property names you already know.
      </p>
      <a
        href="/docs/installation"
        className="padding--12 background-color--black color--white border-radius--8 background-color--dark-gray:hover"
      >
        Get started
      </a>
    </main>
  );
}
```

Server Components need nothing special. The CSS is static and adds no client JavaScript.

## Dynamic class names

The scanner reads source, so classes must appear as complete strings:

```tsx
// Fine
const style = isError ? 'color--red' : 'color--black';

// Purged: the scanner never sees "color--red"
const style = `color--${isError ? 'red' : 'black'}`;
```

Classes you can't write out in full go in the `safelist`.

## Check what survives

```bash
npx fcss audit
# or
bunx fcss audit
```

This needs `@functionalcss/cli` installed.
