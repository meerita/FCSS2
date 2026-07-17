// @file examples/react-vite/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS React+Vite production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('app renders root element', async ({ page }) => {
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
  await expect(title).toBeVisible();
  await expect(title).toHaveText('FCSS Card');
});

test('card button is visible and interactive', async ({ page }) => {
  await page.goto('/');
  const button = page.getByTestId('card-button');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveText('Collapse');
});

test('purged CSS does not contain unused FCSS selectors', async ({ page }) => {
  await page.goto('/');

  const cssFiles = await page.evaluate(async () => {
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

  // display--flex is used — must be retained
  expect(cssFiles).toContain('display--flex');

  // display--inline-table is never used in the fixture — must be purged
  expect(cssFiles).not.toContain('display--inline-table');
});
