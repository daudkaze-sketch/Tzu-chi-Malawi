from pathlib import Path
import re
path = Path('prisma/schema.prisma')
text = path.read_text(encoding='utf-8')
orig = text
text = re.sub(r'^\s*accounts\s+Account\[\]\s*\n', '', text, flags=re.M)
text = re.sub(r'^\s*sessions\s+Session\[\]\s*\n', '', text, flags=re.M)
text = re.sub(r'model Account \{[\s\S]*?^\}\n\n', '', text, flags=re.M)
text = re.sub(r'model Session \{[\s\S]*?^\}\n\n', '', text, flags=re.M)
text = re.sub(r'model VerificationToken \{[\s\S]*?^\}\n\n', '', text, flags=re.M)
text = re.sub(r'^([ \t]*userId[ \t]+)String([ \t]*)$', r'\1String?\2', text, flags=re.M)
text = re.sub(r'^([ \t]*user[ \t]+)User([ \t]+@relation\(fields: \[userId\], references: \[id\]\))', r'\1User?\2', text, flags=re.M)
if text != orig:
    path.write_text(text, encoding='utf-8')
    print('Schema patched')
else:
    print('No changes')
