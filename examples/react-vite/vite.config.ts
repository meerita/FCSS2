// @file examples/react-vite/vite.config.ts
// @description Vite configuration for the FCSS React+Vite example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fcss } from '@fcss/vite';

export default defineConfig({
  plugins: [react(), fcss()],
});
