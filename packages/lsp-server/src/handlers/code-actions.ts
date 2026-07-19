// @file packages/lsp-server/src/handlers/code-actions.ts
// @description LSP textDocument/codeAction handler — maps getCodeActions to WorkspaceEdit or LSP Command.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { CodeActionParams, CodeAction, Command, Position, Range } from 'vscode-languageserver';
import { getCodeActions } from '@fcss/language-service';
import type { ManifestIndex } from '@fcss/language-service';
import { mapCodeActionKind } from '../lsp-mapping';
import type { StoredDiagnostic } from './diagnostics';

function posLessThan(p: Position, q: Position): boolean {
  return p.line < q.line || (p.line === q.line && p.character < q.character);
}

function rangesOverlap(a: Range, b: Range): boolean {
  return !posLessThan(b.end, a.start) && !posLessThan(a.end, b.start);
}

export function handleCodeActions(
  params: CodeActionParams,
  stored: StoredDiagnostic[],
  index: ManifestIndex | null,
): (CodeAction | Command)[] {
  if (!index) return [];

  const results: (CodeAction | Command)[] = [];
  const uri = params.textDocument.uri;

  for (const storedDiag of stored) {
    if (!rangesOverlap(storedDiag.range, params.range)) continue;

    const actions = getCodeActions(storedDiag.item, index);
    for (const action of actions) {
      if (action.edit) {
        const codeAction: CodeAction = {
          title: action.title,
          kind: mapCodeActionKind(action.kind),
          edit: {
            changes: {
              [uri]: [{ range: storedDiag.range, newText: action.edit.replacement }],
            },
          },
        };
        results.push(codeAction);
      } else if (action.command) {
        const codeAction: CodeAction = {
          title: action.title,
          kind: mapCodeActionKind(action.kind),
          command: {
            title: action.command.title,
            command: action.command.id,
            // args is unknown[] | undefined; LSP Command.arguments is any[], default to []
            arguments: (action.command.args ?? []) as unknown[],
          },
        };
        results.push(codeAction);
      }
    }
  }

  return results;
}
