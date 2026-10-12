// @file examples/astro/server/tests/smoke.spec.ts
// @description Playwright smoke test for the FCSS Astro server (Node adapter) production build.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { test, expect } from '@playwright/test';

test('page renders app root', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});

test('page is server-rendered per request', async ({ page, request }) => {
  const first = await (await request.get('/')).text();
  const second = await (await request.get('/')).text();

  const extractRenderedAt = (html: string) => {
    const match = /data-testid="rendered-at">([^<]+)</.exec(html);
    return match?.[1];
  };

  const firstTimestamp = extractRenderedAt(first);
  const secondTimestamp = extractRenderedAt(second);
  expect(firstTimestamp).toBeTruthy();
  expect(secondTimestamp).toBeTruthy();
  expect(firstTimestamp).not.toBe(secondTimestamp);

  await page.goto('/');
});

test('FCSS display--flex is applied to app root', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('app-root');
  const display = await root.evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe('flex');
});

test('card renders with correct FCSS classes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('card-title')).toContainText('FCSS Card');
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
