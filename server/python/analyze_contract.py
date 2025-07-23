#!/usr/bin/env python3
import os, sys, json, time, PyPDF2, requests

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_KEY', '')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent'
CURRENT_MODEL = 'gemini-2.5-pro'  # Will be updated based on which model responds

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
    """Call Gemini API using HTTP requests with fallback"""
    headers = {
        'Content-Type': 'application/json',
    }
    
    # Define comprehensive system prompt
    ROLE_SYSTEM = """You are an expert legal contract analysis assistant specializing in commercial agreements. Your role is to provide thorough, accurate, and actionable analysis of contracts."""
    
    PROMPT_LONG = """As a legal contract analysis expert, you must:
    
    1. IDENTIFY AND ANALYZE:
       - All parties involved with their full legal names and roles
       - Type of agreement and its primary purpose
       - Key dates (effective date, term, renewal provisions)
       - Governing law and jurisdiction
       - Core obligations of each party
       
    2. EXAMINE CRITICAL CLAUSES:
       - Payment terms, amounts, and schedules
       - Termination conditions and notice periods
       - Liability limitations and indemnification
       - Intellectual property rights and ownership
       - Confidentiality and data protection provisions
       - Dispute resolution mechanisms
       
    3. ASSESS RISKS AND OPPORTUNITIES:
       - Potential legal risks for each party
       - Unfavorable or unusual terms
       - Missing standard provisions
       - Opportunities for negotiation
       - Compliance requirements
       
    4. PROVIDE PRACTICAL INSIGHTS:
       - Key action items and deadlines
       - Areas requiring clarification
       - Recommendations for risk mitigation
       - Strategic considerations for negotiation
       
    Always structure your response clearly with headings and bullet points for easy readability.
    Be specific and cite relevant clause numbers when referencing the contract.
    If critical information is missing or unclear, explicitly note this."""
    
    data = {
        'contents': [{
            'role': 'user',
            'parts': [{
                'text': f"{ROLE_SYSTEM}\n\n{PROMPT_LONG}\n\nUser Question: {prompt}\n\nContract Text:\n{text[:15000]}"  # Increased to 15k chars
            }]
        }],
        'generationConfig': {
            'temperature': 0.25,
            'topK': 1,
            'topP': 1,
            'maxOutputTokens': 4096,  # Increased for more comprehensive responses
        }
    }
    
    # Try Pro model first, then fallback to Flash
    models = [
        ('gemini-2.5-pro', 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent'),
        ('gemini-1.5-pro', 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent'),
        ('gemini-1.5-flash', 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent')
    ]
    
    for model_name, model_url in models:
        url = f"{model_url}?key={GEMINI_API_KEY}"
        
        try:
            # Use shorter timeout for 2.5 Pro as it may not be available yet
            timeout = 10 if model_name == 'gemini-2.5-pro' else 30
            response = requests.post(url, headers=headers, json=data, timeout=timeout)
            
            # If rate limited or model not found, try next model
            if response.status_code in [429, 404, 503]:
                continue
                
            response.raise_for_status()
            
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                content = result['candidates'][0].get('content', {})
                parts = content.get('parts', [])
                if parts and 'text' in parts[0]:
                    # Update global model name for response
                    global CURRENT_MODEL
                    CURRENT_MODEL = model_name
                    return parts[0]['text']
            
            return "I couldn't generate a response. Please try again."
            
        except requests.exceptions.Timeout:
            # If timeout, try next model instead of returning error
            if model_name != models[-1][0]:
                continue
            return "The request timed out. Please try again."
        except requests.exceptions.RequestException as e:
            if model_name == models[-1][0]:  # Last model in list
                error_msg = str(e)
                if 'response' in locals() and hasattr(response, 'text'):
                    error_msg += f"\nResponse: {response.text[:500]}"
                return f"Error calling Gemini API: {error_msg}"
            continue  # Try next model
        except Exception as e:
            if model_name == models[-1][0]:  # Last model in list
                return f"Unexpected error: {str(e)}"
            continue  # Try next model

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
            "model": CURRENT_MODEL
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Failed to analyze document: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()