import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let genai = null;
if (process.env.GEMINI_API_KEY) {
    try {
        genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch(e) {}
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Helper to map languages to Piston API format
const PISTON_LANGUAGE_MAP = {
    java: { language: 'java', version: '15.0.2' },       // Or any valid piston version
    python: { language: 'python', version: '3.10.0' },
    javascript: { language: 'javascript', version: '16.3.0' }, // node
};

// POST /api/run-code
app.post('/api/run-code', async (req, res) => {
    try {
        const { code, language, input } = req.body;
        
        const pistonLang = PISTON_LANGUAGE_MAP[language];
        if (!pistonLang) {
            return res.status(400).json({ error: 'Unsupported language' });
        }

        const payload = {
            language: pistonLang.language,
            version: pistonLang.version,
            files: [
                {
                    content: code
                }
            ],
            stdin: input || "",
            args: [],
            compile_timeout: 10000,
            run_timeout: 3000,
            compile_memory_limit: -1,
            run_memory_limit: -1
        };

        const response = await axios.post('https://emkc.org/api/v2/piston/execute', payload);
        const result = response.data;

        if (result.compile && result.compile.code !== 0) {
            return res.json({
                success: false,
                output: '',
                error: result.compile.output,
                stderr: result.compile.stderr || result.compile.output
            });
        }

        // Piston run success check
        const isSuccess = result.run.code === 0;

        return res.json({
            success: isSuccess,
            output: result.run.output || '',
            error: isSuccess ? '' : result.run.output,
            stderr: result.run.stderr || ''
        });

    } catch (error) {
        console.error('Run code error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to execute code' });
    }
});

// POST /api/grade-code
app.post('/api/grade-code', async (req, res) => {
    try {
        const { code, language, problemId, testCases } = req.body;
        
        const pistonLang = PISTON_LANGUAGE_MAP[language];
        if (!pistonLang) {
            return res.status(400).json({ error: 'Unsupported language' });
        }

        let passed = 0;
        const results = [];

        for (const testCase of testCases) {
            const payload = {
                language: pistonLang.language,
                version: pistonLang.version,
                files: [{ content: code }],
                stdin: testCase.input || "",
            };

            const response = await axios.post('https://emkc.org/api/v2/piston/execute', payload);
            const result = response.data;
            
            let output = '';
            if (result.compile && result.compile.code !== 0) {
                output = result.compile.output;
            } else {
                output = result.run.output;
            }

            const cleanOutput = (output || '').trim();
            const cleanExpected = (testCase.expectedOutput || '').trim();
            const isPassed = cleanOutput === cleanExpected;

            if (isPassed) passed++;

            results.push({
                testCaseId: testCase.id,
                passed: isPassed,
                output: cleanOutput,
                expected: cleanExpected,
            });
        }

        const correctnessScore = Math.round((passed / testCases.length) * 50);
        let qualityScore = Math.round((passed / testCases.length) * 25);
        let efficiencyScore = Math.round((passed / testCases.length) * 25);
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
                console.error("AI Grading Error", aiErr);
                aiFeedback = "AI grading encountered a parsing issue. Used correct output baseline scores.";
            }
        }

        const totalScore = correctnessScore + qualityScore + efficiencyScore;

        res.json({
            totalScore,
            testResults: results,
            rubric: {
                correctness: correctnessScore,
                quality: qualityScore,
                efficiency: efficiencyScore
            },
            feedback: aiFeedback,
            passed,
            total: testCases.length
        });

    } catch (error) {
        console.error('Grade code error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to grade code' });
    }
});

// POST /api/analyze-code
app.post('/api/analyze-code', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
