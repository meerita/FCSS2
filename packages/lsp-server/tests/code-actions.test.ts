// @file packages/lsp-server/tests/code-actions.test.ts
// @description Tests for code-action and executeCommand handlers: WorkspaceEdit, Command surfacing, executeCommand behavior.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, vi } from 'vitest';
import { CodeActionKind as LspCodeActionKind } from 'vscode-languageserver';
import type { CodeAction } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createManifestIndex } from '@fcss/language-service';
import type { ManifestEntry } from '@fcss/language-service';
import { computeDiagnostics } from '../src/handlers/diagnostics';
import { handleCodeActions } from '../src/handlers/code-actions';
import { handleExecuteCommand } from '../src/handlers/commands';

// Property names match the FCSS convention: className = `{property}--{value}`.
const FIXTURE_ENTRIES: ManifestEntry[] = [
  {
    className: 'bg--red',
    selector: '.bg--red',
    property: 'bg',
    value: 'red',
    category: 'color',
    source: 'fcss',
  },
  {
    className: 'old--cls',
    selector: '.old--cls',
    property: 'clr',
    value: 'gray',
    category: 'color',
    source: 'fcss',
    deprecated: true,
    canonical: 'new--cls',
  },
];

const index = createManifestIndex(FIXTURE_ENTRIES);

function makeDoc(text: string, uri = 'file:///test.tsx'): TextDocument {
  return TextDocument.create(uri, 'typescriptreact', 1, text);
}

function storedFor(text: string, languageId = 'html') {
  return computeDiagnostics(text, languageId, index).stored;
}

function makeCodeActionParams(doc: TextDocument, startOffset: number, endOffset?: number) {
  const start = doc.positionAt(startOffset);
  const end = doc.positionAt(endOffset ?? startOffset);
  return {
    textDocument: { uri: doc.uri },
    range: { start, end },
    context: { diagnostics: [], triggerKind: 1 as const },
  };
}

describe('handleCodeActions', () => {
  describe('null-safety', () => {
    it('returns empty array when index is null', () => {
      const doc = makeDoc('<div class="old--cls">');
      const stored = storedFor('<div class="old--cls">');
      const result = handleCodeActions(makeCodeActionParams(doc, 12, 20), stored, null);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when no stored diagnostics overlap the range', () => {
      const text = '<div class="old--cls">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      // range after the element — no overlap
      const result = handleCodeActions(makeCodeActionParams(doc, 22, 22), stored, index);
      expect(result).toHaveLength(0);
    });
  });

  describe('deprecated-class → WorkspaceEdit', () => {
    it('produces a quickfix CodeAction with a WorkspaceEdit for deprecated-class', () => {
      const text = '<div class="old--cls">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      // cursor inside 'old--cls' at offset 14
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const editAction = (result as CodeAction[]).find(
        (a) => a.kind === LspCodeActionKind.QuickFix,
      );
      expect(editAction).toBeDefined();
      expect(editAction!.edit).toBeDefined();
    });

    it('WorkspaceEdit replaces the deprecated class name with the canonical one', () => {
      const text = '<div class="old--cls">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const editAction = (result as CodeAction[]).find(
        (a) => a.kind === LspCodeActionKind.QuickFix,
      );
      const edits = editAction!.edit!.changes![doc.uri];
      expect(edits).toHaveLength(1);
      expect(edits![0]!.newText).toBe('new--cls');
    });

    it('WorkspaceEdit range covers the occurrence of the deprecated class', () => {
      const text = '<div class="old--cls">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const editAction = (result as CodeAction[]).find(
        (a) => a.kind === LspCodeActionKind.QuickFix,
      );
      const edits = editAction!.edit!.changes![doc.uri];
      // 'old--cls' starts at offset 12, ends at offset 20
      expect(edits![0]!.range.start).toEqual({ line: 0, character: 12 });
      expect(edits![0]!.range.end).toEqual({ line: 0, character: 20 });
    });
  });

  describe('unknown-class → command-based actions', () => {
    it('surfaces fcss.addToSafelist command for unknown property', () => {
      const text = '<div class="xyz--red">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const addAction = (result as CodeAction[]).find(
        (a) => a.command?.command === 'fcss.addToSafelist',
      );
      expect(addAction).toBeDefined();
    });

    it('surfaces fcss.createCRule command for unknown property', () => {
      const text = '<div class="xyz--red">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const createAction = (result as CodeAction[]).find(
        (a) => a.command?.command === 'fcss.createCRule',
      );
      expect(createAction).toBeDefined();
    });
  });

  describe('openDocs command', () => {
    it('surfaces fcss.openDocs for all FCSS diagnostics', () => {
      const text = '<div class="old--cls">';
      const doc = makeDoc(text);
      const stored = storedFor(text);
      const result = handleCodeActions(makeCodeActionParams(doc, 14, 14), stored, index);
      const openDocs = (result as CodeAction[]).find((a) => a.command?.command === 'fcss.openDocs');
      expect(openDocs).toBeDefined();
    });
  });

  describe('dynamic-purge-risk → convertToStaticMap', () => {
    it('surfaces fcss.convertToStaticMap for dynamic-purge-risk', () => {
      const text = 'const cls = `bg--${size}`;';
      const doc = TextDocument.create('file:///test.tsx', 'typescriptreact', 1, text);
      const stored = storedFor(text, 'typescriptreact');
      // range covering the template literal area
      const result = handleCodeActions(makeCodeActionParams(doc, 12, 25), stored, index);
      const convertAction = (result as CodeAction[]).find(
        (a) => a.command?.command === 'fcss.convertToStaticMap',
      );
      expect(convertAction).toBeDefined();
    });
  });
});

describe('handleExecuteCommand', () => {
  function makeConnection() {
    return {
      window: {
        showInformationMessage: vi.fn(),
      },
      sendRequest: vi
        .fn<(method: string, params: unknown) => Promise<{ success: boolean }>>()
        .mockResolvedValue({ success: true }),
    };
  }

  it('fcss.addToSafelist shows an information message', async () => {
    const conn = makeConnection();
    await handleExecuteCommand({ command: 'fcss.addToSafelist', arguments: ['my--cls'] }, conn);
    expect(conn.window.showInformationMessage).toHaveBeenCalledOnce();
    expect(conn.window.showInformationMessage.mock.calls[0]![0]).toContain('my--cls');
  });

  it('fcss.createCRule shows an information message with the skeleton', async () => {
    const conn = makeConnection();
    await handleExecuteCommand(
      { command: 'fcss.createCRule', arguments: ['xyz--red', '.c-custom {}'] },
      conn,
    );
    expect(conn.window.showInformationMessage).toHaveBeenCalledOnce();
    expect(conn.window.showInformationMessage.mock.calls[0]![0]).toContain('.c-custom {}');
  });

  it('fcss.convertToStaticMap shows an information message with the fragment', async () => {
    const conn = makeConnection();
    await handleExecuteCommand(
      { command: 'fcss.convertToStaticMap', arguments: ['`bg--${size}`'] },
      conn,
    );
    expect(conn.window.showInformationMessage).toHaveBeenCalledOnce();
    expect(conn.window.showInformationMessage.mock.calls[0]![0]).toContain('bg--');
  });

  it('fcss.openDocs sends window/showDocument request', async () => {
    const conn = makeConnection();
    await handleExecuteCommand({ command: 'fcss.openDocs', arguments: ['bg--red'] }, conn);
    expect(conn.sendRequest).toHaveBeenCalledOnce();
    const [method, params] = conn.sendRequest.mock.calls[0]!;
    expect(method).toBe('window/showDocument');
    expect((params as { uri: string }).uri).toContain('bg--red');
  });

  it('fcss.openDocs falls back to showMessage when showDocument fails', async () => {
    const conn = makeConnection();
    conn.sendRequest.mockRejectedValue(new Error('not supported'));
    await handleExecuteCommand({ command: 'fcss.openDocs', arguments: ['bg--red'] }, conn);
    expect(conn.window.showInformationMessage).toHaveBeenCalledOnce();
  });

  it('fcss.openDocs falls back to showMessage when success is false', async () => {
    const conn = makeConnection();
    conn.sendRequest.mockResolvedValue({ success: false });
    await handleExecuteCommand({ command: 'fcss.openDocs', arguments: ['bg--red'] }, conn);
    expect(conn.window.showInformationMessage).toHaveBeenCalledOnce();
  });

  it('unknown command is silently ignored', async () => {
    const conn = makeConnection();
    await handleExecuteCommand({ command: 'fcss.nonexistent' }, conn);
    expect(conn.window.showInformationMessage).not.toHaveBeenCalled();
    expect(conn.sendRequest).not.toHaveBeenCalled();
  });
});
