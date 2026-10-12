// @file packages/language-service/tests/compact-manifest.test.ts
// @description Guards the CommonJS compact-manifest copy against drift from @functionalcss/spec.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expandManifest, isCompactManifest } from '@functionalcss/spec';
import { parseManifest } from '../src/compact-manifest';

const require = createRequire(import.meta.url);

describe('compact manifest (CommonJS copy)', () => {
  it('expands the shipped core manifest identically to @functionalcss/spec', () => {
    const manifestPath = require.resolve('@functionalcss/core/manifest.json');
    const json: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!isCompactManifest(json)) throw new Error('core manifest is not compact');
    expect(parseManifest(json)).toEqual(expandManifest(json));
  });
});
