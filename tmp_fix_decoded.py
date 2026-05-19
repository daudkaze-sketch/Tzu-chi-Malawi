from pathlib import Path
import re

root = Path('src/app/api')
files = list(root.rglob('*.ts'))

for path in files:
    text = path.read_text(encoding='utf-8')
    
    # Remove decoded references 
    text = re.sub(r'if \(record\.userId !== decoded\.userId\) \{[\s\S]*?\n\s*\}\n', '', text)
    text = re.sub(r'if \(.*?decoded\.\w+.*?\) \{[\s\S]*?\n\s*\}\n', '', text)
    
    # Remove all stray decoded variable references
    text = re.sub(r'\s*const.*?= decoded\..*?\n', '', text)
    text = re.sub(r'\s*if \(!decoded.*?\n\s*return.*?\n', '', text)
    
    path.write_text(text, encoding='utf-8')
    print(f"Fixed {path.name}")

print("Done!")
