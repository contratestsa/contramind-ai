# server/python/analyze_pdf.py
import os, sys, json, time, PyPDF2, google.generativeai as genai
from google.generativeai.types import GenerationConfig

# ─────────────────────────────────────────────────────────────
# Check Input Arguments
# ─────────────────────────────────────────────────────────────
if len(sys.argv) < 2:
    print("Usage: python analyze_pdf.py <PDF_PATH>", file=sys.stderr)
    sys.exit(1)

PDF_PATH = sys.argv[1]

# ─────────────────────────────────────────────────────────────
# Set Gemini API Key
# ─────────────────────────────────────────────────────────────
api_key = os.getenv("GEMINI_KEY")
if not api_key:
    raise ValueError("Env var GEMINI_KEY missing")
genai.configure(api_key=api_key)

# ─────────────────────────────────────────────────────────────
# ContraMind role system prompt
# ─────────────────────────────────────────────────────────────
ROLE_SYSTEM = (
    "You are legal counsel for the SERVICE RECIPIENT reviewing a technology "
    "services contract under KSA (Kingdom of Saudi Arabia) law. "
    "Provide concise, actionable guidance aligned with Sharia principles."
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
# ─────────────────────────────────────────────────────────────
def extract_pdf_text(path):
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        return "\n".join(p.extract_text() or "" for p in reader.pages)

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
# ─────────────────────────────────────────────────────────────
content = f"""{PROMPT_LONG}

===== CONTENIDO DEL PDF ({len(pdf_text)} caracteres) =====
{pdf_text}
"""

# ─────────────────────────────────────────────────────────────
# Generate Response in Streaming Mode
# ─────────────────────────────────────────────────────────────
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


output_text, start = "", time.time()
for chunk in stream:
    if chunk.text:
        print(chunk.text, end="", flush=True)
        output_text += chunk.text

# ─────────────────────────────────────────────────────────────
# Final Statistics *** TO BE DELETED 
# ─────────────────────────────────────────────────────────────
stats = {
    "prompt_tokens": prompt_tokens,
    "pdf_tokens": pdf_tokens,
    "output_tokens": count_tokens(output_text),
    "duration_sec": round(time.time() - start, 1)
}
print("\n\n" + json.dumps(stats))
