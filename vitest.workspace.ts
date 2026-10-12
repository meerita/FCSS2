// @file vitest.workspace.ts
// @description Vitest workspace configuration for running tests across all packages.
// @layer root
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace(['packages/*']);
