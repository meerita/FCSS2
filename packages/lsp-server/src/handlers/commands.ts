// @file packages/lsp-server/src/handlers/commands.ts
// @description workspace/executeCommand handler for the four FCSS command ids.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ExecuteCommandParams } from 'vscode-languageserver';

export const FCSS_COMMAND_IDS = [
  'fcss.addToSafelist',
  'fcss.createCRule',
  'fcss.convertToStaticMap',
  'fcss.openDocs',
] as const;

export type FcssCommandId = (typeof FCSS_COMMAND_IDS)[number];

interface CommandConnection {
  window: {
    showInformationMessage(message: string): void;
  };
  sendRequest<R>(method: string, params: unknown): Promise<R>;
}

export async function handleExecuteCommand(
  params: ExecuteCommandParams,
  connection: CommandConnection,
): Promise<void> {
  const args = params.arguments ?? [];

  switch (params.command) {
    case 'fcss.addToSafelist': {
      const className = String(args[0] ?? '');
      connection.window.showInformationMessage(
        `FCSS: add "${className}" to your safelist in fcss.config.js or fcss.config.ts.`,
      );
      break;
    }

    case 'fcss.createCRule': {
      const className = String(args[0] ?? '');
      const skeleton = String(args[1] ?? '');
      connection.window.showInformationMessage(
        `FCSS: c- rule skeleton for "${className}":\n\n${skeleton}`,
      );
      break;
    }

    case 'fcss.convertToStaticMap': {
      const fragment = String(args[0] ?? '');
      connection.window.showInformationMessage(
        `FCSS: replace the dynamic fragment with a static class map.\n\nFragment: ${fragment}`,
      );
      break;
    }

    case 'fcss.openDocs': {
      const className = String(args[0] ?? '');
      // Attempt window/showDocument so the client can open an external URI.
      // Zed limitation: window/showDocument support depends on the Zed version; validated in Phase 4.
      try {
        const result = await connection.sendRequest<{ success: boolean }>('window/showDocument', {
          uri: `https://fcss.dev/docs/${encodeURIComponent(className)}`,
          external: true,
        });
        if (!result.success) {
          connection.window.showInformationMessage(
            `FCSS docs: https://fcss.dev/docs/${encodeURIComponent(className)}`,
          );
        }
      } catch {
        connection.window.showInformationMessage(
          `FCSS docs: https://fcss.dev/docs/${encodeURIComponent(className)}`,
        );
      }
      break;
    }

    default:
      break;
  }
}
