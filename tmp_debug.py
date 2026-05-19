from pathlib import Path
root = Path('src')
for path in sorted(root.rglob('*.tsx')):
    text = path.read_text(encoding='utf-8')
    if 'localStorage.getItem' in text or "router.push('/login')" in text or 'router.push("/login")' in text or 'Authorization' in text or 'useSession' in text or 'signIn(' in text or 'signOut(' in text:
        print(path)
