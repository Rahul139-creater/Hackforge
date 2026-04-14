import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import runCodeRouter from './routes/runCode.js';
import gradeCodeRouter from './routes/gradeCode.js';
import analyzeCodeRouter from './routes/analyzeCode.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/run-code', runCodeRouter);
app.use('/api/grade-code', gradeCodeRouter);
app.use('/api/analyze-code', analyzeCodeRouter);

app.listen(PORT, () => {
    console.log(`Modular Backend server running on http://localhost:${PORT}`);
});
