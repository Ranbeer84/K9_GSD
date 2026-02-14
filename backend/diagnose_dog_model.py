#!/usr/bin/env python3
"""
Diagnostic script to check models/dog.py
"""

import sys
import os

print("🔍 Diagnosing models/dog.py...")
print("="*60)

# Check if file exists
dog_model_path = "models/dog.py"
if not os.path.exists(dog_model_path):
    print(f"❌ ERROR: {dog_model_path} does not exist!")
    sys.exit(1)

print(f"✅ File exists: {dog_model_path}")

# Read and display file content
print("\n📄 File contents:")
print("="*60)
with open(dog_model_path, 'r') as f:
    content = f.read()
    print(content)

print("="*60)

# Try to parse for syntax errors
print("\n🔍 Checking for syntax errors...")
try:
    compile(content, dog_model_path, 'exec')
    print("✅ No syntax errors found")
except SyntaxError as e:
    print(f"❌ SYNTAX ERROR: {e}")
    print(f"   Line {e.lineno}: {e.text}")
    sys.exit(1)

# Check for class definitions
print("\n🔍 Looking for class definitions...")
if "class Dog(" in content:
    print("✅ Found 'class Dog' definition")
else:
    print("❌ ERROR: 'class Dog' not found in file!")

if "class DogImage(" in content:
    print("✅ Found 'class DogImage' definition")
else:
    print("⚠️  WARNING: 'class DogImage' not found in file!")

# Check imports
print("\n🔍 Checking imports...")
if "from database import db" in content or "from .. database import db" in content:
    print("✅ Found database import")
else:
    print("❌ ERROR: Missing 'from database import db'")

if "from datetime import datetime" in content:
    print("✅ Found datetime import")
else:
    print("⚠️  WARNING: Missing datetime import")

print("\n" + "="*60)
print("💡 Next Steps:")
print("   1. Check the output above for errors")
print("   2. If syntax errors exist, fix them")
print("   3. If class Dog is missing, the file might be corrupted")
print("="*60)