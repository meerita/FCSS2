// @file packages/vscode/src/extension.ts
// @description FCSS IntelliSense VS Code extension — LSP client that spawns @fcss/lsp-server.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ExtensionContext } from 'vscode';
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(context: ExtensionContext): void {
  const serverModule = require.resolve('@fcss/lsp-server/dist/server.js');
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc },
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: 'html' },
      { language: 'javascript' },
      { language: 'javascriptreact' },
      { language: 'typescript' },
      { language: 'typescriptreact' },
    ],
  };

  client = new LanguageClient('fcss', 'FCSS IntelliSense', serverOptions, clientOptions);
  context.subscriptions.push(client);
  client.start();
}

export function deactivate(): Promise<void> | undefined {
  return client?.stop();
}
