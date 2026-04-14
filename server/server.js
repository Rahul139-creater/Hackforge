import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import runCodeRouter from './routes/runCode.js';
import gradeCodeRouter from './routes/gradeCode.js';
import analyzeCodeRouter from './routes/analyzeCode.js';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackforge')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

app.use('/api/run-code', runCodeRouter);
app.use('/api/grade-code', gradeCodeRouter);
app.use('/api/analyze-code', analyzeCodeRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Modular Backend server running on http://localhost:${PORT}`);
});
