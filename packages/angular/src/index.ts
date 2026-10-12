// @file packages/angular/src/index.ts
// @description FCSS Angular integration — exports FcssAngularConfig for fcss.config.ts authoring.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface FcssAngularConfig {
  content?: string[];
  safelist?: Array<string | { pattern: RegExp }>;
}

export function defineConfig(config: FcssAngularConfig): FcssAngularConfig {
  return config;
}
