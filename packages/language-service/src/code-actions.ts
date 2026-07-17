// @file packages/language-service/src/code-actions.ts
// @description Code actions: replace deprecated, add to safelist, convert dynamic, open docs, create c- rule.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ManifestIndex } from './manifest';
import type { DiagnosticCode, DiagnosticItem } from './diagnostics';

export type CodeActionKind = 'quickfix' | 'refactor' | 'refactor.rewrite' | 'source';

export interface CodeActionEdit {
  className: string;
  replacement: string;
}

export interface CodeActionCommand {
  id: string;
  title: string;
  args?: unknown[];
}

export interface CodeAction {
  title: string;
  kind: CodeActionKind;
  diagnosticCode?: DiagnosticCode;
  edit?: CodeActionEdit;
  command?: CodeActionCommand;
}

function buildCRuleSkeleton(className: string): string {
  return [
    `/* c- rule skeleton for "${className}" */`,
    `.c-custom {`,
    `  /* Add your declarations here */`,
    `}`,
  ].join('\n');
}

export function getCodeActions(diagnostic: DiagnosticItem, index: ManifestIndex): CodeAction[] {
  const actions: CodeAction[] = [];

  switch (diagnostic.code) {
    case 'fcss/deprecated-class': {
      const entry = index.byClassName.get(diagnostic.className);
      if (entry?.canonical) {
        actions.push({
          title: `Replace with "${entry.canonical}"`,
          kind: 'quickfix',
          diagnosticCode: diagnostic.code,
          edit: { className: diagnostic.className, replacement: entry.canonical },
        });
      }
      break;
    }

    case 'fcss/unknown-property':
    case 'fcss/unknown-value': {
      actions.push({
        title: `Add "${diagnostic.className}" to FCSS safelist`,
        kind: 'quickfix',
        diagnosticCode: diagnostic.code,
        command: {
          id: 'fcss.addToSafelist',
          title: 'Add to safelist',
          args: [diagnostic.className],
        },
      });
      actions.push({
        title: 'Create c- rule skeleton',
        kind: 'refactor',
        diagnosticCode: diagnostic.code,
        command: {
          id: 'fcss.createCRule',
          title: 'Create c- rule',
          args: [diagnostic.className, buildCRuleSkeleton(diagnostic.className)],
        },
      });
      break;
    }

    case 'fcss/dynamic-purge-risk': {
      actions.push({
        title: 'Convert dynamic fragment to static class map',
        kind: 'refactor.rewrite',
        diagnosticCode: diagnostic.code,
        command: {
          id: 'fcss.convertToStaticMap',
          title: 'Convert to static map',
          args: [diagnostic.className],
        },
      });
      break;
    }

    default:
      break;
  }

  actions.push({
    title: 'Open FCSS documentation',
    kind: 'source',
    command: {
      id: 'fcss.openDocs',
      title: 'Open documentation',
      args: [diagnostic.className],
    },
  });

  return actions;
}
