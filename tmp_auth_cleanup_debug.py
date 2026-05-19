from pathlib import Path
root = Path('src')
for path in sorted(root.rglob('*.tsx')):
    text = path.read_text(encoding='utf-8')
    if "localStorage.getItem('token')" in text or "localStorage.getItem(\"token\")" in text or "router.push('/login')" in text or "router.push(\"/login\")" in text or ("headers:" in text and "Authorization" in text):
        print(path)
