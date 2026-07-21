# scripts/create_issue_from_failure.py
# Chạy sau khi Playwright test fail trong CI

import json
import os
import subprocess
import anthropic

def parse_playwright_results(results_file: str) -> list[dict]:
    """Đọc test-results.json và trả về danh sách test failures."""
    with open(results_file) as f:
        data = json.load(f)

    failures = []
    for suite in data.get('suites', []):
        for spec in suite.get('specs', []):
            for test in spec.get('tests', []):
                for result in test.get('results', []):
                    if result['status'] == 'failed':
                        failures.append({
                            'title': spec['title'],
                            'file': spec['file'],
                            'error': result.get('error', {}).get('message', ''),
                            'duration': result.get('duration', 0),
                            'browser': test.get('projectName', 'chromium'),
                        })
    return failures


def generate_issue_with_claude(failure: dict) -> dict:
    """Gọi Claude API để tạo GitHub Issue content."""
    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

    prompt = f"""
Viết GitHub Issue từ Playwright test failure sau. Output chỉ gồm JSON với 2 fields: "title" và "body".
Không có text nào khác ngoài JSON.

TEST FAILURE:
- Test name: {failure['title']}
- File: {failure['file']}
- Error: {failure['error']}
- Browser: {failure['browser']}
- Duration: {failure['duration']}ms
- Branch: {os.environ.get('GITHUB_REF_NAME', 'unknown')}
- Commit: {os.environ.get('GITHUB_SHA', 'unknown')[:8]}

OUTPUT FORMAT (JSON only):
{{
  "title": "[Component] Mô tả ngắn gọn (dưới 80 ký tự)",
  "body": "## 🐛 Mô tả lỗi\\n...\\n## 🔁 Steps to Reproduce\\n...\\n## ✅ Expected\\n...\\n## ❌ Actual\\n...\\n## 🌍 Environment\\n...\\n## 💥 Impact\\n..."
}}
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    # Parse JSON response
    response_text = message.content[0].text.strip()
    return json.loads(response_text)


def create_github_issue(title: str, body: str, labels: list[str]) -> str:
    """Dùng gh CLI để tạo GitHub Issue. Trả về URL của issue."""
    label_args = []
    for label in labels:
        label_args.extend(['--label', label])

    result = subprocess.run(
        ['gh', 'issue', 'create',
         '--title', title,
         '--body', body,
         *label_args],
        capture_output=True,
        text=True,
        check=True
    )

    # gh trả về URL của issue vừa tạo
    return result.stdout.strip()


def main():
    results_file = 'test-results.json'

    if not os.path.exists(results_file):
        print("Không tìm thấy test-results.json")
        return

    failures = parse_playwright_results(results_file)

    if not failures:
        print("Không có test failure nào")
        return

    print(f"Tìm thấy {len(failures)} failures. Đang tạo GitHub Issues...")
    created_issues = []

    for failure in failures:
        print(f"  → Xử lý: {failure['title']}")

        # Gọi AI để tạo issue content
        issue_content = generate_issue_with_claude(failure)

        # Tạo issue trên GitHub
        issue_url = create_github_issue(
            title=issue_content['title'],
            body=issue_content['body'],
            labels=['bug', 'automated', 'ci-failure']
        )

        created_issues.append(issue_url)
        print(f"    ✅ Issue created: {issue_url}")

    # In summary
    print(f"\n✅ Đã tạo {len(created_issues)} GitHub Issues:")
    for url in created_issues:
        print(f"  {url}")


if __name__ == '__main__':
    main()