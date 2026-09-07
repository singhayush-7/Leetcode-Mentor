function cleanResponse(raw) {
  if (!raw) return "";
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/\r/g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();
}

function extractObject(raw) {
  let startIndex = -1;
  let braceCount = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "{") {
      if (braceCount === 0) {
        startIndex = i;
      }
      braceCount++;
    } else if (raw[i] === "}") {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        return raw.slice(startIndex, i + 1);
      }
    }
  }
  return null;
}

function repairJson(json) {
  return json
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/[\u0000-\u0019]+/g, " ") 
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function parseModelResponse(raw, promptName = "Unknown") {
  try {
    const cleaned = cleanResponse(raw);
    const extracted = extractObject(cleaned);
    if (!extracted) {
      console.log(`\n===== RAW RESPONSE (${promptName}) =====`);
      console.log(cleaned);
      console.log("========================");
      throw new Error(`No JSON object found for ${promptName}.`);
    }
    try {
      return JSON.parse(extracted);
    } catch (parseErr) {
      const repaired = repairJson(extracted);
      return JSON.parse(repaired);
    }
  } catch (err) {
    console.log(`\nJSON Parse Error in ${promptName}`);
    console.log(err.message);
    return null;
  }
}
