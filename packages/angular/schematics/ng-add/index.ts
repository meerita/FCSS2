// @file packages/angular/schematics/ng-add/index.ts
// @description FCSS ng-add schematic — installs FCSS into an Angular project.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain } from '@angular-devkit/schematics';
import { readFileSync } from 'fs';
import { join } from 'path';
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
      configurations?: Record<string, Record<string, unknown>>;
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
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

const CORE_STYLES_ENTRY = 'node_modules/@functionalcss/core/dist/full.css';
// Production builds use a stylesheet purged *before* `ng build`, so the full ~20 MB utility set
// never reaches Angular's bundle budgets. Development keeps the full set for instant feedback.
const PURGED_STYLES_FILE = 'fcss.purged.css';
const PURGE_COMMAND = 'node fcss-purge.mjs';
const CORE_PKG = '@functionalcss/core';
const POSTCSS_PKG = '@functionalcss/postcss';
const POSTCSS_PKG_UPSTREAM = 'postcss';
// Both schematics/ng-add/ (source) and dist-schematics/ng-add/ (published) sit two levels below
// the package root. All public @functionalcss packages share one version (changesets "fixed").
const FCSS_VERSION = `^${
  (
    JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')) as {
      version: string;
    }
  ).version
}`;
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
      context.logger.warn(
        '[@functionalcss/angular] package.json not found — skipping dependency update.',
      );
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
      context.logger.info(`[@functionalcss/angular] Added ${CORE_PKG} to dependencies.`);
    } else {
      context.logger.info(`[@functionalcss/angular] ${CORE_PKG} already present — skipping.`);
    }

    if (!devDeps[POSTCSS_PKG]) {
      devDeps[POSTCSS_PKG] = FCSS_VERSION;
      modified = true;
      context.logger.info(`[@functionalcss/angular] Added ${POSTCSS_PKG} to devDependencies.`);
    } else {
      context.logger.info(`[@functionalcss/angular] ${POSTCSS_PKG} already present — skipping.`);
    }

    if (!devDeps[POSTCSS_PKG_UPSTREAM] && !deps[POSTCSS_PKG_UPSTREAM]) {
      devDeps[POSTCSS_PKG_UPSTREAM] = POSTCSS_VERSION;
      modified = true;
      context.logger.info(
        `[@functionalcss/angular] Added ${POSTCSS_PKG_UPSTREAM} to devDependencies.`,
      );
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
      context.logger.warn(
        '[@functionalcss/angular] angular.json not found — skipping styles update.',
      );
      return;
    }

    const workspace = readJson<AngularWorkspace>(tree, 'angular.json');
    const projectName = resolveProjectName(workspace, schema.project);
    const project = workspace.projects[projectName];

    if (!project) {
      context.logger.warn(
        `[@functionalcss/angular] Project "${projectName}" not found — skipping.`,
      );
      return;
    }

    const buildTarget = project.architect?.['build'];
    if (!buildTarget?.options) {
      context.logger.warn(
        `[@functionalcss/angular] No build options found for "${projectName}" — skipping styles.`,
      );
      return;
    }

    const rawStyles = buildTarget.options['styles'];
    const styles: string[] = Array.isArray(rawStyles) ? (rawStyles as string[]) : [];

    if (styles.includes(CORE_STYLES_ENTRY)) {
      context.logger.info(
        `[@functionalcss/angular] @functionalcss/core already in styles for "${projectName}" — skipping.`,
      );
      return;
    }

    buildTarget.options['styles'] = [CORE_STYLES_ENTRY, ...styles];

    const production = buildTarget.configurations?.['production'];
    if (production) {
      const purgedEntry = `${project.sourceRoot ?? 'src'}/${PURGED_STYLES_FILE}`;
      production['styles'] = [purgedEntry, ...styles];
      context.logger.info(
        `[@functionalcss/angular] Production builds of "${projectName}" use ${purgedEntry}.`,
      );
    }

    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2) + '\n');
    context.logger.info(
      `[@functionalcss/angular] Added ${CORE_STYLES_ENTRY} to "${projectName}" styles.`,
    );
  };
}

function addBuildScript(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('package.json')) return;

    const pkg = readJson<PackageJson>(tree, 'package.json');
    const scripts = pkg.scripts ?? {};
    const build = scripts['build'] ?? 'ng build';
    if (build.includes(PURGE_COMMAND)) return;

    scripts['build'] = `${PURGE_COMMAND} && ${build}`;
    pkg.scripts = scripts;
    tree.overwrite('package.json', JSON.stringify(pkg, null, 2) + '\n');
    context.logger.info(`[@functionalcss/angular] "build" script now runs ${PURGE_COMMAND} first.`);
  };
}

function ignorePurgedStyles(schema: NgAddSchema): Rule {
  return (tree: Tree) => {
    if (!tree.exists('.gitignore')) return;

    const workspace = tree.exists('angular.json')
      ? readJson<AngularWorkspace>(tree, 'angular.json')
      : null;
    const project = workspace?.projects[resolveProjectName(workspace, schema.project)];
    const entry = `/${project?.sourceRoot ?? 'src'}/${PURGED_STYLES_FILE}`;

    const current = tree.read('.gitignore')?.toString('utf8') ?? '';
    if (current.split('\n').includes(entry)) return;
    const separator = current === '' || current.endsWith('\n') ? '' : '\n';
    tree.overwrite(
      '.gitignore',
      `${current}${separator}\n# FCSS purged stylesheet (generated)\n${entry}\n`,
    );
  };
}

function createFcssConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists('fcss.config.ts')) {
      context.logger.info('[@functionalcss/angular] fcss.config.ts already exists — skipping.');
      return;
    }

    const lines = [
      '// @file fcss.config.ts',
      '// @description FCSS configuration for this Angular project.',
      '// @layer config',
      "import type { FcssAngularConfig } from '@functionalcss/angular';",
      '',
      'const config: FcssAngularConfig = {',
      "  content: ['src/**/*.{ts,html}'],",
      '};',
      '',
      'export default config;',
      '',
    ];
    tree.create('fcss.config.ts', lines.join('\n'));
    context.logger.info('[@functionalcss/angular] Created fcss.config.ts.');
  };
}

function createPurgeScript(schema: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists('fcss-purge.mjs')) {
      context.logger.info('[@functionalcss/angular] fcss-purge.mjs already exists — skipping.');
      return;
    }

    const workspace = tree.exists('angular.json')
      ? readJson<AngularWorkspace>(tree, 'angular.json')
      : null;
    const projectName = workspace
      ? resolveProjectName(workspace, schema.project)
      : (schema.project ?? 'app');
    const sourceRoot = workspace?.projects[projectName]?.sourceRoot ?? 'src';

    const lines = [
      '// @file fcss-purge.mjs',
      '// @description Pre-build FCSS purge — writes only the utilities your templates use, for production builds.',
      '// @layer config',
      '/* global console */',
      "import { createRequire } from 'module';",
      "import { readFileSync, writeFileSync } from 'fs';",
      '',
      'const require = createRequire(import.meta.url);',
      "const manifestPath = require.resolve('@functionalcss/core/manifest.json');",
      "const fullCssPath = require.resolve('@functionalcss/core/full.css');",
      '',
      "const { default: postcss } = await import('postcss');",
      "const { default: fcssPostcss } = await import('@functionalcss/postcss');",
      '',
      `const outFile = '${sourceRoot}/${PURGED_STYLES_FILE}';`,
      `const contentPatterns = ['${sourceRoot}/**/*.{ts,html}'];`,
      '',
      'const result = await postcss([',
      '  fcssPostcss({ manifest: manifestPath, content: contentPatterns, report: true }),',
      "]).process(readFileSync(fullCssPath, 'utf-8'), { from: fullCssPath, to: outFile });",
      '',
      "writeFileSync(outFile, result.css, 'utf-8');",
      "console.log('[@functionalcss/angular] Wrote ' + outFile);",
      '',
    ];
    tree.create('fcss-purge.mjs', lines.join('\n'));
    context.logger.info('[@functionalcss/angular] Created fcss-purge.mjs pre-build purge script.');
  };
}

function scheduleInstall(schema: NgAddSchema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    if (schema.skipInstall) return;
    context.addTask(new NodePackageInstallTask());
    context.logger.info('[@functionalcss/angular] Scheduled package install.');
  };
}

export function ngAdd(schema: NgAddSchema): Rule {
  return chain([
    addPackageDependencies(schema),
    addGlobalStyles(schema),
    createFcssConfig(),
    createPurgeScript(schema),
    addBuildScript(),
    ignorePurgedStyles(schema),
    scheduleInstall(schema),
  ]);
}
