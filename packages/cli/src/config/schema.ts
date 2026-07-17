// @file packages/cli/src/config/schema.ts
// @description FcssConfig TypeScript interface — the shape of fcss.config.ts.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface FcssColorTokens {
  [name: string]: string;
}

export interface FcssSpacingToken {
  value: string;
  unit?: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'none';
}

export interface FcssCustomBreakpoint {
  minWidth: number;
}

export interface FcssDataState {
  attribute: string;
  value: string;
  properties: string[];
}

export interface FcssSafelistPattern {
  pattern: RegExp;
}

export interface FcssConfig {
  content?: string[];
  colors?: FcssColorTokens;
  spacing?: Record<string, string>;
  breakpoints?: Record<string, FcssCustomBreakpoint>;
  dataStates?: FcssDataState[];
  safelist?: Array<string | FcssSafelistPattern>;
  include?: string[];
}

export const FCSS_CONFIG_DEFAULTS: Required<Pick<FcssConfig, 'content'>> = {
  content: ['**/*.{html,js,jsx,ts,tsx}', '!node_modules/**', '!dist/**'],
};
