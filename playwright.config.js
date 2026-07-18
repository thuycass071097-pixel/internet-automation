const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  workers: 2,
  retries: 1,
  timeout: 30000,

  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});