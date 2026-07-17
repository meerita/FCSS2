// @file packages/generator/src/escape.ts
// @description Single escape point for CSS selector metacharacters in FCSS class names.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

const META = /[:%.()/[\]{}+~>^$*|=#{@!,]/g;

export function escapeClassName(className: string): string {
  return className.replace(META, '\\$&');
}
