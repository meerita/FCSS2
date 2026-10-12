// @file examples/angular/standalone/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS Angular standalone production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('app root is rendered', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('FCSS display--flex is applied to app root', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('app-root');
  const display = await root.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('flex');
});

test('card title is visible', async ({ page }) => {
  await page.goto('/');
  const title = page.getByTestId('card-title');
  await expect(title).toBeVisible();
  await expect(title).toHaveText('FCSS Card');
});

test('card button toggles expand/collapse', async ({ page }) => {
  await page.goto('/');
  const button = page.getByTestId('card-button');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Expand');
  await button.click();
  await expect(button).toHaveText('Collapse');
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
        // Cross-origin sheets
      }
    }
    return texts.join('\n');
  });

  // display--flex is used in the template — must be retained
  expect(cssText).toContain('display--flex');
  // font-weight--700 is used in the template — must be retained
  expect(cssText).toContain('font-weight--700');

  // display--inline-table is never used — must be purged
  expect(cssText).not.toContain('display--inline-table');
});
