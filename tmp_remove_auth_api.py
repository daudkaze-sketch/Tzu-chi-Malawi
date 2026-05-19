from pathlib import Path
import re
root = Path('src/app/api')
files = list(root.rglob('*.ts'))
for path in files:
    text = path.read_text(encoding='utf-8')
    orig = text
    text = re.sub(r"^import \{ getServerSession \} from ['\"][^'\"]+['\"];?\n", '', text, flags=re.M)
    text = re.sub(r"^import \{ authOptions \} from ['\"][^'\"]+['\"];?\n", '', text, flags=re.M)
    text = re.sub(r"^import jwt from ['\"][^'\"]+['\"];?\n", '', text, flags=re.M)
    text = re.sub(r"^import \{ verifyToken \} from ['\"][^'\"]+['\"];?\n", '', text, flags=re.M)
    text = re.sub(r"^\s*const authHeader = request\.headers\.get\('Authorization'\);?\n", '', text, flags=re.M)
    text = re.sub(r"^\s*const token = request\.headers\.get\('authorization'\)\?\.replace\('Bearer ', ''\);?\n", '', text, flags=re.M)
    text = re.sub(r"^\s*const decoded = .*?;\n", '', text, flags=re.M)
    text = re.sub(r"^\s*const userId = decoded\.userId;\n", '', text, flags=re.M)
    text = re.sub(r"^\s*const session = await getServerSession\(authOptions\);\n", '', text, flags=re.M)
    text = re.sub(r"^\s*if \(!session\?\.user\?\.id\) \{[\s\S]*?return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\n\s*\}\n", '', text, flags=re.M)
    text = re.sub(r"^\s*if \(!session\?\.user\) \{[\s\S]*?return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\n\s*\}\n", '', text, flags=re.M)
    text = re.sub(r"^\s*if \(!token\) \{[\s\S]*?return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\n\s*\}\n", '', text, flags=re.M)
    text = re.sub(r"where: \{\s*userId: .*?\},?\n", '', text, flags=re.M)
    text = re.sub(r"userId:\s*session\.user\.id,?\n", '', text, flags=re.M)
    text = re.sub(r"userId:\s*decoded\.userId,?\n", '', text, flags=re.M)
    text = re.sub(r"^\s*Authorization:\s*`Bearer \$\{token\}`,?\n", '', text, flags=re.M)
    text = re.sub(r"^\s*Authorization:\s*'Bearer ' \+ token,?\n", '', text, flags=re.M)
    text = re.sub(r"headers:\s*\{\s*\},?\n", '', text, flags=re.M)
    text = re.sub(r"\n{3,}", '\n\n', text)
    if text != orig:
        path.write_text(text, encoding='utf-8')
        print(f"Patched {path}")
