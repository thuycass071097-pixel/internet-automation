const { test, expect } = require('@playwright/test');
const { DragAndDropPage } = require('../pages/DragAndDropPage');

test.describe('Drag and Drop Feature', () => {
  let dragDropPage;

  test.beforeEach(async ({ page }) => {
    dragDropPage = new DragAndDropPage(page);
    await dragDropPage.goto();
  });

  test('TC11 — Drag column A sang column B và verify vị trí hoán đổi', async () => {
    // Verify trạng thái ban đầu: A ở trái, B ở phải
    expect(await dragDropPage.getColumnAText()).toBe('A');
    expect(await dragDropPage.getColumnBText()).toBe('B');

    // Dùng mouse events vì HTML5 drag API không stable trên trang này
    // Inspector không ghi được action này — phải viết thủ công
    await dragDropPage.dragAToBWithMouse();

    // Verify sau drag: vị trí đã hoán đổi
    expect(await dragDropPage.getColumnAText()).toBe('B');
    expect(await dragDropPage.getColumnBText()).toBe('A');
  });
});