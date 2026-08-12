// @file packages/cli/src/bin.ts
// @description fcss CLI binary entry point — wires all commands via commander.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { Command } from 'commander';
import { loadConfig } from './config/loader.js';
import { runBuild } from './commands/build.js';
import { runPurge } from './commands/purge.js';
import { runInit, type Framework } from './commands/init.js';
import { runAudit } from './commands/audit.js';
import { runDoctor } from './commands/doctor.js';
import { runList } from './commands/list.js';
import { runExplain } from './commands/explain.js';
import { runMigrate } from './commands/migrate.js';

const program = new Command();

program.name('fcss').description('FCSS — Functional CSS utility toolkit').version('0.0.0');

program
  .command('build')
  .description('Generate custom CSS from fcss.config.ts')
  .action(async () => {
    const { config } = await loadConfig();
    await runBuild(config);
  });

program
  .command('purge')
  .description('Remove unused FCSS utilities from a CSS bundle')
  .requiredOption('-i, --input <file>', 'Input CSS file path')
  .requiredOption('-o, --output <file>', 'Output CSS file path')
  .option('--report-json <file>', 'Write JSON purge report to file')
  .action(async (opts: { input: string; output: string; reportJson?: string }) => {
    const { config } = await loadConfig();
    const purgeOpts = opts.reportJson
      ? { input: opts.input, output: opts.output, reportJson: opts.reportJson }
      : { input: opts.input, output: opts.output };
    await runPurge(config, purgeOpts);
  });

program
  .command('init')
  .description('Scaffold fcss.config.ts and add CSS imports (idempotent)')
  .option('-f, --framework <name>', 'Framework to configure (react, next, angular, astro, none)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (opts: { framework?: string; yes?: boolean }) => {
    const framework = opts.framework as Framework | undefined;
    const initOpts =
      framework !== undefined
        ? { framework, ...(opts.yes ? { yes: true as const } : {}) }
        : { ...(opts.yes ? { yes: true as const } : {}) };
    await runInit(initOpts);
  });

program
  .command('audit')
  .description('Audit source files for FCSS issues')
  .action(async () => {
    const { config } = await loadConfig();
    const result = await runAudit(config);
    if (result.findings.length === 0) {
      console.log(`[fcss] No issues found in ${result.scannedFiles} file(s).`);
    } else {
      for (const f of result.findings) {
        const icon = f.severity === 'error' ? '✗' : '!';
        console.log(`  ${icon} [${f.type}] ${f.message}${f.file ? ` (${f.file})` : ''}`);
      }
      process.exitCode = result.findings.some((f) => f.severity === 'error') ? 1 : 0;
    }
  });

program
  .command('doctor')
  .description('Check installation health and configuration')
  .action(async () => {
    const { config } = await loadConfig();
    const result = await runDoctor(config);
    if (!result.healthy) process.exitCode = 1;
  });

program
  .command('list')
  .description('List all available FCSS utility classes')
  .option('-p, --property <name>', 'Filter by CSS property')
  .option('-c, --category <name>', 'Filter by category')
  .option('-s, --state <name>', 'Filter by pseudo-state')
  .option('-b, --breakpoint <name>', 'Filter by breakpoint')
  .action((opts: { property?: string; category?: string; state?: string; breakpoint?: string }) => {
    const entries = runList(opts);
    for (const e of entries) {
      console.log(`${e.className}  →  ${e.property}: ${e.value}  [${e.category}]`);
    }
    console.log(`\n${entries.length} classes`);
  });

program
  .command('explain')
  .description('Show details for a FCSS class name')
  .argument('<class>', 'FCSS class name to explain')
  .action((className: string) => {
    const result = runExplain(className);
    if (!result) {
      console.error(`[fcss] Unknown class: "${className}"`);
      process.exitCode = 1;
      return;
    }
    console.log(`Class:       ${result.className}`);
    console.log(`Property:    ${result.property}`);
    console.log(`Value:       ${result.value}`);
    if (result.condition) {
      if (result.condition.type === 'aria') {
        console.log(`Condition:   [${result.condition.attribute}='${result.condition.value}']`);
      } else {
        console.log(`Condition:   :${result.condition.value}`);
      }
    }
    if (result.breakpoint) console.log(`Breakpoint:  ${result.breakpoint}`);
    if (result.mediaQuery) console.log(`Media:       ${result.mediaQuery}`);
    console.log(`Selector:    ${result.selector}`);
    console.log(`Declaration: ${result.declaration}`);
    console.log(`Category:    ${result.category}`);
  });

program
  .command('migrate')
  .description('Replace legacy FCSS class names (use --force to apply changes)')
  .option('--force', 'Apply replacements (backups created automatically)')
  .option('--dry-run', 'Report findings without modifying files')
  .action(async (opts: { force?: boolean; dryRun?: boolean }) => {
    const { config } = await loadConfig();
    const migrateOpts = {
      ...(opts.force ? { force: true as const } : {}),
      ...(opts.dryRun ? { dryRun: true as const } : {}),
    };
    const result = await runMigrate(config, migrateOpts);
    if (result.findings.length > 0 && !opts.force && !opts.dryRun) {
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error('[fcss]', String(err));
  process.exitCode = 1;
});
