// @file packages/scanner/src/discover.ts
// @description File discovery using glob patterns for the FCSS scanner.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { realpath } from 'node:fs/promises';
import path from 'node:path';
import { convertPathToPattern, glob, isDynamicPattern } from 'tinyglobby';

export interface DiscoverOptions {
  patterns: string[];
  cwd?: string;
  ignore?: string[];
}

interface ResolvedPatterns {
  patterns: string[];
  // [real directory, directory as written], both with forward slashes
  aliases: [string, string][];
}

const toSlashes = (p: string): string => p.split(path.sep).join('/');

/**
 * tinyglobby crawls a pattern that leaves cwd from a common ancestor of both,
 * so with followSymbolicLinks: false it cannot reach a directory behind a
 * symlink in the pattern's static part (e.g. macOS /var -> /private/var).
 * fast-glob always resolved that part. To keep that, rewrite such patterns to
 * their real directory and remember the alias to map the results back.
 */
async function resolveOutsidePatterns(patterns: string[], cwd: string): Promise<ResolvedPatterns> {
  const aliases: [string, string][] = [];

  const resolved = await Promise.all(
    patterns.map(async (pattern) => {
      const negated = pattern.startsWith('!');
      const body = negated ? pattern.slice(1) : pattern;
      if (body.includes('\\')) return pattern;

      // Static directory part, never including the last segment, so a
      // symlinked file at the end is still governed by followSymbolicLinks.
      const segments = body.split('/');
      let n = 0;
      while (n < segments.length - 1 && !isDynamicPattern(segments[n]!)) n++;
      if (n === 0 || (n === 1 && segments[0] === '')) return pattern;

      const base = path.resolve(cwd, segments.slice(0, n).join('/'));
      const fromCwd = path.relative(cwd, base);
      if (!fromCwd.startsWith('..') && !path.isAbsolute(fromCwd)) return pattern;

      let real: string;
      try {
        real = await realpath(base);
      } catch {
        return pattern;
      }
      if (real === base) return pattern;

      aliases.push([toSlashes(real), toSlashes(base)]);
      const rest = segments.slice(n).join('/');
      return `${negated ? '!' : ''}${convertPathToPattern(real)}/${rest}`;
    }),
  );

  return { patterns: resolved, aliases };
}

export async function discoverFiles(options: DiscoverOptions): Promise<string[]> {
  const { patterns, cwd = process.cwd(), ignore = ['**/node_modules/**', '**/.git/**'] } = options;

  if (patterns.length === 0) return [];

  const resolved = await resolveOutsidePatterns(patterns, cwd);

  const files = await glob(resolved.patterns, {
    cwd,
    absolute: true,
    ignore,
    onlyFiles: true,
    followSymbolicLinks: false,
    // tinyglobby expands a bare directory pattern to `dir/**`; fast-glob did not.
    expandDirectories: false,
  });

  if (resolved.aliases.length === 0) return files.sort();

  const mapped = files.map((file) => {
    for (const [real, written] of resolved.aliases) {
      if (file.startsWith(`${real}/`)) return written + file.slice(real.length);
    }
    return file;
  });

  return [...new Set(mapped)].sort();
}
