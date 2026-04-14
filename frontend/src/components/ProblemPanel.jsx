import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, BookOpen, Tag, CheckCircle, Code2,
  ChevronDown, ChevronUp, Lightbulb, Info, BarChart2
} from 'lucide-react'

const DIFF_COLORS = {
  Easy:   { badge: 'badge-pass', dot: 'bg-accent-green' },
  Medium: { badge: 'bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/25', dot: 'bg-accent-yellow' },
  Hard:   { badge: 'badge-fail', dot: 'bg-accent-red' },
}

export default function ProblemPanel({ problem, onCollapse }) {
  const [examplesOpen, setExamplesOpen] = useState(true)
  const [constraintsOpen, setConstraintsOpen] = useState(false)

  if (!problem) return null
  const diff = DIFF_COLORS[problem.difficulty] || DIFF_COLORS.Easy

  return (
    <div className="h-full flex flex-col bg-surface-800/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-brand-400" />
          <span className="text-sm font-semibold text-white">Problem</span>
        </div>
        <button
          onClick={onCollapse}
          className="w-7 h-7 rounded-lg hover:bg-surface-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-5">
        {/* Title & Meta */}
        <div>
          <h2 className="text-lg font-bold text-white mb-2 leading-tight">{problem.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge border text-xs ${diff.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${diff.dot}`} />
              {problem.difficulty}
            </span>
            {problem.tags?.map(tag => (
              <span key={tag} className="badge bg-surface-700/60 border border-white/5 text-slate-400">
                <Tag size={9} className="mr-1" />{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={12} className="text-brand-400" />
            <span className="section-label">Description</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {problem.description}
          </p>
        </div>

        {/* Examples */}
        <div>
          <button
            onClick={() => setExamplesOpen(o => !o)}
            className="flex items-center justify-between w-full mb-2 group"
          >
            <div className="flex items-center gap-1.5">
              <Code2 size={12} className="text-accent-green" />
              <span className="section-label group-hover:text-slate-300 transition-colors">
                Examples ({problem.examples?.length})
              </span>
            </div>
            {examplesOpen ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
          </button>

          <AnimatePresence>
            {examplesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden space-y-3"
              >
                {problem.examples?.map((ex, i) => (
                  <div key={i} className="bg-surface-900/60 rounded-xl border border-white/5 overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-white/5 bg-surface-800/40">
                      <span className="text-xs text-slate-500 font-mono">Example {i + 1}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div>
                        <span className="text-xs text-slate-500 font-mono">Input: </span>
                        <code className="text-xs text-brand-300 font-mono whitespace-pre">{ex.input}</code>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-mono">Output: </span>
                        <code className="text-xs text-accent-green font-mono">{ex.output}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Constraints */}
        {problem.constraints?.length > 0 && (
          <div>
            <button
              onClick={() => setConstraintsOpen(o => !o)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <div className="flex items-center gap-1.5">
                <BarChart2 size={12} className="text-accent-yellow" />
                <span className="section-label group-hover:text-slate-300 transition-colors">
                  Constraints
                </span>
              </div>
              {constraintsOpen ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
            </button>

            <AnimatePresence>
              {constraintsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 bg-surface-900/40 rounded-xl border border-white/5 p-3">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-mono">
                        <span className="text-accent-yellow mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Test Cases Preview */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle size={12} className="text-accent-purple" />
            <span className="section-label">Test Cases ({problem.testCases?.length})</span>
          </div>
          <div className="space-y-2">
            {problem.testCases?.slice(0, 2).map((tc, i) => (
              <div key={tc.id} className="bg-surface-900/40 rounded-lg border border-white/5 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{tc.label}</span>
                  <span className="text-xs text-brand-400 font-mono">#{tc.id}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 truncate">
                  in: <span className="text-slate-400">{tc.input.replace(/\n/g, '↵')}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 truncate">
                  out: <span className="text-accent-green">{tc.expectedOutput}</span>
                </div>
              </div>
            ))}
            {problem.testCases?.length > 2 && (
              <p className="text-xs text-slate-600 text-center py-1">
                +{problem.testCases.length - 2} more hidden test cases
              </p>
            )}
          </div>
        </div>

        {/* Hint pill */}
        <div className="bg-accent-purple/8 border border-accent-purple/15 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Lightbulb size={13} className="text-accent-purple flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Stuck? Use the <span className="text-accent-purple font-semibold">AI Mentor</span> tab
              for hints — it guides you without giving away the solution.
            </p>
          </div>
        </div>

        <div className="pb-4" />
      </div>
    </div>
  )
}