// @file packages/angular/schematics/ng-add/index.ts
// @description FCSS ng-add schematic — installs FCSS into an Angular project.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export interface NgAddSchema {
  project?: string;
  skipInstall?: boolean;
}

interface WorkspaceProject {
  projectType?: string;
  root?: string;
  sourceRoot?: string;
  architect?: Record<
    string,
    {
      builder?: string;
      options?: Record<string, unknown>;
    }
  >;
}

interface AngularWorkspace {
  defaultProject?: string;
  projects: Record<string, WorkspaceProject>;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

const CORE_STYLES_ENTRY = 'node_modules/@fcss/core/dist/full.css';
const CORE_PKG = '@fcss/core';
const POSTCSS_PKG = '@fcss/postcss';
const POSTCSS_PKG_UPSTREAM = 'postcss';
const FCSS_VERSION = '^0.0.0';
const POSTCSS_VERSION = '^8.4.0';

export function resolveProjectName(
  workspace: AngularWorkspace,
  requested: string | undefined,
): string {
  if (requested) {
    if (!workspace.projects[requested]) {
      throw new Error(`Project "${requested}" not found in angular.json.`);
    }
    return requested;
  }

  // Angular 17+ removed defaultProject — find the first application project.
  if (workspace.defaultProject && workspace.projects[workspace.defaultProject]) {
    return workspace.defaultProject;
  }

  const appEntry = Object.entries(workspace.projects).find(
    ([, p]) => p.projectType === 'application',
  );
  if (appEntry) return appEntry[0];

  const first = Object.keys(workspace.projects)[0];
  if (first) return first;

  throw new Error('No projects found in angular.json. Use --project <name> to specify one.');
}

function readJson<T>(tree: Tree, filePath: string): T {
  const buffer = tree.read(filePath);
  if (!buffer) throw new Error(`Cannot read ${filePath}.`);
  return JSON.parse(buffer.toString('utf8')) as T;
}

function addPackageDependencies(schema: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('package.json')) {
      context.logger.warn('[@fcss/angular] package.json not found — skipping dependency update.');
      return;
    }

    const pkg = readJson<PackageJson>(tree, 'package.json');
    const deps: Record<string, string> = (pkg['dependencies'] as Record<string, string>) ?? {};
    const devDeps: Record<string, string> =
      (pkg['devDependencies'] as Record<string, string>) ?? {};

    let modified = false;

    if (!deps[CORE_PKG] && !devDeps[CORE_PKG]) {
      deps[CORE_PKG] = FCSS_VERSION;
      pkg['dependencies'] = deps;
      modified = true;
      context.logger.info(`[@fcss/angular] Added ${CORE_PKG} to dependencies.`);
    } else {
      context.logger.info(`[@fcss/angular] ${CORE_PKG} already present — skipping.`);
    }

    if (!devDeps[POSTCSS_PKG]) {
      devDeps[POSTCSS_PKG] = FCSS_VERSION;
      modified = true;
      context.logger.info(`[@fcss/angular] Added ${POSTCSS_PKG} to devDependencies.`);
    } else {
      context.logger.info(`[@fcss/angular] ${POSTCSS_PKG} already present — skipping.`);
    }

    if (!devDeps[POSTCSS_PKG_UPSTREAM] && !deps[POSTCSS_PKG_UPSTREAM]) {
      devDeps[POSTCSS_PKG_UPSTREAM] = POSTCSS_VERSION;
      modified = true;
      context.logger.info(`[@fcss/angular] Added ${POSTCSS_PKG_UPSTREAM} to devDependencies.`);
    }

    if (modified) {
      pkg['devDependencies'] = devDeps;
      tree.overwrite('package.json', JSON.stringify(pkg, null, 2) + '\n');
    }
    void schema;
  };
}

function addGlobalStyles(schema: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('angular.json')) {
      context.logger.warn('[@fcss/angular] angular.json not found — skipping styles update.');
      return;
    }

    const workspace = readJson<AngularWorkspace>(tree, 'angular.json');
    const projectName = resolveProjectName(workspace, schema.project);
    const project = workspace.projects[projectName];

    if (!project) {
      context.logger.warn(`[@fcss/angular] Project "${projectName}" not found — skipping.`);
      return;
    }

    const buildTarget = project.architect?.['build'];
    if (!buildTarget?.options) {
      context.logger.warn(
        `[@fcss/angular] No build options found for "${projectName}" — skipping styles.`,
      );
      return;
    }

    const rawStyles = buildTarget.options['styles'];
    const styles: string[] = Array.isArray(rawStyles) ? (rawStyles as string[]) : [];

    if (styles.includes(CORE_STYLES_ENTRY)) {
      context.logger.info(
        `[@fcss/angular] @fcss/core already in styles for "${projectName}" — skipping.`,
      );
      return;
    }

    buildTarget.options['styles'] = [CORE_STYLES_ENTRY, ...styles];
    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2) + '\n');
    context.logger.info(`[@fcss/angular] Added ${CORE_STYLES_ENTRY} to "${projectName}" styles.`);
  };
}

function createFcssConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists('fcss.config.ts')) {
      context.logger.info('[@fcss/angular] fcss.config.ts already exists — skipping.');
      return;
    }

    const lines = [
      '// @file fcss.config.ts',
      '// @description FCSS configuration for this Angular project.',
      '// @layer config',
      "import type { FcssAngularConfig } from '@fcss/angular';",
      '',
      'const config: FcssAngularConfig = {',
      "  content: ['src/**/*.{ts,html}'],",
      '};',
      '',
      'export default config;',
      '',
    ];
    tree.create('fcss.config.ts', lines.join('\n'));
    context.logger.info('[@fcss/angular] Created fcss.config.ts.');
  };
}

function createPurgeScript(schema: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists('fcss-purge.mjs')) {
      context.logger.info('[@fcss/angular] fcss-purge.mjs already exists — skipping.');
      return;
    }

    const workspace = tree.exists('angular.json')
      ? readJson<AngularWorkspace>(tree, 'angular.json')
      : null;
    const projectName = workspace
      ? resolveProjectName(workspace, schema.project)
      : (schema.project ?? 'app');
    const project = workspace?.projects[projectName];
    const distDir =
      (project?.architect?.['build']?.options?.['outputPath'] as string | undefined) ?? 'dist/app';
    const sourceRoot = project?.sourceRoot ?? 'src';

    const lines = [
      '// @file fcss-purge.mjs',
      '// @description Post-build FCSS purge — removes unused utility classes from the Angular production CSS bundle.',
      '// @layer config',
      '/* global process, console */',
      "import { createRequire } from 'module';",
      "import { readFileSync, writeFileSync, readdirSync } from 'fs';",
      "import { join } from 'path';",
      '',
      'const require = createRequire(import.meta.url);',
      `const manifestPath = require.resolve('@fcss/core/manifest.json');`,
      '',
      "const { default: postcss } = await import('postcss');",
      "const { default: fcssPostcss } = await import('@fcss/postcss');",
      '',
      `const distDir = process.argv[2] ?? '${distDir}';`,
      `const contentPatterns = ['${sourceRoot}/**/*.{ts,html}'];`,
      '',
      "const cssFiles = readdirSync(distDir).filter((f) => f.endsWith('.css'));",
      '',
      'if (cssFiles.length === 0) {',
      `  console.warn('[@fcss/angular] No CSS files found in "' + distDir + '". Run ng build first.');`,
      '  process.exit(1);',
      '}',
      '',
      'for (const file of cssFiles) {',
      '  const filePath = join(distDir, file);',
      "  const css = readFileSync(filePath, 'utf-8');",
      '',
      '  const result = await postcss([',
      '    fcssPostcss({',
      '      manifest: manifestPath,',
      '      content: contentPatterns,',
      '      report: true,',
      '    }),',
      '  ]).process(css, { from: filePath, to: filePath });',
      '',
      "  writeFileSync(filePath, result.css, 'utf-8');",
      '}',
      '',
    ];
    tree.create('fcss-purge.mjs', lines.join('\n'));
    context.logger.info('[@fcss/angular] Created fcss-purge.mjs post-build purge script.');
  };
}

function scheduleInstall(schema: NgAddSchema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    if (schema.skipInstall) return;
    context.addTask(new NodePackageInstallTask());
    context.logger.info('[@fcss/angular] Scheduled package install.');
  };
}

export function ngAdd(schema: NgAddSchema): Rule {
  return chain([
    addPackageDependencies(schema),
    addGlobalStyles(schema),
    createFcssConfig(),
    createPurgeScript(schema),
    scheduleInstall(schema),
  ]);
}
