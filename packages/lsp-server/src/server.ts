#!/usr/bin/env node
// @file packages/lsp-server/src/server.ts
// @description FCSS language server — stdio LSP transport, document sync, manifest discovery and watch.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { loadManifestFromPath, createManifestIndex, watchManifest } from '@fcss/language-service';
import type { ManifestIndex } from '@fcss/language-service';
import { findManifestPath } from './manifest-locator';
import { handleCompletion } from './handlers/completion';
import { handleHover } from './handlers/hover';
import { computeDiagnostics } from './handlers/diagnostics';
import type { StoredDiagnostic } from './handlers/diagnostics';
import { handleCodeActions } from './handlers/code-actions';
import { handleExecuteCommand, FCSS_COMMAND_IDS } from './handlers/commands';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let manifestIndex: ManifestIndex | null = null;
let stopWatch: (() => void) | null = null;
let resolvedManifestPath: string | undefined;

const diagnosticStore = new Map<string, StoredDiagnostic[]>();
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

const DEBOUNCE_MS = 200;

function publishForDocument(doc: TextDocument): void {
  const { lspDiagnostics, stored } = computeDiagnostics(
    doc.getText(),
    doc.languageId,
    manifestIndex,
  );
  diagnosticStore.set(doc.uri, stored);
  connection.sendDiagnostics({ uri: doc.uri, diagnostics: lspDiagnostics });
}

function debouncedPublish(doc: TextDocument): void {
  const existing = debounceTimers.get(doc.uri);
  if (existing) clearTimeout(existing);
  debounceTimers.set(
    doc.uri,
    setTimeout(() => {
      debounceTimers.delete(doc.uri);
      publishForDocument(doc);
    }, DEBOUNCE_MS),
  );
}

connection.onInitialize((params) => {
  const workspaceFolderUris =
    params.workspaceFolders?.map((f) => f.uri) ?? (params.rootUri != null ? [params.rootUri] : []);

  resolvedManifestPath = findManifestPath(workspaceFolderUris);

  if (resolvedManifestPath) {
    const entries = loadManifestFromPath(resolvedManifestPath);
    manifestIndex = createManifestIndex(entries);
  } else {
    connection.console.warn(
      'FCSS: @fcss/core manifest not found — install @fcss/core to activate IntelliSense.',
    );
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['-', ':', '.', '%'],
        resolveProvider: false,
      },
      hoverProvider: true,
      codeActionProvider: true,
      executeCommandProvider: {
        commands: [...FCSS_COMMAND_IDS],
      },
    },
  };
});

connection.onInitialized(() => {
  if (!resolvedManifestPath) return;
  if (manifestIndex) {
    connection.console.log(`FCSS: loaded ${manifestIndex.entries.length} utilities.`);
  }
  stopWatch = watchManifest(resolvedManifestPath, (newEntries) => {
    manifestIndex = createManifestIndex(newEntries);
    connection.console.log(`FCSS: manifest reloaded — ${manifestIndex.entries.length} utilities.`);
    for (const doc of documents.all()) {
      publishForDocument(doc);
    }
  });
});

documents.onDidOpen((event) => {
  publishForDocument(event.document);
});

documents.onDidChangeContent((event) => {
  debouncedPublish(event.document);
});

documents.onDidClose((event) => {
  const existing = debounceTimers.get(event.document.uri);
  if (existing) clearTimeout(existing);
  debounceTimers.delete(event.document.uri);
  diagnosticStore.delete(event.document.uri);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

connection.onCompletion((params) => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;
  return handleCompletion(params, doc, manifestIndex);
});

connection.onHover((params) => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;
  return handleHover(params, doc, manifestIndex);
});

connection.onCodeAction((params) => {
  const stored = diagnosticStore.get(params.textDocument.uri) ?? [];
  return handleCodeActions(params, stored, manifestIndex);
});

connection.onExecuteCommand(async (params) => {
  await handleExecuteCommand(params, connection);
});

connection.onShutdown(() => {
  stopWatch?.();
  stopWatch = null;
  for (const timer of debounceTimers.values()) clearTimeout(timer);
  debounceTimers.clear();
});

connection.onExit(() => {
  process.exit(0);
});

documents.listen(connection);
connection.listen();
