import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Run code
export const runCode = async ({ code, language, input }) => {
  const { data } = await api.post('/run-code', { code, language, input })
  return data
}

// Auto-grade code
export const gradeCode = async ({ code, language, problemId, testCases }) => {
  const { data } = await api.post('/grade-code', { code, language, problemId, testCases })
  return data
}

// Get AI mentor hints
export const analyzeCode = async ({ code, language, problemTitle, problemDescription, errorOutput, userQuestion }) => {
  const { data } = await api.post('/analyze-code', {
    code, language, problemTitle, problemDescription, errorOutput, userQuestion
  })
  return data
}