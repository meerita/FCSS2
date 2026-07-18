// @file packages/lsp-server/src/handlers/completion.ts
// @description LSP textDocument/completion handler — maps getCompletions output to LSP CompletionList.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { CompletionParams, CompletionList, CompletionItem } from 'vscode-languageserver';
import { MarkupKind } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { getCompletions } from '@fcss/language-service';
import type { ManifestIndex } from '@fcss/language-service';
import { mapCompletionKind } from '../lsp-mapping';
import { isInsideClassAttribute, wordBeforeCursor } from '../class-extraction';

export function handleCompletion(
  params: CompletionParams,
  document: TextDocument,
  index: ManifestIndex | null,
): CompletionList | null {
  if (!index) return null;

  const text = document.getText();
  const offset = document.offsetAt(params.position);

  if (!isInsideClassAttribute(text, offset)) return null;

  const partial = wordBeforeCursor(text, offset);
  const items = getCompletions(partial, index);

  const lspItems: CompletionItem[] = items.map((item) => ({
    label: item.label,
    kind: mapCompletionKind(item.kind),
    detail: item.detail,
    documentation: {
      kind: MarkupKind.Markdown,
      value: item.documentation,
    },
    insertText: item.insertText,
    ...(item.sortText !== undefined ? { sortText: item.sortText } : {}),
  }));

  return { isIncomplete: false, items: lspItems };
}
