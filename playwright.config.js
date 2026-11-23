const { defineConfig } = require('@playwright/test');

const externalURL = process.env.E2E_BASE_URL;
if (externalURL && new URL(externalURL).protocol !== 'https:') {
  throw new Error('Public acceptance requires HTTPS; certificate errors are not ignored.');
}

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 45_000,
  globalTimeout: 5 * 60_000,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: externalURL || 'http://127.0.0.1:8766',
    channel: process.env.E2E_BROWSER_CHANNEL || undefined,
    ignoreHTTPSErrors: false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-1440', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-390', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: externalURL ? undefined : {
    command: 'python3 -m http.server 8766 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8766',
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
