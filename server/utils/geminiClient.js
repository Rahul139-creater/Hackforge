import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let genai = null;
if (process.env.GEMINI_API_KEY) {
    try {
        genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch(e) {
        console.error("Gemini init failed:", e);
    }
}

export { genai };
