// @file examples/next-pages-router/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS Next.js Pages Router production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('home page renders pages root', async ({ page }) => {
  await page.goto('http://localhost:3002/');
  await expect(page.getByTestId('pages-root')).toBeVisible();
});

test('FCSS display--flex is applied to pages root', async ({ page }) => {
  await page.goto('http://localhost:3002/');
  const root = page.getByTestId('pages-root');
  const display = await root.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('flex');
});

test('button toggles content visibility', async ({ page }) => {
  await page.goto('http://localhost:3002/');
  const button = page.getByTestId('pages-button');
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.getByTestId('pages-content')).toBeVisible();
  await expect(button).toHaveText('Collapse');
});

test('purged CSS retains used selectors and removes unused ones', async ({ page }) => {
  await page.goto('http://localhost:3002/');

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

  expect(cssText).toContain('display--flex');
  expect(cssText).not.toContain('display--inline-table');
});
