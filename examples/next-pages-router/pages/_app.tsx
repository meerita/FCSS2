// @file examples/next-pages-router/pages/_app.tsx
// @description Next.js _app for global CSS injection in the Pages Router fixture.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import '@fcss/core/full.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
