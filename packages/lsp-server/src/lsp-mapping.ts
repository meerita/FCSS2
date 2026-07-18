// @file packages/lsp-server/src/lsp-mapping.ts
// @description Maps @fcss/language-service types to vscode-languageserver LSP types.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import {
  CompletionItemKind as LspCompletionItemKind,
  DiagnosticSeverity as LspDiagnosticSeverity,
  CodeActionKind as LspCodeActionKind,
} from 'vscode-languageserver';
import type {
  CompletionItemKind,
  DiagnosticSeverity as LspDiagSeverityType,
} from 'vscode-languageserver';
import { CompletionItemKind as FcssCompletionItemKind } from '@fcss/language-service';
import type {
  CompletionItemKindValue,
  DiagnosticSeverity,
  CodeActionKind,
} from '@fcss/language-service';

export function mapCompletionKind(kind: CompletionItemKindValue): CompletionItemKind {
  switch (kind) {
    case FcssCompletionItemKind.Module:
      return LspCompletionItemKind.Module;
    case FcssCompletionItemKind.Property:
      return LspCompletionItemKind.Property;
    case FcssCompletionItemKind.Value:
      return LspCompletionItemKind.Value;
    case FcssCompletionItemKind.Enum:
      return LspCompletionItemKind.Enum;
    default:
      return LspCompletionItemKind.Text;
  }
}

export function mapDiagnosticSeverity(severity: DiagnosticSeverity): LspDiagSeverityType {
  switch (severity) {
    case 'error':
      return LspDiagnosticSeverity.Error;
    case 'warning':
      return LspDiagnosticSeverity.Warning;
    case 'info':
      return LspDiagnosticSeverity.Information;
    default:
      return LspDiagnosticSeverity.Information;
  }
}

export function mapCodeActionKind(kind: CodeActionKind): string {
  switch (kind) {
    case 'quickfix':
      return LspCodeActionKind.QuickFix;
    case 'refactor':
      return LspCodeActionKind.Refactor;
    case 'refactor.rewrite':
      return LspCodeActionKind.RefactorRewrite;
    case 'source':
      return LspCodeActionKind.Source;
    default:
      return LspCodeActionKind.QuickFix;
  }
}
