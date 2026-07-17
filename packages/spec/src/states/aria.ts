// @file packages/spec/src/states/aria.ts
// @description ARIA state catalog for FCSS conditional class support (WAI-ARIA 1.1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export type AriaStateType = 'boolean' | 'tristate' | 'token';

export interface FcssAriaStateDefinition {
  readonly attribute: string;
  readonly type: AriaStateType;
  readonly values: readonly string[];
  readonly notes?: string;
}

export const FCSS_ARIA_STATES: readonly FcssAriaStateDefinition[] = [
  // Boolean states (true | false)
  { attribute: 'aria-atomic', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-busy', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-disabled', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-expanded', type: 'boolean', values: ['true', 'false'] },
  {
    attribute: 'aria-grabbed',
    type: 'boolean',
    values: ['true', 'false'],
    notes: 'Deprecated in WAI-ARIA 1.1; prefer drag-and-drop events',
  },
  { attribute: 'aria-hidden', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-modal', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-multiline', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-multiselectable', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-readonly', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-required', type: 'boolean', values: ['true', 'false'] },
  { attribute: 'aria-selected', type: 'boolean', values: ['true', 'false'] },
  // Tristate states (true | false | mixed)
  { attribute: 'aria-checked', type: 'tristate', values: ['true', 'false', 'mixed'] },
  { attribute: 'aria-pressed', type: 'tristate', values: ['true', 'false', 'mixed'] },
  // Token states
  { attribute: 'aria-autocomplete', type: 'token', values: ['none', 'inline', 'list', 'both'] },
  {
    attribute: 'aria-current',
    type: 'token',
    values: ['false', 'true', 'page', 'step', 'location', 'date', 'time'],
  },
  {
    attribute: 'aria-dropeffect',
    type: 'token',
    values: ['none', 'copy', 'execute', 'link', 'move', 'popup'],
    notes: 'Deprecated in WAI-ARIA 1.1',
  },
  {
    attribute: 'aria-haspopup',
    type: 'token',
    values: ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
  },
  { attribute: 'aria-invalid', type: 'token', values: ['false', 'true', 'grammar', 'spelling'] },
  { attribute: 'aria-live', type: 'token', values: ['off', 'polite', 'assertive'] },
  { attribute: 'aria-orientation', type: 'token', values: ['horizontal', 'vertical'] },
  { attribute: 'aria-relevant', type: 'token', values: ['additions', 'all', 'removals', 'text'] },
  { attribute: 'aria-sort', type: 'token', values: ['none', 'ascending', 'descending', 'other'] },
];

// Attributes approved for FCSS class-name conditions (ADR-006).
export const SUPPORTED_ARIA_STATES: string[] = [
  'aria-expanded',
  'aria-selected',
  'aria-checked',
  'aria-disabled',
  'aria-pressed',
  'aria-hidden',
  'aria-current',
  'aria-invalid',
];
