#!/usr/bin/env python3
import sys
import PyPDF2
import os
import pdfplumber
import pytesseract
from PIL import Image
import pdf2image
import io

def extract_pdf_text(pdf_path):
    """Extract text from PDF file using multiple methods"""
    text = ""
    
    # Method 1: Try pdfplumber first (best for most PDFs)
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if text.strip():
            print(f"Extracted {len(text)} characters using pdfplumber", file=sys.stderr)
            return text.strip()
    except Exception as e:
        print(f"pdfplumber failed: {str(e)}", file=sys.stderr)
    
    # Method 2: Try PyPDF2 if pdfplumber fails
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from all pages
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if text.strip():
            print(f"Extracted {len(text)} characters using PyPDF2", file=sys.stderr)
            return text.strip()
    except Exception as e:
        print(f"PyPDF2 failed: {str(e)}", file=sys.stderr)
    
    # Method 3: OCR as last resort for scanned PDFs
    try:
        print("Attempting OCR extraction...", file=sys.stderr)
        # Convert PDF to images
        images = pdf2image.convert_from_path(pdf_path, dpi=300)
        
        for i, image in enumerate(images):
            # Perform OCR on each page
            page_text = pytesseract.image_to_string(image, lang='eng+ara')
            if page_text:
                text += f"\n--- Page {i+1} ---\n{page_text}\n"
        
        if text.strip():
            print(f"Extracted {len(text)} characters using OCR", file=sys.stderr)
            return text.strip()
    except Exception as e:
        print(f"OCR failed: {str(e)}", file=sys.stderr)
    
    # If all methods fail, return empty string
    print("All extraction methods failed", file=sys.stderr)
    return ""

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_text.py <pdf_path>", file=sys.stderr)
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)
    
    # Extract and print text
    text = extract_pdf_text(pdf_path)
    print(text)