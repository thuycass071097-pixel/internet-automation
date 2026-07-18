const { test, expect } = require('@playwright/test');
const { DropdownPage } = require('../pages/DropdownPage');

test.describe('Dropdown Feature', () => {
  let dropdownPage;

  test.beforeEach(async ({ page }) => {
    dropdownPage = new DropdownPage(page);
    await dropdownPage.goto();
  });

  test('TC07 — Chọn Option 1 từ dropdown', async () => {
    await dropdownPage.selectByValue('1');

    const selectedValue = await dropdownPage.getSelectedOption();
    expect(selectedValue).toBe('1');

    const selectedText = await dropdownPage.getSelectedOptionText();
    expect(selectedText).toContain('Option 1');
  });

  test('TC08 — Chọn Option 2 từ dropdown', async () => {
    await dropdownPage.selectByLabel('Option 2');

    const selectedValue = await dropdownPage.getSelectedOption();
    expect(selectedValue).toBe('2');
  });
});