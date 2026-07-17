// @file examples/angular/standalone/fcss.config.ts
// @description FCSS configuration for the Angular standalone example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssAngularConfig } from '@fcss/angular';

const config: FcssAngularConfig = {
  content: ['src/**/*.{ts,html}'],
};

export default config;
