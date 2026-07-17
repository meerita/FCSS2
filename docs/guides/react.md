# React Guide

This guide covers using FCSS in a React project with Create React App, a custom Webpack setup, or as a standalone integration.

For Vite-based React projects, see the [Vite section of the Installation guide](../installation.md#react--vite).

## Setup

```bash
npm install @fcss/core
```

Import the full CSS set in your root entry point:

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fcss/core/fcss.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## Using classes in components

Assign FCSS classes via the standard `className` prop:

```tsx
function Card({ title, body }: { title: string; body: string }) {
  return (
    <article className="display--flex flex-direction--column gap--8px padding--1rem border-radius--0-5rem background-color--white">
      <h2 className="font-size--1-25rem font-weight--600 color--black">{title}</h2>
      <p className="font-size--1rem color--gray line-height--1-5">{body}</p>
    </article>
  );
}
```

## Conditional classes

Use standard JavaScript expressions. Avoid string interpolation that builds class names dynamically — the purger cannot extract assembled strings.

```tsx
// Safe — both class names are complete literals
<button
  className={`padding--0-75rem-1-5rem border-radius--0-25rem font-weight--500 ${
    isLoading ? 'opacity--0-6 cursor--wait' : 'opacity--1 cursor--pointer'
  }`}
  disabled={isLoading}
>
  {isLoading ? 'Saving…' : 'Save'}
</button>
```

```tsx
// Also safe — conditional between two complete class strings
<div className={isOpen ? 'display--block' : 'display--none'}>Panel content</div>
```

```tsx
// Unsafe — class name is assembled at runtime, purger will miss it
<div className={`${property}--${value}`}>
```

## Responsive layout

```tsx
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="display--grid grid-template-columns--1fr lg-grid-template-columns--240px-1fr gap--0 lg-gap--2rem">
      <aside className="display--none lg-display--block padding--1-5rem">Sidebar</aside>
      <main className="padding--1rem lg-padding--2rem">{children}</main>
    </div>
  );
}
```

## State classes

```tsx
function NavLink({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <a
      href={href}
      className="color--gray color--black:hover font-weight--400 font-weight--600:aria-current:page"
      aria-current={current ? 'page' : undefined}
    >
      {label}
    </a>
  );
}
```

## Production purging

Add the PostCSS plugin to strip unused classes:

```bash
npm install -D @fcss/postcss
```

```js
// postcss.config.js
const { fcssPlugin } = require('@fcss/postcss');

module.exports = {
  plugins: [
    process.env.NODE_ENV === 'production' &&
      fcssPlugin({
        content: ['src/**/*.{ts,tsx}'],
      }),
  ].filter(Boolean),
};
```

Or use `fcss.config.ts` for configuration shared across tools:

```ts
// fcss.config.ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['src/**/*.{ts,tsx}'],
  safelist: ['display--none', 'display--block'],
});
```

## IntelliSense

Install `@fcss/vscode` from the VS Code marketplace for autocompletion of FCSS class names in JSX files.
