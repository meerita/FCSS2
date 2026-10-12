// @file packages/generator/tests/browser/css-computed-style.spec.ts
// @description Playwright browser tests — verify getComputedStyle matches FCSS generated CSS in all 3 engines.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';
import { generate } from '../../src/generate.js';

let fixtureCSS = '';

test.beforeAll(() => {
  const result = generate();
  const baseRules = result.rules.filter((r) => !r.mediaQuery);
  fixtureCSS = baseRules.map((r) => `${r.selector} { ${r.declaration} }`).join('\n');
});

async function injectAndGetStyle(
  page: import('@playwright/test').Page,
  className: string,
  property: string,
): Promise<string> {
  await page.setContent(`
    <!doctype html>
    <html><head><style>${fixtureCSS}</style></head>
    <body><div class="${className}" id="el"></div></body>
    </html>
  `);
  return page.evaluate((prop) => {
    const el = document.getElementById('el');
    return el ? getComputedStyle(el).getPropertyValue(prop).trim() : '';
  }, property);
}

test('display--flex sets display to flex', async ({ page }) => {
  const value = await injectAndGetStyle(page, 'display--flex', 'display');
  expect(value).toBe('flex');
});

test('display--none sets display to none', async ({ page }) => {
  const value = await injectAndGetStyle(page, 'display--none', 'display');
  expect(value).toBe('none');
});

test('display--block sets display to block', async ({ page }) => {
  const value = await injectAndGetStyle(page, 'display--block', 'display');
  expect(value).toBe('block');
});

test('visibility--hidden sets visibility to hidden', async ({ page }) => {
  const value = await injectAndGetStyle(page, 'visibility--hidden', 'visibility');
  expect(value).toBe('hidden');
});

test('position--relative sets position to relative', async ({ page }) => {
  const value = await injectAndGetStyle(page, 'position--relative', 'position');
  expect(value).toBe('relative');
});
