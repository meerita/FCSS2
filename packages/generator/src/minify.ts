// @file packages/generator/src/minify.ts
// @description CSS minifier — strips comments and collapses whitespace from generated CSS.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // strip block comments
    .replace(/\s*([{}:;,])\s*/g, '$1') // remove spaces around punctuation
    .replace(/\s+/g, ' ') // collapse remaining whitespace
    .trim();
}
