const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

test.describe('Login Feature', () => {
  let loginPage;

  // beforeEach chạy trước mỗi test — tạo Page Object và mở trang
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC01 — Login thành công với credentials hợp lệ', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    // Verify redirect sang /secure
    await expect(page).toHaveURL(/.*take/);

    // Verify flash message thành công
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('You logged into a secure area');

    // Verify heading trang Secure Area
    await expect(loginPage.pageHeading).toContainText('Secure Area');
  });

  test('TC02 — Login thất bại với password sai', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, 'wrong-password-123');

    // Verify vẫn ở trang login
    await expect(page).toHaveURL(/.*login/);

    // Verify flash message lỗi
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('Your password is invalid');
  });

  test('TC03 — Login thất bại với username sai', async ({ page }) => {
    await loginPage.login('nonexistent_user', VALID_PASSWORD);

    await expect(page).toHaveURL(/.*login/);
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('Your username is invalid');
  });

  // Thêm 1 test sai vào tests/login.spec.js
  test('TC_INTENTIONAL_FAIL — Test để kiểm tra AI pipeline', async ({ page }) => {
  await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
  // Selector không tồn tại — sẽ fail
  await expect(page.locator('#nonexistent-element-xyz')).toBeVisible();
});
});