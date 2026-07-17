# Next.js Guide

`@fcss/next` wraps your Next.js config to add automatic CSS generation and purging. It supports both the App Router and Pages Router.

## Installation

```bash
npm install @fcss/core
npm install -D @fcss/next
```

## Configuration

Wrap your Next.js config with `withFcss`:

```ts
// next.config.ts
import type { NextConfig } from 'next';
import { withFcss } from '@fcss/next';

const nextConfig: NextConfig = {
  // your existing config
};

export default withFcss(nextConfig);
```

## Importing CSS

### App Router

```tsx
// app/layout.tsx
import '@fcss/core/fcss.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@fcss/core/fcss.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## Content paths

The plugin automatically scans the following paths by default:

- `app/**/*.{js,jsx,ts,tsx}`
- `pages/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `src/**/*.{js,jsx,ts,tsx}`

To customize, create an `fcss.config.ts` at the project root:

```ts
// fcss.config.ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  safelist: ['display--none', 'display--block', { pattern: /^color--/ }],
});
```

## Using classes

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="display--flex flex-direction--column align-items--center gap--2rem padding--4rem">
      <h1 className="font-size--3rem font-weight--700 color--black text-align--center">
        Write CSS. Use classes.
      </h1>
      <p className="font-size--1-25rem color--gray max-width--60ch text-align--center line-height--1-6">
        Utility CSS using the property names you already know.
      </p>
      <a
        href="/docs/installation"
        className="display--inline-flex align-items--center padding--0-75rem-2rem background-color--black color--white border-radius--0-5rem font-weight--500 text-decoration--none color--gray:hover background-color--gray-800:hover"
      >
        Get started
      </a>
    </main>
  );
}
```

## Server Components

FCSS classes work in Server Components without any special handling. The generated CSS is static and requires no client-side JavaScript.

```tsx
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <article className="max-width--65ch margin--0-auto padding--2rem">
      <h1 className="font-size--2-5rem font-weight--700 margin-bottom--1rem">{post.title}</h1>
      <p className="color--gray font-size--0-875rem margin-bottom--2rem">{post.date}</p>
      <div
        className="font-size--1rem line-height--1-8 color--black"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
```

## Dynamic class names

Because Next.js renders on the server, class names must always be complete literal strings. Dynamic construction breaks the purger:

```tsx
// Safe
const style = isError ? 'color--red' : 'color--black';
<p className={style}>Message</p>;

// Unsafe — purger cannot extract this
const style = `color--${isError ? 'red' : 'black'}`;
<p className={style}>Message</p>;
```

Add dynamically constructed classes to the safelist in `fcss.config.ts`.

## Production build

`withFcss` runs the purge step automatically during `next build`. No additional configuration is needed if you use the default content paths or `fcss.config.ts`.

To verify which classes will be kept:

```bash
npx fcss audit --content "app/**/*.{ts,tsx}"
```
