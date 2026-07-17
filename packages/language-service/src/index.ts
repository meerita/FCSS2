// @file packages/language-service/src/index.ts
// @description FCSS language service — full public API.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export type { FcssClassToken, FcssParseError } from './parser';
export { parseClass } from './parser';

export type { ManifestCondition, ManifestEntry, ManifestIndex } from './manifest';
export { createManifestIndex, loadManifestFromPath, watchManifest } from './manifest';

export type { CompletionItem, CompletionItemKindValue } from './completion';
export { CompletionItemKind, getCompletions } from './completion';

export type { HoverResult } from './hover';
export { getHover } from './hover';

export type { DiagnosticCode, DiagnosticSeverity, DiagnosticItem } from './diagnostics';
export { getDiagnostics, getSourceDiagnostics } from './diagnostics';

export type { ConflictResult } from './conflict';
export { detectConflicts } from './conflict';

export type { CodeAction, CodeActionKind, CodeActionEdit, CodeActionCommand } from './code-actions';
export { getCodeActions } from './code-actions';
