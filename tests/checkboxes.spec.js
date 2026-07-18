const { test, expect } = require('@playwright/test');
const { CheckboxesPage } = require('../pages/CheckboxesPage');

test.describe('Checkboxes Feature', () => {
  let checkboxesPage;

  test.beforeEach(async ({ page }) => {
    checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();
  });

  test('TC04 — Verify trạng thái mặc định của checkboxes', async () => {
    // Trang demo: checkbox1 = unchecked, checkbox2 = checked
    const cb1Checked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    const cb2Checked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);

    expect(cb1Checked).toBe(false);
    expect(cb2Checked).toBe(true);
  });

  test('TC05 — Check checkbox 1 thành công', async () => {
    await checkboxesPage.check(checkboxesPage.checkbox1);
    const isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    expect(isChecked).toBe(true);
  });

  test('TC06 — Uncheck checkbox 2 thành công', async () => {
    await checkboxesPage.uncheck(checkboxesPage.checkbox2);
    const isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);
    expect(isChecked).toBe(false);
  });
});