// @file packages/lsp-server/tests/lsp-mapping.test.ts
// @description Unit tests for FCSS → LSP type mapping functions.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import {
  CompletionItemKind as LspCompletionItemKind,
  DiagnosticSeverity as LspDiagnosticSeverity,
  CodeActionKind as LspCodeActionKind,
} from 'vscode-languageserver';
import { CompletionItemKind as FcssCompletionItemKind } from '@fcss/language-service';
import { mapCompletionKind, mapDiagnosticSeverity, mapCodeActionKind } from '../src/lsp-mapping';

describe('mapCompletionKind', () => {
  it('maps Module (6) to LSP Module (9)', () => {
    expect(mapCompletionKind(FcssCompletionItemKind.Module)).toBe(LspCompletionItemKind.Module);
  });

  it('maps Property (9) to LSP Property (10)', () => {
    expect(mapCompletionKind(FcssCompletionItemKind.Property)).toBe(LspCompletionItemKind.Property);
  });

  it('maps Value (12) to LSP Value (12)', () => {
    expect(mapCompletionKind(FcssCompletionItemKind.Value)).toBe(LspCompletionItemKind.Value);
  });

  it('maps Enum (13) to LSP Enum (13)', () => {
    expect(mapCompletionKind(FcssCompletionItemKind.Enum)).toBe(LspCompletionItemKind.Enum);
  });
});

describe('mapDiagnosticSeverity', () => {
  it('maps error to LSP Error', () => {
    expect(mapDiagnosticSeverity('error')).toBe(LspDiagnosticSeverity.Error);
  });

  it('maps warning to LSP Warning', () => {
    expect(mapDiagnosticSeverity('warning')).toBe(LspDiagnosticSeverity.Warning);
  });

  it('maps info to LSP Information', () => {
    expect(mapDiagnosticSeverity('info')).toBe(LspDiagnosticSeverity.Information);
  });
});

describe('mapCodeActionKind', () => {
  it('maps quickfix', () => {
    expect(mapCodeActionKind('quickfix')).toBe(LspCodeActionKind.QuickFix);
  });

  it('maps refactor', () => {
    expect(mapCodeActionKind('refactor')).toBe(LspCodeActionKind.Refactor);
  });

  it('maps refactor.rewrite', () => {
    expect(mapCodeActionKind('refactor.rewrite')).toBe(LspCodeActionKind.RefactorRewrite);
  });

  it('maps source', () => {
    expect(mapCodeActionKind('source')).toBe(LspCodeActionKind.Source);
  });
});
