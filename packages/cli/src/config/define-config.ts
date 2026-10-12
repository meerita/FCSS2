// @file packages/cli/src/config/define-config.ts
// @description defineConfig() helper — validates config and merges with built-in defaults.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssConfig } from './schema.js';
import { FCSS_CONFIG_DEFAULTS } from './schema.js';
import { validateConfig, ConfigValidationError } from './validate.js';

export function defineConfig(config: FcssConfig): FcssConfig {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new ConfigValidationError(errors);
  }
  return {
    content: config.content ?? FCSS_CONFIG_DEFAULTS.content,
    ...(config.colors !== undefined ? { colors: config.colors } : {}),
    ...(config.spacing !== undefined ? { spacing: config.spacing } : {}),
    ...(config.breakpoints !== undefined ? { breakpoints: config.breakpoints } : {}),
    ...(config.dataStates !== undefined ? { dataStates: config.dataStates } : {}),
    ...(config.safelist !== undefined ? { safelist: config.safelist } : {}),
    ...(config.include !== undefined ? { include: config.include } : {}),
  };
}
