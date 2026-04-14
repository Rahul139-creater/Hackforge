import express from 'express';
import { genai } from '../utils/geminiClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { code, language, problemTitle, errorOutput, userQuestion } = req.body;
        
        if (genai) {
            const prompt = `You are an AI-powered coding practice assistant (mentor) for a student.
Analyze the following information:
Problem: ${problemTitle}
Language: ${language}
Code:
${code || "No code provided yet"}

User Question: ${userQuestion || "No specific question"}
Error Output: ${errorOutput || "None"}

Please provide step-by-step guidance. DO NOT give the direct final solution.
Detect any syntax errors, logical mistakes, or inefficient approaches in the code.
Structure your reply strictly using these headings:
- Issue: (Explain the bug, syntax error, or logical mistake detected)
- Hint: (Step-by-step hint to push them in the right direction without revealing the exact code)
- Suggestion: (Suggest an improvement for efficiency or better structure)
`;
            const response = await genai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return res.json({ result: response.text, success: true });
        }

        // Mock fallback simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
        let feedback = '';
        if (userQuestion) {
            feedback = `**Issue:** You requested help.\n\n**Hint:** In ${language}, break down the problem into smaller functions.\n\n**Suggestion:** Don't forget to check edge cases!\n\n*(Note: Add GEMINI_API_KEY to your .env to unlock real AI insight)*`;
        } else if (errorOutput) {
            feedback = `**Issue:** A runtime or syntax error was detected in your ${language} code.\n\n**Hint:** Review the error: \`${(errorOutput||"").substring(0, 40)}...\` Check for missing boundaries or typos.\n\n**Suggestion:** Use print statements to debug.\n\n*(Note: Add GEMINI_API_KEY to your .env to unlock real AI insight)*`;
        } else {
            feedback = `**Issue:** No explicit errors detected.\n\n**Hint:** For "${problemTitle}", is there a more efficient algorithm?\n\n**Suggestion:** Ensure your variables are named clearly.\n\n*(Note: Add GEMINI_API_KEY to your .env to unlock real AI insight)*`;
        }
        res.json({ result: feedback, success: true });

    } catch (error) {
        console.error('Analyze code error:', error.message);
        res.status(500).json({ error: 'Failed to analyze code' });
    }
});

export default router;
