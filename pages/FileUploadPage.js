// Page Object cho trang File Upload
// Selectors lấy từ Inspector — chạy: npx playwright codegen .../upload
// Lưu ý: #file-upload là input type="file" ẩn — Inspector gợi ý locator('#file-upload')

class FileUploadPage {
  constructor(page) {
    this.page = page;

    // Inspector gợi ý: locator('#file-upload') khi hover vào vùng chọn file
    // Đây là <input type="file"> ẩn — không click được trong browser bình thường
    this.fileInput = page.locator('#file-upload');

    // Inspector gợi ý: locator('#file-submit') khi hover vào nút Upload
    this.uploadButton = page.locator('#file-submit');

    // Chỉ xuất hiện sau khi upload thành công
    // Inspector gợi ý: locator('#uploaded-files')
    this.uploadedFileName = page.locator('#uploaded-files');

    // Heading "File Uploaded!" xuất hiện sau khi upload thành công
    this.successHeading = page.locator('h3');
  }

  async goto() {
    await this.page.goto('/upload');
  }

  // setInputFiles() bypass file dialog — không cần mở cửa sổ chọn file
  // filePath phải là đường dẫn tuyệt đối (dùng path.resolve trong test file)
  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  async getUploadedFileName() {
    await this.uploadedFileName.waitFor({ state: 'visible' });
    return await this.uploadedFileName.innerText();
  }

  async isUploadSuccessful() {
    const heading = await this.successHeading.innerText();
    return heading.includes('File Uploaded');
  }
}

module.exports = { FileUploadPage };