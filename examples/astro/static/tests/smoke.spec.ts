// @file examples/astro/static/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS Astro static production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('page renders app root', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('FCSS display--flex is applied to app root', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('app-root');
  const display = await root.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('flex');
});

test('card title is visible and text is correct', async ({ page }) => {
  await page.goto('/');
  const title = page.getByTestId('card-title');
  await expect(title).toContainText('FCSS Card');
});

test('card button is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('card-button')).toBeVisible();
});

test('no FCSS runtime JS is present in the page', async ({ page }) => {
  await page.goto('/');
  const scripts = await page.evaluate(() =>
    Array.from(document.scripts).map((s) => s.src || s.textContent || ''),
  );
  for (const script of scripts) {
    expect(script).not.toContain('fcss');
  }
});

test('purged CSS retains used selectors and removes unused ones', async ({ page }) => {
  await page.goto('/');

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
  expect(cssText).toContain('display--none\\:aria-hidden\\:true');

  // Never used in fixture — must be purged
  expect(cssText).not.toContain('display--table-cell');
});
