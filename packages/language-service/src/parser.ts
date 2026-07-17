// @file packages/language-service/src/parser.ts
// @description Parses FCSS class strings into structured tokens.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface FcssParseError {
  code: string;
  message: string;
}

export interface FcssClassToken {
  raw: string;
  breakpoint?: string;
  property: string;
  classValue: string;
  conditionType?: 'pseudo' | 'aria';
  conditionAttr?: string;
  conditionValue?: string;
  isValid: boolean;
  errors: FcssParseError[];
}

const BREAKPOINT_RE = /^(sm|md|lg|xl|xxl)-(.+)$/;
const SEPARATOR = '--';

export function parseClass(raw: string): FcssClassToken {
  const errors: FcssParseError[] = [];
  let rest = raw;
  let breakpoint: string | undefined;

  const bpMatch = BREAKPOINT_RE.exec(rest);
  if (bpMatch) {
    breakpoint = bpMatch[1];
    rest = bpMatch[2]!;
  }

  const sepIdx = rest.indexOf(SEPARATOR);
  if (sepIdx <= 0) {
    errors.push({ code: 'MISSING_SEPARATOR', message: `Missing '--' in "${raw}"` });
    return {
      raw,
      property: rest,
      classValue: '',
      isValid: false,
      errors,
      ...(breakpoint !== undefined ? { breakpoint } : {}),
    };
  }

  const property = rest.slice(0, sepIdx);
  const valueAndCondition = rest.slice(sepIdx + 2);

  if (!valueAndCondition) {
    errors.push({ code: 'MISSING_VALUE', message: `Missing value after '--' in "${raw}"` });
    return {
      raw,
      property,
      classValue: '',
      isValid: false,
      errors,
      ...(breakpoint !== undefined ? { breakpoint } : {}),
    };
  }

  const colonIdx = valueAndCondition.indexOf(':');

  if (colonIdx === -1) {
    return {
      raw,
      property,
      classValue: valueAndCondition,
      isValid: true,
      errors,
      ...(breakpoint !== undefined ? { breakpoint } : {}),
    };
  }

  const classValue = valueAndCondition.slice(0, colonIdx);
  const conditionStr = valueAndCondition.slice(colonIdx + 1);

  let conditionType: 'pseudo' | 'aria' | undefined;
  let conditionAttr: string | undefined;
  let conditionValue: string | undefined;

  if (conditionStr.startsWith('aria-')) {
    const ariaColonIdx = conditionStr.indexOf(':');
    if (ariaColonIdx === -1) {
      errors.push({
        code: 'INVALID_ARIA_CONDITION',
        message: `ARIA condition "${conditionStr}" missing value in "${raw}"`,
      });
    } else {
      conditionType = 'aria';
      conditionAttr = conditionStr.slice(0, ariaColonIdx);
      conditionValue = conditionStr.slice(ariaColonIdx + 1);
      if (conditionValue.includes(':')) {
        errors.push({
          code: 'INVALID_CONDITION_CHAIN',
          message: `Too many conditions in "${raw}"`,
        });
      }
    }
  } else {
    if (conditionStr.includes(':')) {
      errors.push({ code: 'INVALID_CONDITION_CHAIN', message: `Too many conditions in "${raw}"` });
    } else {
      conditionType = 'pseudo';
      conditionValue = conditionStr;
    }
  }

  return {
    raw,
    property,
    classValue,
    isValid: errors.length === 0,
    errors,
    ...(breakpoint !== undefined ? { breakpoint } : {}),
    ...(conditionType !== undefined ? { conditionType } : {}),
    ...(conditionAttr !== undefined ? { conditionAttr } : {}),
    ...(conditionValue !== undefined ? { conditionValue } : {}),
  };
}
