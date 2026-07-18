// Page Object cho trang Login
// Selectors lấy từ Playwright Inspector — chạy: npx playwright codegen .../login

class LoginPage {
  constructor(page) {
    this.page = page;

    // Inspector gợi ý: getByLabel hoặc locator('#username')
    // Chọn locator('#username') vì ID ổn định trên trang này
    this.usernameInput = page.locator('#username');

    // Inspector gợi ý: getByLabel('Password') hoặc locator('#password')
    this.passwordInput = page.locator('#password');

    // Inspector gợi ý: getByRole('button', { name: 'Login' })
    // Dùng button[type="submit"] vì role name đôi khi không match chính xác
    this.loginButton = page.locator('button[type="submit"]');

    // Inspector gợi ý: locator('#flash') — ID cố định, dùng được
    this.flashMessage = page.locator('#flash');

    // Inspector gợi ý khi hover vào link Logout sau khi đăng nhập
    this.logoutButton = page.locator('a[href="/logout"]');

    // Inspector gợi ý khi hover vào heading
    this.pageHeading = page.locator('h2');
  }

  // baseURL đã set trong playwright.config.js → chỉ cần '/login'
  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage() {
    // waitFor đảm bảo flash message đã xuất hiện trước khi đọc text
    await this.flashMessage.waitFor({ state: 'visible' });
    return await this.flashMessage.innerText();
  }

  async isLoggedIn() {
    return this.page.url().includes('/secure');
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };