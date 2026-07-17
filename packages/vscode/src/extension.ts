// @file packages/vscode/src/extension.ts
// @description FCSS IntelliSense VS Code extension — activate, providers, manifest watch, status bar.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  loadManifestFromPath,
  createManifestIndex,
  watchManifest,
  getCompletions,
  getHover,
  getDiagnostics,
  getSourceDiagnostics,
  CompletionItemKind,
} from '@fcss/language-service';
import type { ManifestEntry, ManifestIndex, CompletionItem } from '@fcss/language-service';

// Selectors for class-bearing documents
const DOCUMENT_SELECTORS: vscode.DocumentSelector = [
  { language: 'html' },
  { language: 'javascriptreact' },
  { language: 'typescriptreact' },
  { language: 'typescript' },
];

const CLASS_WORD_RE = /[\w.%:-]+/;
const CLASS_ATTR_RE = /class(?:Name)?\s*=\s*["']([^"']*)["']/g;

let statusBarItem: vscode.StatusBarItem | undefined;
let diagnosticCollection: vscode.DiagnosticCollection | undefined;

function findManifestPath(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return undefined;

  for (const folder of folders) {
    const candidate = path.join(
      folder.uri.fsPath,
      'node_modules',
      '@fcss',
      'core',
      'dist',
      'manifest.json',
    );
    if (fs.existsSync(candidate)) return candidate;
  }

  return undefined;
}

function toVscodeCompletionItem(item: CompletionItem): vscode.CompletionItem {
  const kindMap: Record<number, vscode.CompletionItemKind> = {
    [CompletionItemKind.Module]: vscode.CompletionItemKind.Module,
    [CompletionItemKind.Property]: vscode.CompletionItemKind.Property,
    [CompletionItemKind.Value]: vscode.CompletionItemKind.Value,
    [CompletionItemKind.Enum]: vscode.CompletionItemKind.EnumMember,
  };

  const vsItem = new vscode.CompletionItem(
    item.label,
    kindMap[item.kind] ?? vscode.CompletionItemKind.Text,
  );
  vsItem.insertText = item.insertText;
  vsItem.documentation = new vscode.MarkdownString(item.documentation);
  vsItem.detail = item.detail;
  if (item.sortText) vsItem.sortText = item.sortText;
  return vsItem;
}

function classNamesFromDocument(document: vscode.TextDocument): string[] {
  const text = document.getText();
  const classes: string[] = [];
  CLASS_ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CLASS_ATTR_RE.exec(text)) !== null) {
    const value = m[1] ?? '';
    for (const cls of value.split(/\s+/).filter(Boolean)) {
      classes.push(cls);
    }
  }
  return classes;
}

function refreshDiagnostics(document: vscode.TextDocument, index: ManifestIndex): void {
  if (!diagnosticCollection) return;

  const classNames = classNamesFromDocument(document);
  const items = getDiagnostics(classNames, index);
  const sourceLanguages = new Set([
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
  ]);
  const sourceDiags = sourceLanguages.has(document.languageId)
    ? getSourceDiagnostics(document.getText())
    : [];

  const vsDiags: vscode.Diagnostic[] = [...items, ...sourceDiags].map((diag) => {
    const range = new vscode.Range(0, 0, document.lineCount - 1, 0);
    const severity =
      diag.severity === 'error'
        ? vscode.DiagnosticSeverity.Error
        : diag.severity === 'warning'
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;
    const vsDiag = new vscode.Diagnostic(range, diag.message, severity);
    vsDiag.code = diag.code;
    vsDiag.source = 'FCSS';
    return vsDiag;
  });

  diagnosticCollection.set(document.uri, vsDiags);
}

export function activate(context: vscode.ExtensionContext): void {
  const manifestPath = findManifestPath();

  if (!manifestPath) {
    vscode.window.showWarningMessage(
      'FCSS IntelliSense: @fcss/core not found in workspace node_modules. Install @fcss/core to enable IntelliSense.',
    );
    return;
  }

  let entries: ManifestEntry[] = loadManifestFromPath(manifestPath);
  let index: ManifestIndex = createManifestIndex(entries);

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = `$(symbol-class) FCSS (${entries.length} utilities)`;
  statusBarItem.tooltip = 'FCSS IntelliSense is active';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  diagnosticCollection = vscode.languages.createDiagnosticCollection('fcss');
  context.subscriptions.push(diagnosticCollection);

  // Completion provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      DOCUMENT_SELECTORS,
      {
        provideCompletionItems(document, position) {
          const range = document.getWordRangeAtPosition(position, CLASS_WORD_RE);
          const word = range ? document.getText(range) : '';
          const items = getCompletions(word, index);
          return items.map(toVscodeCompletionItem);
        },
      },
      '-',
      ':',
      '.',
      '%',
    ),
  );

  // Hover provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(DOCUMENT_SELECTORS, {
      provideHover(document, position) {
        const range = document.getWordRangeAtPosition(position, CLASS_WORD_RE);
        if (!range) return null;
        const word = document.getText(range);
        const result = getHover(word, index);
        if (!result) return null;
        return new vscode.Hover(new vscode.MarkdownString(result.contents));
      },
    }),
  );

  // Diagnostics on open and change
  const refreshActive = (): void => {
    const editor = vscode.window.activeTextEditor;
    if (editor) refreshDiagnostics(editor.document, index);
  };

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => refreshDiagnostics(doc, index)),
    vscode.workspace.onDidChangeTextDocument((e) => refreshDiagnostics(e.document, index)),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnosticCollection?.delete(doc.uri)),
    vscode.window.onDidChangeActiveTextEditor(() => refreshActive()),
  );

  refreshActive();

  // Manifest watch and reload
  const stopWatch = watchManifest(manifestPath, (newEntries: ManifestEntry[]) => {
    entries = newEntries;
    index = createManifestIndex(newEntries);
    if (statusBarItem) {
      statusBarItem.text = `$(symbol-class) FCSS (${newEntries.length} utilities)`;
    }
    refreshActive();
  });
  context.subscriptions.push({ dispose: stopWatch });
}

export function deactivate(): void {
  // Disposed via context.subscriptions
}
