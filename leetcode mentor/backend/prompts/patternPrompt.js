export function getPatternPrompt(title, statement) {
  return `You are an expert DSA mentor. Read the problem and classify it.
Problem Title: ${title}
Problem Statement: ${statement}
Based on the problem above, output strictly valid JSON matching this schema without markdown formatting (REPLACE the placeholders with your actual answers):
{
  "pattern": "<Identify the DSA pattern here, e.g., Two Pointers, Dynamic Programming, Graph, etc.>",
  "patternReason": "<Explain WHY based on the specific constraints or keywords in the statement>",
  "difficulty": "<Easy, Medium, or Hard>",
  "expectedComplexity": "<e.g., O(n)>",
  "complexityReason": "<Explain WHY this complexity is expected (cite input sizes like N <= 10^5)>",
  "prerequisites": ["<Concept 1>", "<Concept 2>"]
}
CRITICAL RULES:
- Do NOT use generic text.
- You MUST reference specific constraints, keywords, or variable limits from the problem statement to justify your reasoning.
- Do NOT use unescaped double quotes inside strings.
- Ensure the JSON is strictly valid, with no missing commas between properties.`;
}
