import { genai } from './geminiClient.js';

export async function scoreWithRubric(code, language, passed, total) {
    const correctnessScore = Math.round((passed / total) * 50);
    let qualityScore = Math.round((passed / total) * 25);
    let efficiencyScore = Math.round((passed / total) * 25);
    let aiFeedback = "Code verified against test cases. (Enable GEMINI_API_KEY in .env for advanced AI readability & efficiency grading)";

    if (genai && code.trim()) {
        try {
            const prompt = `You are an AI-based smart code auto-grader.
The student has submitted the following ${language} code:
\`\`\`
${code}
\`\`\`
Evaluate this code based on:
1. Readability (naming, structure, clarity) - Score out of 25
2. Efficiency (time and space complexity) - Score out of 25

Return ONLY a valid JSON object matching this schema exactly:
{
  "readabilityScore": <number between 0 and 25>,
  "efficiencyScore": <number between 0 and 25>,
  "feedback": "<Actionable feedback explaining deductions for readability and efficiency>"
}
Do NOT wrap the response in markdown blocks like \`\`\`json. Return pure JSON.`;

            const response = await genai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiResult = JSON.parse(rawText);
            
            qualityScore = typeof aiResult.readabilityScore === 'number' ? aiResult.readabilityScore : qualityScore;
            efficiencyScore = typeof aiResult.efficiencyScore === 'number' ? aiResult.efficiencyScore : efficiencyScore;
            aiFeedback = aiResult.feedback || 'Evaluated successfully.';
        } catch (aiErr) {
            console.error("AI Rubric Error", aiErr);
            aiFeedback = "AI grading encountered a parsing issue. Used correct output baseline scores.";
        }
    }

    const totalScore = correctnessScore + qualityScore + efficiencyScore;

    return {
        totalScore,
        rubric: {
            correctness: correctnessScore,
            quality: qualityScore,
            efficiency: efficiencyScore
        },
        feedback: aiFeedback
    };
}
