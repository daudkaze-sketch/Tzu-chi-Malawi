from pathlib import Path
import re

root = Path('src/app/api')
files = list(root.rglob('*.ts'))

for path in files:
    text = path.read_text(encoding='utf-8')
    
    # Remove getToken function and similar token extraction functions
    text = re.sub(r'function getToken\(.*?\): string \| null \{[\s\S]*?\n\}', '', text)
    
    # Remove any remaining auth guards
    text = re.sub(r'\s+const token = getToken\(request\);?\n', '', text)
    text = re.sub(r'\s+if \(!token\)[\s\S]*?return NextResponse\.json\(\{ error: \'Unauthorized\' \}, \{ status: 401 \}\);?\n', '', text)
    text = re.sub(r'\s+if \(!decoded\)[\s\S]*?return NextResponse\.json\(\{ error: \'Invalid token\' \}, \{ status: 401 \}\);?\n', '', text)
    
    # Remove stray authHeader references
    text = re.sub(r'authHeader\?\.startsWith.*?\n', '', text)
    text = re.sub(r'authHeader\.substring\(7\).*?\n', '', text)
    
    # Clean excessive newlines
    text = re.sub(r'\n\n\n+', '\n\n', text)
    
    path.write_text(text, encoding='utf-8')
    print(f"Cleaned {path.name}")

print("Done!")
