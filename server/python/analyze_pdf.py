# server/python/analyze_pdf.py
import os, sys, json, time, PyPDF2, google.generativeai as genai
from google.generativeai.types import GenerationConfig

# ─────────────────────────────────────────────────────────────
# Check Input Arguments
# Modified: Now accepts optional USER_PROMPT as second argument
# ─────────────────────────────────────────────────────────────
if len(sys.argv) < 2:
    print("Usage: python analyze_pdf.py <PDF_PATH> [USER_PROMPT]", file=sys.stderr)
    sys.exit(1)

PDF_PATH = sys.argv[1]
# New: Accept user's specific question/prompt if provided
USER_PROMPT = sys.argv[2] if len(sys.argv) > 2 else None

# ─────────────────────────────────────────────────────────────
# Set Gemini API Key
# Modified: Better error handling for missing API key
# ─────────────────────────────────────────────────────────────
api_key = os.getenv("GEMINI_KEY")
if not api_key:
    # Return error as JSON for frontend to handle gracefully
    error_response = {
        "success": False,
        "error": "GEMINI_KEY environment variable is missing",
        "message": "Please configure the Gemini API key to enable contract analysis"
    }
    print(json.dumps(error_response))
    sys.exit(1)

try:
    genai.configure(api_key=api_key)
except Exception as e:
    error_response = {
        "success": False,
        "error": f"Failed to configure Gemini API: {str(e)}",
        "message": "There was an error connecting to the AI service"
    }
    print(json.dumps(error_response))
    sys.exit(1)

# ─────────────────────────────────────────────────────────────
# ContraMind role system prompt
# Modified: Added flexibility for answering specific user questions
# ─────────────────────────────────────────────────────────────
ROLE_SYSTEM = (
    "You are ContraMind AI, an expert legal counsel specializing in technology "
    "services contracts under KSA (Kingdom of Saudi Arabia) law. "
    "Provide concise, actionable guidance aligned with Sharia principles. "
    "When answering user questions, focus on their specific concerns while "
    "maintaining a protective stance for the service recipient."
)

# ─────────────────────────────────────────────────────────────
# Long prompt for contract analysis
# ─────────────────────────────────────────────────────────────
PROMPT_LONG = """
Analyze with a recipient-protective lens:

PARTY VERIFICATION – Check provider's legal name (Arabic/English), CR number, address, signatory authority, and required licenses.
NOTICES – Ensure multiple delivery methods, correct recipient address, reasonable Arabic requirements, and favorable receipt timing.
GOVERNING LAW/DISPUTES – Confirm KSA law governs, assess SCCA arbitration vs courts, ensure Arabic prevails, review escalation procedures.
TERM/TERMINATION – Identify lock-ins, secure convenience-termination rights, verify reasonable cure periods, check auto-renewal compliance.
FORCE MAJEURE – Align with KSA/Sharia principles, enable payment suspension, include hardship provisions, confirm exit rights.
LIABILITY/INDEMNITY – Maximize provider liability within KSA limits, carve out gross negligence/willful misconduct, secure broad indemnification.
CONFIDENTIALITY – Push for mutual/provider-heavy obligations, limit recipient's confidential info, include injunctive relief, reasonable survival.
IP RIGHTS – Ensure ownership/licensing compliance, perpetual background licences, IP indemnity, open-source disclosure.
SUBCONTRACTING – Restrict without consent, enable affiliate assignment, valid change-of-control provisions, enforceable flow-downs.
SURVIVAL – Ensure protective clauses survive per KSA limitations, confirm governing law/disputes survive.

For each issue provide:
1. Risk to recipient under KSA law
2. Compliant contract language
3. Fallback positions
4. KSA red flags preventing signature

Then rate each identified risk:
• Impact (1-5) • Probability (1-5) • Risk type (Negative/Positive)
Recommend a PMI-RMP strategy (Avoid/Mitigate/Transfer/Accept or Exploit/Enhance/Share/Accept).

Finally, create a risk chart:
• X-axis = Probability • Y-axis = Impact
Label points R1, R2, R3, … sequentially.
"""

# ─────────────────────────────────────────────────────────────
# Extract PDF Text
# Modified: Added error handling for PDF extraction
# ─────────────────────────────────────────────────────────────
def extract_pdf_text(path):
    try:
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = "\n".join(p.extract_text() or "" for p in reader.pages)
            if not text.strip():
                raise ValueError("No text could be extracted from the PDF")
            return text
    except Exception as e:
        error_response = {
            "success": False,
            "error": f"Failed to extract PDF text: {str(e)}",
            "message": "Could not read the contract file. Please ensure it's a valid PDF."
        }
        print(json.dumps(error_response))
        sys.exit(1)

pdf_text = extract_pdf_text(PDF_PATH)

# ─────────────────────────────────────────────────────────────
# Optional: Count Tokens
# ─────────────────────────────────────────────────────────────
model_tmp = genai.GenerativeModel("gemini-2.5-pro")
count_tokens = lambda t: model_tmp.count_tokens(t).total_tokens
prompt_tokens = count_tokens(PROMPT_LONG)
pdf_tokens    = count_tokens(pdf_text)

# ─────────────────────────────────────────────────────────────
# Build Content
# Modified: Dynamic prompt based on user input or default analysis
# ─────────────────────────────────────────────────────────────
if USER_PROMPT:
    # User has a specific question - answer it in context of the contract
    content = f"""Please analyze the following contract and answer this specific question:

USER QUESTION: {USER_PROMPT}

When answering:
1. Focus specifically on the user's question
2. Provide clear, actionable advice
3. Reference specific sections of the contract when relevant
4. Consider KSA law and Sharia principles where applicable
5. Highlight any risks or concerns related to the question

===== CONTRACT TEXT ({len(pdf_text)} characters) =====
{pdf_text}
"""
else:
    # No specific question - perform full contract analysis
    content = f"""{PROMPT_LONG}

===== CONTRACT TEXT ({len(pdf_text)} characters) =====
{pdf_text}
"""

# ─────────────────────────────────────────────────────────────
# Generate Response in Streaming Mode
# Modified: Added try-catch for API errors
# ─────────────────────────────────────────────────────────────
try:
    model = genai.GenerativeModel(
        model_name="gemini-2.5-pro",
        system_instruction=ROLE_SYSTEM
    )

    gen_cfg = GenerationConfig(
        temperature=0.25,
        max_output_tokens=32000
    )

    stream = model.generate_content(
        content,
        generation_config=gen_cfg,
        stream=True,
        request_options={"timeout": 600}    # 10 min
    )

    # Modified: Collect response text instead of streaming to stdout
    output_text, start = "", time.time()
    for chunk in stream:
        if chunk.text:
            output_text += chunk.text
            
except Exception as e:
    # Handle Gemini API errors gracefully
    error_response = {
        "success": False,
        "error": f"Gemini API error: {str(e)}",
        "message": "Failed to analyze the contract. Please try again later."
    }
    print(json.dumps(error_response))
    sys.exit(1)

# ─────────────────────────────────────────────────────────────
# Return JSON Response
# Modified: Output JSON format for frontend integration
# ─────────────────────────────────────────────────────────────
response = {
    "success": True,
    "content": output_text.strip(),
    "timestamp": int(time.time() * 1000),  # milliseconds for JS compatibility
    "contractId": PDF_PATH,  # Include contract reference
    "userPrompt": USER_PROMPT,  # Include original question if provided
    "stats": {
        "prompt_tokens": prompt_tokens,
        "pdf_tokens": pdf_tokens,
        "output_tokens": count_tokens(output_text),
        "duration_sec": round(time.time() - start, 1)
    }
}

# Output JSON to stdout for the backend to capture
print(json.dumps(response, ensure_ascii=False, indent=2))
