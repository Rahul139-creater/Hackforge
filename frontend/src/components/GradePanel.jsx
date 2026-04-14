import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, CheckCircle, XCircle, Play, Loader2, 
  BarChart3, Clock, Code2, TrendingUp, AlertTriangle,
  Star, Zap
} from 'lucide-react'

const ScoreCircle = ({ score }) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#22d3a0' : score >= 50 ? '#fbbf24' : '#f43f5e'

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#1c2842" strokeWidth="8" />
        <motion.circle
          cx="56" cy="56" r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-2xl font-extrabold"
          style={{ color }}
        >
          {score}
        </motion.div>
        <div className="text-xs text-slate-500 font-mono">/100</div>
      </div>
    </div>
  )
}

const RubricBar = ({ label, score, maxScore, delay = 0 }) => {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  const color = pct >= 75 ? 'bg-accent-green' : pct >= 50 ? 'bg-accent-yellow' : 'bg-accent-red'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-slate-300">{score}/{maxScore}</span>
      </div>
      <div className="h-1.5 bg-surface-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export default function GradePanel({ result, isGrading, onGrade }) {
  if (isGrading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
          <Loader2 size={26} className="text-accent-green animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-300 font-semibold">Running test cases...</p>
          <p className="text-slate-500 text-sm">Evaluating correctness, efficiency & quality</p>
          <div className="loading-dots flex items-center justify-center gap-1.5 mt-2">
            <span className="w-2 h-2 bg-accent-green rounded-full inline-block" />
            <span className="w-2 h-2 bg-accent-green rounded-full inline-block" />
            <span className="w-2 h-2 bg-accent-green rounded-full inline-block" />
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-700/50 flex items-center justify-center mb-2">
          <Trophy size={26} className="text-slate-500" />
        </div>
        <p className="text-slate-300 font-semibold">Auto-Grader Ready</p>
        <p className="text-slate-500 text-sm max-w-xs">
          Grade your solution on correctness, efficiency, and code quality.
        </p>
        <button onClick={onGrade} className="btn-secondary mt-2 text-sm">
          <BarChart3 size={14} />
          Grade My Code
        </button>
      </div>
    )
  }

  const { totalScore, testResults, rubric, feedback, passed, total } = result

  return (
    <div className="h-full overflow-auto p-4 space-y-5">
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 flex items-center gap-5"
      >
        <ScoreCircle score={totalScore} />
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg mb-1">
            {totalScore === 100 ? '🏆 Perfect!' : totalScore >= 75 ? '✅ Great Job' : totalScore >= 50 ? '💪 Keep Going' : '❌ Needs Work'}
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            {passed}/{total} test cases passed
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-surface-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(passed / total) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-500 to-accent-green rounded-full"
              />
            </div>
            <span className="text-xs font-mono text-slate-400 flex-shrink-0">
              {Math.round((passed / total) * 100)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Rubric breakdown */}
      {rubric && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-brand-400" />
            <span className="text-sm font-semibold text-white">Score Breakdown</span>
          </div>
          <RubricBar label="Correctness" score={rubric.correctness} maxScore={50} delay={0.2} />
          <RubricBar label="Code Quality" score={rubric.quality} maxScore={25} delay={0.3} />
          <RubricBar label="Efficiency" score={rubric.efficiency} maxScore={25} delay={0.4} />
        </motion.div>
      )}

      {/* Test cases */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Code2 size={14} className="text-brand-400" />
            <span className="text-sm font-semibold text-white">Test Cases</span>
            <span className="ml-auto text-xs font-mono text-slate-500">{passed}/{total} passed</span>
          </div>
          <div className="divide-y divide-white/5">
            {testResults.map((tc, i) => (
              <motion.div
                key={tc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="px-4 py-3 test-row"
              >
                <div className="flex items-center gap-3">
                  {tc.passed
                    ? <CheckCircle size={15} className="text-accent-green flex-shrink-0" />
                    : <XCircle size={15} className="text-accent-red flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-200 font-medium truncate">
                        {tc.label || `Test ${tc.id}`}
                      </span>
                      {tc.executionTime && (
                        <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                          <Clock size={10} /> {tc.executionTime}ms
                        </span>
                      )}
                    </div>
                    {!tc.passed && (
                      <div className="mt-1.5 space-y-1">
                        <div className="text-xs font-mono flex gap-2">
                          <span className="text-slate-500">Expected:</span>
                          <span className="text-accent-green">{tc.expected}</span>
                        </div>
                        <div className="text-xs font-mono flex gap-2">
                          <span className="text-slate-500">Got:</span>
                          <span className="text-accent-red">{tc.actual || 'No output'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`badge border flex-shrink-0 ${tc.passed ? 'badge-pass' : 'badge-fail'}`}>
                    {tc.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-accent-yellow" />
            <span className="text-sm font-semibold text-white">Grader Feedback</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{feedback}</p>
        </motion.div>
      )}

      <div className="pb-2" />
    </div>
  )
}