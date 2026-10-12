export type AriaStateType = 'boolean' | 'tristate' | 'token';
export interface FcssAriaStateDefinition {
  readonly attribute: string;
  readonly type: AriaStateType;
  readonly values: readonly string[];
  readonly notes?: string;
}
export declare const FCSS_ARIA_STATES: readonly FcssAriaStateDefinition[];
export declare const SUPPORTED_ARIA_STATES: string[];
//# sourceMappingURL=aria.d.ts.map
