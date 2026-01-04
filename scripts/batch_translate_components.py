#!/usr/bin/env python3
"""
批量为组件添加翻译支持
"""

import os
import re

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def add_translation_import(content):
    """Add useLanguage import if not present"""
    if 'useLanguage' in content:
        return content
    
    # Find the last import statement
    import_pattern = r"(import .+ from '[^']+';?\n)"
    imports = list(re.finditer(import_pattern, content))
    
    if imports:
        last_import = imports[-1]
        insert_pos = last_import.end()
        new_import = "import { useLanguage } from '@/contexts/LanguageContext';\n"
        content = content[:insert_pos] + new_import + content[insert_pos:]
    
    return content

def add_translation_hook(content):
    """Add useLanguage hook in component if not present"""
    if "const { t } = useLanguage();" in content:
        return content
    
    # Find the component function and add hook after first line
    # Look for patterns like: const ComponentName: React.FC = () => {
    # or: const ComponentName = () => {
    # or: function ComponentName() {
    
    patterns = [
        r'(const \w+:\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*\{)',
        r'(const \w+\s*=\s*\([^)]*\)\s*=>\s*\{)',
        r'(function \w+\([^)]*\)\s*\{)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            insert_pos = match.end()
            hook = "\n  const { t } = useLanguage();"
            content = content[:insert_pos] + hook + content[insert_pos:]
            break
    
    return content

def process_component(filepath):
    """Process a single component file"""
    content = read_file(filepath)
    
    # Skip if already has useLanguage
    if 'useLanguage' in content:
        print(f"Skipped (already has i18n): {filepath}")
        return False
    
    # Add import
    content = add_translation_import(content)
    
    # Add hook
    content = add_translation_hook(content)
    
    write_file(filepath, content)
    print(f"Updated: {filepath}")
    return True

def main():
    components_dir = '/home/ubuntu/follow-ai-source/follow.ai/src/components'
    
    # Get all tsx files
    files = [f for f in os.listdir(components_dir) if f.endswith('.tsx')]
    
    updated = 0
    skipped = 0
    
    for filename in sorted(files):
        filepath = os.path.join(components_dir, filename)
        if process_component(filepath):
            updated += 1
        else:
            skipped += 1
    
    print(f"\nSummary: {updated} updated, {skipped} skipped")

if __name__ == '__main__':
    main()
