// @file packages/cli/src/config/validate.ts
// @description FcssConfig validator — precise, actionable error messages for every field.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface ValidationError {
  field: string;
  message: string;
}

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const CSS_VALUE_RE = /^\S+$/;
const BREAKPOINT_NAME_RE = /^[a-z][a-z0-9-]*$/;
const CSS_PROPERTY_RE = /^[a-z][a-z0-9-]*$/;
const DATA_ATTR_RE = /^data-[a-z][a-z0-9-]*$/;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateColors(colors: unknown, errors: ValidationError[]): void {
  if (colors === undefined) return;
  if (typeof colors !== 'object' || colors === null || Array.isArray(colors)) {
    errors.push({
      field: 'colors',
      message: 'colors must be an object mapping names to hex color strings',
    });
    return;
  }
  for (const [name, value] of Object.entries(colors)) {
    if (!isNonEmptyString(value) || !HEX_COLOR_RE.test(value)) {
      errors.push({
        field: `colors.${name}`,
        message: `colors.${name} must be a hex color string like #7557ff or #rgb (got ${JSON.stringify(value)})`,
      });
    }
  }
}

function validateSpacing(spacing: unknown, errors: ValidationError[]): void {
  if (spacing === undefined) return;
  if (typeof spacing !== 'object' || spacing === null || Array.isArray(spacing)) {
    errors.push({
      field: 'spacing',
      message: 'spacing must be an object mapping names to CSS value strings',
    });
    return;
  }
  for (const [name, value] of Object.entries(spacing)) {
    if (!isNonEmptyString(value) || !CSS_VALUE_RE.test(value as string)) {
      errors.push({
        field: `spacing.${name}`,
        message: `spacing.${name} must be a non-empty CSS value string like "8px" or "0.5rem" (got ${JSON.stringify(value)})`,
      });
    }
  }
}

function validateBreakpoints(breakpoints: unknown, errors: ValidationError[]): void {
  if (breakpoints === undefined) return;
  if (typeof breakpoints !== 'object' || breakpoints === null || Array.isArray(breakpoints)) {
    errors.push({
      field: 'breakpoints',
      message: 'breakpoints must be an object mapping names to breakpoint definitions',
    });
    return;
  }
  for (const [name, bp] of Object.entries(breakpoints)) {
    if (!BREAKPOINT_NAME_RE.test(name)) {
      errors.push({
        field: `breakpoints.${name}`,
        message: `breakpoints key "${name}" must start with a lowercase letter and contain only lowercase letters, digits, and hyphens`,
      });
    }
    if (typeof bp !== 'object' || bp === null || Array.isArray(bp)) {
      errors.push({
        field: `breakpoints.${name}`,
        message: `breakpoints.${name} must be an object with a minWidth field`,
      });
      continue;
    }
    const { minWidth } = bp as Record<string, unknown>;
    if (typeof minWidth !== 'number' || !Number.isInteger(minWidth) || minWidth <= 0) {
      errors.push({
        field: `breakpoints.${name}.minWidth`,
        message: `breakpoints.${name}.minWidth must be a positive integer in pixels (got ${JSON.stringify(minWidth)})`,
      });
    }
  }
}

function validateDataState(state: unknown, index: number, errors: ValidationError[]): void {
  if (typeof state !== 'object' || state === null || Array.isArray(state)) {
    errors.push({
      field: `dataStates[${index}]`,
      message: `dataStates[${index}] must be an object with attribute, value, and properties fields`,
    });
    return;
  }
  const { attribute, value, properties } = state as Record<string, unknown>;
  if (!isNonEmptyString(attribute) || !DATA_ATTR_RE.test(attribute)) {
    errors.push({
      field: `dataStates[${index}].attribute`,
      message: `dataStates[${index}].attribute must be a data-* attribute name like "data-state" (got ${JSON.stringify(attribute)})`,
    });
  }
  if (!isNonEmptyString(value)) {
    errors.push({
      field: `dataStates[${index}].value`,
      message: `dataStates[${index}].value must be a non-empty string (got ${JSON.stringify(value)})`,
    });
  }
  if (!Array.isArray(properties) || properties.length === 0) {
    errors.push({
      field: `dataStates[${index}].properties`,
      message: `dataStates[${index}].properties must be a non-empty array of CSS property names`,
    });
    return;
  }
  for (const [i, prop] of properties.entries()) {
    if (!isNonEmptyString(prop) || !CSS_PROPERTY_RE.test(prop)) {
      errors.push({
        field: `dataStates[${index}].properties[${i}]`,
        message: `dataStates[${index}].properties[${i}] must be a valid CSS property name like "display" or "background-color" (got ${JSON.stringify(prop)})`,
      });
    }
  }
}

function validateDataStates(dataStates: unknown, errors: ValidationError[]): void {
  if (dataStates === undefined) return;
  if (!Array.isArray(dataStates)) {
    errors.push({
      field: 'dataStates',
      message: 'dataStates must be an array of data-state definitions',
    });
    return;
  }
  dataStates.forEach((state, i) => validateDataState(state, i, errors));
}

function validateSafelist(safelist: unknown, errors: ValidationError[]): void {
  if (safelist === undefined) return;
  if (!Array.isArray(safelist)) {
    errors.push({
      field: 'safelist',
      message: 'safelist must be an array of class name strings or { pattern: RegExp } objects',
    });
    return;
  }
  for (const [i, item] of safelist.entries()) {
    const isString = typeof item === 'string' && item.trim().length > 0;
    const isPattern =
      typeof item === 'object' &&
      item !== null &&
      'pattern' in item &&
      (item as Record<string, unknown>)['pattern'] instanceof RegExp;
    if (!isString && !isPattern) {
      errors.push({
        field: `safelist[${i}]`,
        message: `safelist[${i}] must be a non-empty class name string or an object with a pattern RegExp field (got ${JSON.stringify(item)})`,
      });
    }
  }
}

function validateContent(content: unknown, errors: ValidationError[]): void {
  if (content === undefined) return;
  if (!Array.isArray(content) || content.length === 0) {
    errors.push({
      field: 'content',
      message: 'content must be a non-empty array of glob pattern strings',
    });
    return;
  }
  for (const [i, pattern] of content.entries()) {
    if (!isNonEmptyString(pattern)) {
      errors.push({
        field: `content[${i}]`,
        message: `content[${i}] must be a non-empty glob pattern string (got ${JSON.stringify(pattern)})`,
      });
    }
  }
}

function validateInclude(include: unknown, errors: ValidationError[]): void {
  if (include === undefined) return;
  if (!Array.isArray(include)) {
    errors.push({
      field: 'include',
      message: 'include must be an array of file path strings pointing to CSS files to include',
    });
    return;
  }
  for (const [i, p] of include.entries()) {
    if (!isNonEmptyString(p)) {
      errors.push({
        field: `include[${i}]`,
        message: `include[${i}] must be a non-empty file path string (got ${JSON.stringify(p)})`,
      });
    }
  }
}

export function validateConfig(config: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    return [
      {
        field: 'config',
        message: 'config must be an object exported from fcss.config.ts (or .js/.mjs)',
      },
    ];
  }
  const c = config as Record<string, unknown>;
  validateContent(c['content'], errors);
  validateColors(c['colors'], errors);
  validateSpacing(c['spacing'], errors);
  validateBreakpoints(c['breakpoints'], errors);
  validateDataStates(c['dataStates'], errors);
  validateSafelist(c['safelist'], errors);
  validateInclude(c['include'], errors);
  return errors;
}

export class ConfigValidationError extends Error {
  constructor(public readonly errors: ValidationError[]) {
    const lines = errors.map((e) => `  • ${e.field}: ${e.message}`).join('\n');
    super(`fcss config validation failed:\n${lines}`);
    this.name = 'ConfigValidationError';
  }
}
