// @file packages/angular/tests/ng-add.test.ts
// @description Unit tests for the @functionalcss/angular ng-add schematic.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveProjectName } from '../schematics/ng-add/index.js';

const ownVersion = (
  JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
    version: string;
  }
).version;

// ---------------------------------------------------------------------------
// resolveProjectName — pure helper function tests
// ---------------------------------------------------------------------------

interface WorkspaceProject {
  projectType?: string;
  root?: string;
}

interface AngularWorkspace {
  defaultProject?: string;
  projects: Record<string, WorkspaceProject>;
}

function workspace(
  projects: Record<string, WorkspaceProject>,
  defaultProject?: string,
): AngularWorkspace {
  return { projects, defaultProject };
}

describe('resolveProjectName — explicit project', () => {
  it('returns the requested project when it exists', () => {
    const ws = workspace({ myApp: { projectType: 'application' } });
    expect(resolveProjectName(ws, 'myApp')).toBe('myApp');
  });

  it('throws when the requested project does not exist', () => {
    const ws = workspace({ myApp: {} });
    expect(() => resolveProjectName(ws, 'unknown')).toThrow('"unknown" not found');
  });
});

describe('resolveProjectName — defaultProject fallback', () => {
  it('returns defaultProject when no explicit project is given', () => {
    const ws = workspace({ myApp: {}, other: {} }, 'myApp');
    expect(resolveProjectName(ws, undefined)).toBe('myApp');
  });

  it('ignores defaultProject when it is missing from projects', () => {
    const ws = workspace({ appA: { projectType: 'application' } }, 'deleted');
    expect(resolveProjectName(ws, undefined)).toBe('appA');
  });
});

describe('resolveProjectName — application heuristic', () => {
  it('picks the first project with projectType === application', () => {
    const ws = workspace({
      lib1: { projectType: 'library' },
      app1: { projectType: 'application' },
      app2: { projectType: 'application' },
    });
    expect(resolveProjectName(ws, undefined)).toBe('app1');
  });

  it('falls back to the first project when no application type found', () => {
    const ws = workspace({ alpha: {}, beta: {} });
    expect(resolveProjectName(ws, undefined)).toBe('alpha');
  });
});

describe('resolveProjectName — empty workspace', () => {
  it('throws when there are no projects', () => {
    const ws = workspace({});
    expect(() => resolveProjectName(ws, undefined)).toThrow('No projects found');
  });
});

// ---------------------------------------------------------------------------
// Schematic output shape — tests using SchematicTestRunner
//
// These tests require dist-schematics/ng-add/index.js to exist.
// Build the package first with `pnpm run build`.
// ---------------------------------------------------------------------------

import * as path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schematicBuilt = existsSync(path.resolve(__dirname, '../dist-schematics/ng-add/index.js'));

describe.skipIf(!schematicBuilt)(
  'ng-add schematic (requires dist-schematics — run pnpm run build first)',
  async () => {
    // Lazy-load SchematicTestRunner only when the compiled schematic is present.
    const { SchematicTestRunner } = await import('@angular-devkit/schematics/testing');

    const collectionPath = path.resolve(__dirname, '../collection.json');
    const runner = new SchematicTestRunner('@functionalcss/angular', collectionPath);

    const baseAngularJson = JSON.stringify({
      version: 1,
      projects: {
        myApp: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                styles: ['src/styles.css'],
              },
            },
          },
        },
      },
    });

    const basePackageJson = JSON.stringify({
      name: 'my-app',
      dependencies: {},
      devDependencies: {},
    });

    it('adds @functionalcss/core to dependencies', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const pkg = JSON.parse(tree.readContent('package.json'));
      expect(pkg.dependencies['@functionalcss/core']).toBeDefined();
      expect(pkg.dependencies['@functionalcss/core']).toBe(`^${ownVersion}`);
    });

    it('adds @functionalcss/postcss to devDependencies', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const pkg = JSON.parse(tree.readContent('package.json'));
      expect(pkg.devDependencies['@functionalcss/postcss']).toBeDefined();
    });

    it('prepends @functionalcss/core/full.css to the styles array', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const angular = JSON.parse(tree.readContent('angular.json'));
      const styles = angular.projects.myApp.architect.build.options.styles;
      expect(styles[0]).toBe('node_modules/@functionalcss/core/dist/full.css');
      expect(styles[1]).toBe('src/styles.css');
    });

    it('creates fcss.config.ts', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      expect(tree.exists('fcss.config.ts')).toBe(true);
      expect(tree.readContent('fcss.config.ts')).toContain('@functionalcss/angular');
    });

    it('creates fcss-purge.mjs pre-build purge script', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      expect(tree.exists('fcss-purge.mjs')).toBe(true);
      const script = tree.readContent('fcss-purge.mjs');
      expect(script).toContain('@functionalcss/postcss');
      expect(script).toContain("const outFile = 'src/fcss.purged.css';");
    });

    it('points production builds at the purged stylesheet', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      const workspace = JSON.parse(baseAngularJson);
      workspace.projects.myApp.architect.build.configurations = {
        production: { outputHashing: 'all' },
      };
      host.create('angular.json', JSON.stringify(workspace));
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const build = JSON.parse(tree.readContent('angular.json')).projects.myApp.architect.build;
      expect(build.configurations.production.styles).toEqual([
        'src/fcss.purged.css',
        'src/styles.css',
      ]);
      expect(build.configurations.production.outputHashing).toBe('all');
    });

    it('runs the purge before ng build in the build script', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create(
        'package.json',
        JSON.stringify({ name: 'my-app', scripts: { build: 'ng build' } }),
      );

      const tree1 = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const tree2 = await runner.runSchematic('ng-add', { skipInstall: true }, tree1);
      const pkg = JSON.parse(tree2.readContent('package.json'));
      expect(pkg.scripts.build).toBe('node fcss-purge.mjs && ng build');
    });

    it('git-ignores the generated stylesheet once', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);
      host.create('.gitignore', '/dist\n');

      const tree1 = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const tree2 = await runner.runSchematic('ng-add', { skipInstall: true }, tree1);
      const gitignore = tree2.readContent('.gitignore');
      expect(gitignore.match(/\/src\/fcss\.purged\.css/g)).toHaveLength(1);
      expect(gitignore.startsWith('/dist\n')).toBe(true);
    });

    it('is idempotent — running twice does not duplicate the styles entry or purge script', async () => {
      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', baseAngularJson);
      host.create('package.json', basePackageJson);

      const tree1 = await runner.runSchematic('ng-add', { skipInstall: true }, host);
      const tree2 = await runner.runSchematic('ng-add', { skipInstall: true }, tree1);
      const angular = JSON.parse(tree2.readContent('angular.json'));
      const styles: string[] = angular.projects.myApp.architect.build.options.styles;
      const fcssEntries = styles.filter((s) => s.includes('@functionalcss/core'));
      expect(fcssEntries).toHaveLength(1);
    });

    it('only modifies the selected project in a workspace', async () => {
      const multiProjectAngularJson = JSON.stringify({
        version: 1,
        projects: {
          app1: {
            projectType: 'application',
            root: 'projects/app1',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: { styles: ['projects/app1/src/styles.css'] },
              },
            },
          },
          app2: {
            projectType: 'application',
            root: 'projects/app2',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: { styles: ['projects/app2/src/styles.css'] },
              },
            },
          },
        },
      });

      const { UnitTestTree } = await import('@angular-devkit/schematics/testing');
      const host = new UnitTestTree((await import('@angular-devkit/schematics')).Tree.empty());
      host.create('angular.json', multiProjectAngularJson);
      host.create('package.json', basePackageJson);

      const tree = await runner.runSchematic(
        'ng-add',
        { project: 'app1', skipInstall: true },
        host,
      );

      const angular = JSON.parse(tree.readContent('angular.json'));
      const app1Styles: string[] = angular.projects.app1.architect.build.options.styles;
      const app2Styles: string[] = angular.projects.app2.architect.build.options.styles;

      expect(app1Styles.some((s) => s.includes('@functionalcss/core'))).toBe(true);
      expect(app2Styles.some((s) => s.includes('@functionalcss/core'))).toBe(false);
    });
  },
);
