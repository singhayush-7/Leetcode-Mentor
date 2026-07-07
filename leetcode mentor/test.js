import ollama from "ollama";

const response = await ollama.chat({
  model: "qwen2.5:1.5b",
  messages: [
    {
      role: "user",
      content: `

You are an expert DSA mentor.

Analyze the following DSA problem.

Return ONLY in this format:

Pattern:
<pattern>

Key Observation:
<observation>

Expected Time Complexity:
<complexity>

Hint 1:
<hint>

Hint 2:
<hint>

Problem:

Two Sum

Given an array nums and a target,
return indices of two numbers that add up to target.
`
    }
  ]
});

console.log(response.message.content);