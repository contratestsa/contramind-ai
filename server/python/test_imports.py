#!/usr/bin/env python3

import sys
print("Python version:", sys.version)

print("\nTesting basic imports...")
try:
    import PyPDF2
    print("✓ PyPDF2 imported successfully")
except Exception as e:
    print(f"✗ PyPDF2 import failed: {e}")

try:
    import grpc
    print("✓ grpc imported successfully")
except Exception as e:
    print(f"✗ grpc import failed: {e}")

print("\nTesting Google Generative AI import...")
try:
    import google.generativeai as genai
    print("✓ google.generativeai imported successfully")
    print(f"  Version: {genai.__version__ if hasattr(genai, '__version__') else 'Unknown'}")
except Exception as e:
    print(f"✗ google.generativeai import failed: {e}")
    import traceback
    traceback.print_exc()

print("\nChecking environment variables...")
import os
print(f"GEMINI_KEY exists: {'GEMINI_KEY' in os.environ}")
print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")