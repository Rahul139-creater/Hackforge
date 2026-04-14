import express from 'express';
import { executeCodeGlobally } from '../utils/executor.js';
import { scoreWithRubric } from '../utils/rubricScorer.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { code, language, problemId, testCases } = req.body;
        
        let passed = 0;
        const testResults = [];

        for (const testCase of testCases) {
            const result = await executeCodeGlobally(code, language, testCase.input || "");
            
            const cleanOutput = (result.output || '').trim();
            const cleanExpected = (testCase.expectedOutput || '').trim();
            
            // Success is true if the output cleanly matches expected, and no stderr exists
            const isPassed = cleanOutput === cleanExpected && !result.error;

            if (isPassed) passed++;

            testResults.push({
                testCaseId: testCase.id,
                passed: isPassed,
                output: cleanOutput,
                expected: cleanExpected,
            });
        }

        const scoring = await scoreWithRubric(code, language, passed, testCases.length);

        res.json({
            ...scoring,
            testResults,
            passed,
            total: testCases.length
        });

    } catch (error) {
        console.error('Grade code error:', error.message);
        res.status(500).json({ error: 'Failed to grade code' });
    }
});

export default router;
