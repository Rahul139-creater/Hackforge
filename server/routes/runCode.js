import express from 'express';
import { executeCodeGlobally } from '../utils/executor.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { code, language, input } = req.body;
        const result = await executeCodeGlobally(code, language, input);
        res.json(result);
    } catch (error) {
        console.error('Run code error:', error.message);
        res.status(500).json({ error: 'Failed to execute code' });
    }
});

export default router;
