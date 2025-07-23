#!/usr/bin/env python3
import os, sys, json, time, PyPDF2, requests

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_KEY', '')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        # Try to read as text file
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        except:
            with open(file_path, 'r', encoding='latin-1') as file:
                text = file.read()
    
    return text.strip()

def call_gemini_api(prompt, text):
    """Call Gemini API using HTTP requests"""
    headers = {
        'Content-Type': 'application/json',
    }
    
    data = {
        'contents': [{
            'parts': [{
                'text': f"You are a legal contract analysis assistant. Analyze this contract and answer the following question:\n\nQuestion: {prompt}\n\nContract Text:\n{text[:10000]}"  # Limit text to 10k chars
            }]
        }],
        'generationConfig': {
            'temperature': 0.7,
            'topK': 1,
            'topP': 1,
            'maxOutputTokens': 2048,
        }
    }
    
    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if 'candidates' in result and len(result['candidates']) > 0:
            content = result['candidates'][0].get('content', {})
            parts = content.get('parts', [])
            if parts and 'text' in parts[0]:
                return parts[0]['text']
        
        return "I couldn't generate a response. Please try again."
        
    except requests.exceptions.Timeout:
        return "The request timed out. Please try again."
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if response and hasattr(response, 'text'):
            error_msg += f"\nResponse: {response.text[:500]}"
        return f"Error calling Gemini API: {error_msg}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python analyze_contract.py <pdf_path> [user_prompt]"}))
        sys.exit(1)
    
    if not GEMINI_API_KEY:
        print(json.dumps({"error": "GEMINI_KEY environment variable not set"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    user_prompt = sys.argv[2] if len(sys.argv) > 2 else "Provide a comprehensive analysis of this contract, including key terms, parties involved, obligations, and any notable risks or considerations."
    
    try:
        # Extract text from file
        text = extract_text_from_pdf(file_path)
        
        if not text:
            print(json.dumps({"error": "Could not extract text from file"}))
            sys.exit(1)
        
        # Call Gemini API
        analysis = call_gemini_api(user_prompt, text)
        
        # Return JSON response
        result = {
            "analysis": analysis,
            "prompt": user_prompt,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "text_length": len(text),
            "model": "gemini-1.5-flash"
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Failed to analyze document: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()