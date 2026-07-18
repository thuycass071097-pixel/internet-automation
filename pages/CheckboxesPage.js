// Page Object cho trang Checkboxes
// Selectors lấy từ Inspector — chạy: npx playwright codegen .../checkboxes
// Lưu ý: Trang này không có ID riêng cho từng checkbox → dùng .nth(index)

class CheckboxesPage {
  constructor(page) {
    this.page = page;

    // Inspector gợi ý: locator('input[type="checkbox"]').first() hoặc .nth(0)
    // .nth(0) = checkbox đầu tiên (mặc định: unchecked)
    this.checkbox1 = page.locator('input[type="checkbox"]').nth(0);

    // .nth(1) = checkbox thứ hai (mặc định: checked)
    this.checkbox2 = page.locator('input[type="checkbox"]').nth(1);
  }

  async goto() {
    await this.page.goto('/checkboxes');
  }

  // Nhận vào locator (checkbox1 hoặc checkbox2), trả về true/false
  async isChecked(checkboxLocator) {
    return await checkboxLocator.isChecked();
  }

  // Check an toàn — chỉ click nếu chưa được check
  async check(checkboxLocator) {
    const checked = await checkboxLocator.isChecked();
    if (!checked) {
      await checkboxLocator.click();
    }
  }

  // Uncheck an toàn — chỉ click nếu đang được check
  async uncheck(checkboxLocator) {
    const checked = await checkboxLocator.isChecked();
    if (checked) {
      await checkboxLocator.click();
    }
  }
}

module.exports = { CheckboxesPage };