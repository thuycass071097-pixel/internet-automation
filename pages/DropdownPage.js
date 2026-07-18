// Page Object cho trang Dropdown
// Selectors lấy từ Inspector — chạy: npx playwright codegen .../dropdown
// Inspector ghi lại: page.locator('#dropdown') khi hover vào select element

class DropdownPage {
  constructor(page) {
    this.page = page;

    // Inspector gợi ý: locator('#dropdown') — ID cố định
    this.dropdownSelect = page.locator('#dropdown');
  }

  async goto() {
    await this.page.goto('/dropdown');
  }

  // Chọn theo value attribute của <option> — ví dụ: selectByValue('1')
  async selectByValue(value) {
    await this.dropdownSelect.selectOption({ value: value });
  }

  // Chọn theo text hiển thị — ví dụ: selectByLabel('Option 1')
  async selectByLabel(label) {
    await this.dropdownSelect.selectOption({ label: label });
  }

  // Lấy value của option đang được chọn
  async getSelectedOption() {
    return await this.dropdownSelect.inputValue();
  }

  // Lấy text hiển thị của option đang được chọn
  async getSelectedOptionText() {
    const selectedValue = await this.dropdownSelect.inputValue();
    return await this.dropdownSelect
      .locator(`option[value="${selectedValue}"]`)
      .innerText();
  }
}

module.exports = { DropdownPage };