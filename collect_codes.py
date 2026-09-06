import os
from pathlib import Path

def should_ignore(path, ignore_patterns=None):
    """Check if file/folder should be ignored"""
    if ignore_patterns is None:
        ignore_patterns = [
            '__pycache__', '.git', '.vscode', 'node_modules', 
            '.env', 'venv', '.pytest_cache', '.idea',
            '__MACOSX', '.DS_Store', 'dist', 'build',
            '.egg-info', '.ipynb_checkpoints'
        ]
    
    path_str = str(path)
    return any(pattern in path_str for pattern in ignore_patterns)

def get_file_extension_category(ext):
    """Categorize files by extension"""
    code_extensions = {
        '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.h',
        '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
        '.html', '.css', '.scss', '.sass', '.vue', '.sql', '.sh', '.bash',
        '.yaml', '.yml', '.json', '.xml', '.toml', '.ini', '.cfg', '.conf',
        '.md', '.txt', '.dockerfile', '.gitignore', '.env.example'
    }
    return ext.lower() in code_extensions

def collect_code_files(root_folder, output_file='collected_codes.txt', max_file_size_mb=1):
    """
    Collect all code files from a folder and write to output file
    
    Args:
        root_folder: Path to the codes folder
        output_file: Output file name
        max_file_size_mb: Skip files larger than this (in MB)
    """
    root_path = Path(root_folder)
    max_size_bytes = max_file_size_mb * 1024 * 1024
    
    if not root_path.exists():
        print(f"❌ Error: Folder '{root_folder}' does not exist!")
        return
    
    collected_files = []
    skipped_files = []
    
    print(f"🔍 Scanning folder: {root_path.absolute()}\n")
    
    # Walk through all files
    for file_path in root_path.rglob('*'):
        if file_path.is_file() and not should_ignore(file_path):
            ext = file_path.suffix
            
            if get_file_extension_category(ext):
                file_size = file_path.stat().st_size
                if file_size > max_size_bytes:
                    skipped_files.append((str(file_path.relative_to(root_path)), file_size))
                    continue
                
                try:
                    # Try to read as text
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    relative_path = file_path.relative_to(root_path)
                    collected_files.append((relative_path, content, ext))
                    print(f"✅ Collected: {relative_path}")
                    
                except (UnicodeDecodeError, PermissionError) as e:
                    print(f"⚠️  Skipped (read error): {file_path.relative_to(root_path)}")
                    skipped_files.append((str(file_path.relative_to(root_path)), "Read Error"))
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("=" * 80 + "\n")
        out.write(f"CODE COLLECTION FROM: {root_path.absolute()}\n")
        out.write(f"Total files collected: {len(collected_files)}\n")
        out.write(f"Generated: {Path(output_file).absolute()}\n")
        out.write("=" * 80 + "\n\n")
        
        # Sort files by path for better organization
        collected_files.sort(key=lambda x: str(x))
        
        for relative_path, content, ext in collected_files:
            out.write("\n" + "=" * 80 + "\n")
            out.write(f"FILE: {relative_path}\n")
            out.write("=" * 80 + "\n\n")
            out.write(content)
            out.write("\n\n")
    
    # Print summary
    print(f"\n{'=' * 60}")
    print(f"✨ COLLECTION COMPLETE!")
    print(f"{'=' * 60}")
    print(f"📁 Total files collected: {len(collected_files)}")
    print(f"📄 Output file: {Path(output_file).absolute()}")
    print(f"💾 File size: {Path(output_file).stat().st_size / 1024:.2f} KB")
    
    if skipped_files:
        print(f"\n⚠️  Skipped {len(skipped_files)} files:")
        for skipped, reason in skipped_files[:10]:  # Show first 10
            if isinstance(reason, int):
                print(f"   - {skipped} (Size: {reason / 1024:.2f} KB)")
            else:
                print(f"   - {skipped} ({reason})")
        if len(skipped_files) > 10:
            print(f"   ... and {len(skipped_files) - 10} more")
    
    print(f"\n💡 Open '{output_file}' and copy all content to Google Docs")
    print(f"{'=' * 60}\n")

if __name__ == "__main__":
    # Configuration
    CODES_FOLDER = ""  # Change this to your folder path
    OUTPUT_FILE = "collected_codes.txt"
    MAX_FILE_SIZE_MB = 1  # Skip files larger than 1MB
    
    collect_code_files(CODES_FOLDER, OUTPUT_FILE, MAX_FILE_SIZE_MB)
