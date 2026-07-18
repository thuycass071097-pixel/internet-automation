const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { FileUploadPage } = require('../pages/FileUploadPage');

test.describe('File Upload Feature', () => {
  let uploadPage;

  // path.resolve tạo đường dẫn tuyệt đối — hoạt động trên cả Windows và macOS
  const testFilePath = path.resolve(__dirname, '../test-data/sample-upload.txt');

  // beforeAll chạy 1 lần trước tất cả tests — tạo file nếu chưa có
  test.beforeAll(async () => {
    const testDataDir = path.resolve(__dirname, '../test-data');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'Đây là file test cho Playwright automation.');
    }
  });

  test.beforeEach(async ({ page }) => {
    uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
  });

  test('TC09 — Upload file thành công', async () => {
    await uploadPage.uploadFile(testFilePath);
    const isSuccess = await uploadPage.isUploadSuccessful();
    expect(isSuccess).toBe(true);
  });

  test('TC10 — Verify tên file được hiển thị sau khi upload', async () => {
    await uploadPage.uploadFile(testFilePath);
    const uploadedFileName = await uploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('sample-upload.txt');
  });
});