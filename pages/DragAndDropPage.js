// Page Object cho trang Drag and Drop
// Selectors lấy từ Inspector — chạy: npx playwright codegen .../drag_and_drop
// Lưu ý: Inspector không ghi được drag action trên trang này (HTML5 drag API không stable)
// → Dùng mouse events thủ công thay thế

class DragAndDropPage {
  constructor(page) {
    this.page = page;

    // Inspector gợi ý: locator('#column-a') khi hover vào box A
    this.columnA = page.locator('#column-a');

    // Inspector gợi ý: locator('#column-b') khi hover vào box B
    this.columnB = page.locator('#column-b');

    // Header bên trong mỗi column — dùng để đọc text "A" hoặc "B"
    // Inspector gợi ý: locator('#column-a header')
    this.columnAHeader = page.locator('#column-a header');
    this.columnBHeader = page.locator('#column-b header');
  }

  async goto() {
    await this.page.goto('/drag_and_drop');
  }

  async getColumnAText() {
    return await this.columnAHeader.innerText();
  }

  async getColumnBText() {
    return await this.columnBHeader.innerText();
  }

  // Cách 1: dragTo() — đơn giản nhưng đôi khi không hoạt động với trang này
  async dragAtoB() {
    await this.columnA.dragTo(this.columnB);
  }

  // Cách 2: Mouse events thủ công — dùng khi dragTo() không hoạt động
  // boundingBox() lấy tọa độ x,y và kích thước của element
  async dragAToBWithMouse() {
    const sourceBox = await this.columnA.boundingBox();
    const targetBox = await this.columnB.boundingBox();

    // Di chuyển chuột đến giữa column A
    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );

    // Nhấn giữ chuột trái
    await this.page.mouse.down();

    // Chờ 500ms để trigger drag event
    await this.page.waitForTimeout(500);

    // Di chuyển từng bước nhỏ (steps: 10) để simulate drag tốt hơn
    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );

    // Thả chuột
    await this.page.mouse.up();

    // Chờ animation hoàn tất
    await this.page.waitForTimeout(500);
  }
}

module.exports = { DragAndDropPage };