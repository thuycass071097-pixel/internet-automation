Title: [Test Automation] Sửa assertion sai regex trong TC01 login.spec.js (pattern không liên quan)

Body:

🐛 Mô tả lỗi

Test case TC01 ("Login thành công với credentials hợp lệ") fail do assertion sử dụng regex pattern /.*take/ — một chuỗi không liên quan gì đến URL trang /secure mà ứng dụng redirect tới sau khi login thành công. Đây là lỗi trong test script, không phải lỗi của ứng dụng.

🔁 Steps to Reproduce
Chạy test suite: npx playwright test tests/login.spec.js
Test TC01 tại login.spec.js:16:3 thực hiện login với credentials hợp lệ
Ứng dụng redirect đúng tới https://the-internet.herokuapp.com/secure
Assertion tại login.spec.js:20:24 kiểm tra URL với pattern /.*take/ → fail vì string thực tế không khớp
✅ Expected

Assertion phải dùng đúng regex /.*secure/ (đúng với comment ở dòng 19: "Verify redirect sang /secure") để match với URL thực tế, và test phải pass.

❌ Actual

Assertion dùng regex /.*take/, khiến test fail dù ứng dụng đã redirect đúng.

Expected pattern: /.*take/
Received string:  "https://the-internet.herokuapp.com/secure"
Timeout: 5000ms
🌍 Environment
Browser: chromium
OS: Không có trong CI output
Test file: tests\login.spec.js (dòng lỗi: 20, hàm chứa test case: dòng 16)
Commit: Không có trong CI output
📸 Evidence

Screenshot: test-results\login-Login-Feature-TC01-—-5ac75-công-với-credentials-hợp-lệ-chromium\test-failed-1.png

💥 Impact

Medium — Test tự động báo false negative (báo fail dù app hoạt động đúng), gây nhiễu kết quả CI và giảm độ tin cậy của test suite.

🏷️ Labels

test-automation, flaky-test, low-priority