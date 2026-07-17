// @file packages/cli/src/index.ts
// @description @fcss/cli public API — exports defineConfig and command runners.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export { defineConfig } from './config/define-config.js';
export { loadConfig } from './config/loader.js';
export { validateConfig, ConfigValidationError } from './config/validate.js';
export type {
  FcssConfig,
  FcssColorTokens,
  FcssDataState,
  FcssCustomBreakpoint,
} from './config/schema.js';

export { runBuild } from './commands/build.js';
export { runPurge } from './commands/purge.js';
export { runInit } from './commands/init.js';
export { runAudit } from './commands/audit.js';
export { runDoctor } from './commands/doctor.js';
export { runList } from './commands/list.js';
export { runExplain } from './commands/explain.js';
export { runMigrate } from './commands/migrate.js';
