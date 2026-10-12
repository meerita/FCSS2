export type PseudoClassCategory = 'interaction' | 'form' | 'structural';
export interface FcssPseudoClassDefinition {
  readonly name: string;
  readonly category: PseudoClassCategory;
}
export declare const FCSS_PSEUDO_CLASSES: readonly FcssPseudoClassDefinition[];
export declare const PC_INTERACTION: string[];
export declare const PC_WITH_LINK: string[];
export declare const PC_FORM: string[];
export declare const PC_ALL: string[];
export declare const PC_NONE: string[];
//# sourceMappingURL=pseudo-classes.d.ts.map
