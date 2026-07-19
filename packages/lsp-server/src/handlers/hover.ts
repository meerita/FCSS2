// @file packages/lsp-server/src/handlers/hover.ts
// @description LSP textDocument/hover handler — maps getHover output to LSP Hover.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { HoverParams, Hover } from 'vscode-languageserver';
import { MarkupKind } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { getHover } from '@fcss/language-service';
import type { ManifestIndex } from '@fcss/language-service';
import { wordAtCursor } from '../class-extraction';

export function handleHover(
  params: HoverParams,
  document: TextDocument,
  index: ManifestIndex | null,
): Hover | null {
  if (!index) return null;

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  const word = wordAtCursor(text, offset);
  if (!word) return null;

  const result = getHover(word, index);
  if (!result) return null;

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: result.contents,
    },
  };
}
