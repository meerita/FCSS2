// @file examples/react-vite/src/main.tsx
// @description React+Vite example entry point — mounts the app and imports FCSS full CSS.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fcss/core/full.css';
import App from './App.js';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
