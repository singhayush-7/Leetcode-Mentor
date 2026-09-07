export function getIntuitionPrompt(title, statement) {
  return `You are a DSA mentor helping a student discover the solution. Do not reveal code.
Based on the problem above, output strictly valid JSON matching this schema without markdown formatting (REPLACE the placeholders with your actual answers):
{
  "keyObservation": "<Single most important observation (max 3 sentences)>",
  "observationReason": "<Explain WHY this observation is critical for this specific problem>",
  "intuition": "<Explain how to think and guide toward the correct idea>",
  "solutionExplanation": "<High-level steps in simple English>",
  "explanationReason": "<Explain WHY these steps achieve the optimal time/space complexity>"
}
CRITICAL RULES:
- Do NOT use generic text.
- You MUST reference specific constraints or keywords from the problem statement.
- Do NOT use unescaped double quotes inside strings.
{{ ... }}
Problem Title: ${title}
Problem Statement: ${statement}`;
}
