from pathlib import Path
import re

root = Path('src/app/api')
files = list(root.rglob('*.ts'))

for path in files:
    text = path.read_text(encoding='utf-8')
    
    # Fix empty try blocks: "try {    }" -> ""
    text = re.sub(r'try \{\s*\}', '', text)
    
    # Fix "try {" without content (remove try-catch wrapper entirely if empty)
    # This is trickier - we need to unindent the body that was inside
    
    path.write_text(text, encoding='utf-8')
    print(f"Repaired {path.name}")

print("Done!")
