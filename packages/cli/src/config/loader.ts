// @file packages/cli/src/config/loader.ts
// @description FCSS config file loader — dynamically imports fcss.config.{ts,js,mjs}.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

// SECURITY: Loading a config file executes arbitrary JavaScript from the user's project.
// This is intentional — fcss.config.ts/js/mjs is a trusted developer-authored file,
// analogous to vite.config.ts or postcss.config.js. Never load config from untrusted
// sources or from paths provided by end-users at runtime. The config path is always
// resolved from the project root (process.cwd()), not from user input.

import * as path from 'node:path';
import * as fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import type { FcssConfig } from './schema.js';
import { validateConfig, ConfigValidationError } from './validate.js';
import { FCSS_CONFIG_DEFAULTS } from './schema.js';

const CONFIG_FILENAMES = ['fcss.config.ts', 'fcss.config.js', 'fcss.config.mjs', 'fcss.config.cjs'];

export interface LoadedConfig {
  config: FcssConfig;
  configPath: string;
}

async function importConfigFile(filePath: string): Promise<unknown> {
  const ext = path.extname(filePath);
  if (ext === '.ts') {
    // TypeScript config files require a runtime transform. We use jiti which handles
    // this without eval — it transforms source via esbuild then imports the result.
    const { createJiti } = await import('jiti');
    const jiti = createJiti(filePath, { moduleCache: false });
    return jiti.import(filePath, { default: true });
  }
  // Native dynamic import for .js, .mjs, .cjs
  const mod = (await import(pathToFileURL(filePath).href)) as Record<string, unknown>;
  return mod['default'] ?? mod;
}

export async function loadConfig(cwd = process.cwd()): Promise<LoadedConfig> {
  for (const filename of CONFIG_FILENAMES) {
    const configPath = path.resolve(cwd, filename);
    if (!fs.existsSync(configPath)) continue;

    let raw: unknown;
    try {
      raw = await importConfigFile(configPath);
    } catch (err) {
      throw new Error(`[fcss] Failed to load config from "${configPath}": ${String(err)}`);
    }

    const errors = validateConfig(raw);
    if (errors.length > 0) {
      throw new ConfigValidationError(errors);
    }

    const config = raw as FcssConfig;
    return {
      config: {
        content: config.content ?? FCSS_CONFIG_DEFAULTS.content,
        ...config,
      },
      configPath,
    };
  }

  return {
    config: { content: FCSS_CONFIG_DEFAULTS.content },
    configPath: '',
  };
}
