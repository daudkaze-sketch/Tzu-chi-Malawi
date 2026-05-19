from pathlib import Path
import re
files = [
    Path('src/app/attendance/page.tsx'),
    Path('src/app/attendance/new/page.tsx'),
    Path('src/app/materials/page.tsx'),
    Path('src/app/materials/new/page.tsx'),
    Path('src/app/reports/page.tsx'),
    Path('src/app/reports/new/page.tsx'),
    Path('src/app/tasks/page.tsx'),
    Path('src/app/tasks/new/page.tsx'),
    Path('src/app/page.tsx'),
    Path('src/app/dashboard/page.tsx'),
    Path('src/components/Navigation.tsx'),
    Path('src/components/VillagesManagement.tsx'),
    Path('src/app/departments/charity/beneficiary-management/page.tsx'),
    Path('src/app/departments/charity/community-activities/page.tsx'),
    Path('src/app/departments/charity/distributions/page.tsx'),
    Path('src/app/departments/charity/home-visits/page.tsx'),
    Path('src/app/departments/charity/survey/page.tsx'),
    Path('src/app/departments/education/office-training/page.tsx'),
    Path('src/app/departments/education/pre-school-monitoring/page.tsx'),
    Path('src/app/departments/education/scholarship-students/page.tsx'),
    Path('src/app/departments/education/teaching-activities/page.tsx'),
]
changed = []
for path in files:
    text = path.read_text(encoding='utf-8')
    new = text
    new = re.sub(r"import \{[^}]*next-auth/react[^}]*\} from ['\"][^'\"]+['\"];\r?\n", '', new)
    new = re.sub(r"const token\s*=\s*typeof window !== 'undefined' \? localStorage\.getItem\([^\)]*\) : null;\r?\n", '', new)
    new = re.sub(r"const token\s*=\s*localStorage\.getItem\([^\)]*\);\r?\n", '', new)
    new = re.sub(r"if \(!token\) return;\r?\n", '', new)
    new = re.sub(r"if \(!session\) \{[^}]*router\.push\('/login'\);[^}]*\}\r?\n", '', new)
    new = new.replace("router.push('/login');", '')
    new = re.sub(r"headers\s*:\s*\{[^{]*['\"]Content-Type['\"]\s*:\s*'application/json'[^}]*['\"]Authorization['\"]\s*:\s*`Bearer \${token}`[^}]*\}\s*,?", "headers: { 'Content-Type': 'application/json' },", new)
    new = re.sub(r"headers\s*:\s*\{[^{]*['\"]Authorization['\"]\s*:\s*`Bearer \${token}`[^}]*\}\s*,?", '', new)
    new = new.replace('\\r', '')
    new = re.sub(r"\n{3,}", "\n\n", new)
    if new != text:
        path.write_text(new, encoding='utf-8')
        changed.append(str(path))
print('modified', len(changed), 'files')
for p in changed:
    print(p)
