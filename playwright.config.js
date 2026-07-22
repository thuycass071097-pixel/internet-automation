const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  workers: 2,
  retries: 1,
  timeout: 30000,

  use: {
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list'],
  ],
});