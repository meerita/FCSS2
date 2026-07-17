// @file examples/angular/workspace/fcss.config.ts
// @description FCSS configuration for the Angular workspace example fixture (app1 only).
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssAngularConfig } from '@fcss/angular';

const config: FcssAngularConfig = {
  content: ['projects/app1/src/**/*.{ts,html}'],
};

export default config;
