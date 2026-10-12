# React Guide

On Vite (most React projects today), use the Vite plugin: see the
[`@functionalcss/vite` README](../../packages/vite/README.md). This guide is for React on
anything else, such as webpack or an old Create React App, where purging goes through PostCSS.

## Setup

```bash
npm install @functionalcss/core
# or
bun add @functionalcss/core
```

Import the stylesheet once, in your entry point:

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@functionalcss/core/full.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## Classes in components

`className` takes FCSS classes like any other:

```tsx
function Card({ title, body }: { title: string; body: string }) {
  return (
    <article className="display--flex flex-direction--column gap--8 padding--16 border-radius--8 background-color--white">
      <h2 className="font-size--xl font-weight--600 color--black">{title}</h2>
      <p className="font-size--base color--gray line-height--relaxed">{body}</p>
    </article>
  );
}
```

## Conditional classes

The purge step reads your source; it doesn't run it. Every class has to appear in full
somewhere in the file.

```tsx
// Fine: both branches are complete class names
<div className={isOpen ? 'display--block' : 'display--none'}>Panel</div>

<button
  className={`padding--12 border-radius--4 ${
    isLoading ? 'opacity--0.6 cursor--wait' : 'cursor--pointer'
  }`}
  disabled={isLoading}
>
  {isLoading ? 'Saving…' : 'Save'}
</button>

// Broken: assembled at runtime, so it gets purged
<div className={`${property}--${value}`} />
```

If you really need a runtime-built class, add it to the `safelist`.

## Responsive layout

Breakpoint prefixes are mobile-first. `lg-display--block` applies from 992 px up.

```tsx
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="display--grid grid-template-columns--1 lg-grid-template-columns--2 lg-gap--32">
      <aside className="display--none lg-display--block padding--24">Sidebar</aside>
      <main className="padding--16 lg-padding--32">{children}</main>
    </div>
  );
}
```

## Hover and ARIA states

```tsx
function NavLink({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <a
      href={href}
      aria-current={current ? 'page' : undefined}
      className="color--gray color--black:hover font-weight--400 font-weight--600:aria-current:page"
    >
      {label}
    </a>
  );
}
```

## Production purging

```bash
npm install -D @functionalcss/postcss
# or
bun add -d @functionalcss/postcss
```

```js
// postcss.config.js
const fcss = require('@functionalcss/postcss').default;

module.exports = {
  plugins: [
    // Purge in production only, so development keeps every class.
    process.env.NODE_ENV === 'production' &&
      fcss({
        manifest: require.resolve('@functionalcss/core/manifest.json'),
        content: ['src/**/*.{ts,tsx}'],
      }),
  ].filter(Boolean),
};
```

Your bundler has to run PostCSS on CSS imported from `node_modules`, otherwise `full.css`
never reaches the plugin. Check that before you trust the output size.

`require()` of `@functionalcss/postcss` works on Node.js 20.19 and newer, which can load ES
modules from CommonJS. On anything older, use a `postcss.config.mjs` instead (see the
[PostCSS README](../../packages/postcss/README.md)).

## Editor support

The VS Code extension lives in `packages/vscode` and isn't on the Marketplace yet.
