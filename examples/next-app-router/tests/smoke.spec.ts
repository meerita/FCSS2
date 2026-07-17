// @file examples/next-app-router/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS Next.js App Router production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('home page renders app root', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('FCSS display--flex is applied to app root', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  const root = page.getByTestId('app-root');
  const display = await root.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('flex');
});

test('card component renders', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByTestId('card')).toBeVisible();
  const button = page.getByTestId('card-button');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveText('Collapse');
});

test('shared Banner component from packages/ui renders', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByTestId('ui-banner')).toBeVisible();
});

test('dynamic route renders', async ({ page }) => {
  await page.goto('http://localhost:3001/about');
  await expect(page.getByTestId('slug-page')).toBeVisible();
  await expect(page.getByTestId('slug-title')).toHaveText('about');
});

test('purged CSS retains used selectors and removes unused ones', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  const cssText = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    const texts: string[] = [];
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules ?? []);
        texts.push(rules.map((r) => r.cssText).join('\n'));
      } catch {
        // Cross-origin or restricted sheets
      }
    }
    return texts.join('\n');
  });

  // Used in fixture — must be retained
  expect(cssText).toContain('display--flex');
  expect(cssText).toContain('font-weight--700');

  // Never used in fixture — must be purged
  expect(cssText).not.toContain('display--inline-table');
});
