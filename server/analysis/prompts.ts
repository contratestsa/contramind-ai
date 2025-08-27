export const PROMPTS = {
  LARGE_PROMPT: `
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

  PRovide a qualitative assessment of each identified risk by rating it across the following dimensions: Likelihood and Impact.
  – Rate the potential impact of the risk on a scale from 1 to 5
  – Rate the likelihood of the risk occurring on a scale from 1 to 5, where: Risk Type
  – Indicate whether the risk is: Recommended Risk Response Strategy
  – Based on PMI-RMP guidelines: For negative risks (threats), suggest the most suitable strategy: Avoid, Mitigate, Transfer, or Accept For positive risks (opportunities), suggest the most suitable strategy: Exploit, Enhance, Share, or Accept Negative (a threat) Positive (an opportunity) 5 = Most likely to occur 1 = Least likely to occur 5 = Highest impact 1 = Lowest impact Please create a risk chart with the following specifications: Plot Probability on the X-axis and Impact on the Y-axis. Each point on the chart should represent an individual risk. Use the notation R1, R2, R3, … to label each risk sequentially.

  Provide a qualitative assessment of each identified risk by rating it across the following dimensions:
  Impact – Rate the potential impact of the risk on a scale from 1 to 5, where:
  5 = Highest impact
  1 = Lowest impact
  Probability – Rate the likelihood of the risk occurring on a scale from 1 to 5, where:
  5 = Most likely to occur
  1 = Least likely to occur

  Risk Type – Indicate whether the risk is:
  Negative (a threat)
  Positive (an opportunity)

  Recommended Risk Response Strategy – Based on PMI-RMP guidelines:
  For negative risks (threats), suggest the most suitable strategy: Avoid, Mitigate, Transfer, or Accept
  For positive risks (opportunities), suggest the most suitable strategy: Exploit, Enhance, Share, or Accept

  Create a risk chart with the following specifications:
  Plot Probability on the X-axis and Impact on the Y-axis.
  Each point on the chart should represent an individual risk.
  Use the notation R1, R2, R3, ... to label each risk sequentially.`,
} as const;
