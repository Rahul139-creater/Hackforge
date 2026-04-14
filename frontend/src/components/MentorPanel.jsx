import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Loader2, Lightbulb, Bug, TrendingUp,
  MessageSquare, Sparkles, AlertCircle, ChevronRight, Zap
} from 'lucide-react'

const HINT_QUESTIONS = [
  'What am I doing wrong?',
  'How can I improve efficiency?',
  'Give me a hint for this error',
  'Is my approach correct?',
]

const FeedbackCard = ({ icon: Icon, title, content, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`rounded-xl border p-4 hint-card ${color}`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon size={15} />
      <span className="text-sm font-semibold">{title}</span>
    </div>
    <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">{content}</p>
  </motion.div>
)

export default function MentorPanel({ result, isMentoring, question, onQuestionChange, onAskMentor, hasCode }) {
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMentoring && hasCode) {
      e.preventDefault()
      onAskMentor()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-surface-800/20 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-accent-purple/15 flex items-center justify-center">
          <Brain size={16} className="text-accent-purple" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Mentor</p>
          <p className="text-xs text-slate-500">Hints only — never solutions</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-1 rounded-lg">
          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
          Active
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Mentor philosophy notice */}
        {!result && !isMentoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-accent-purple/8 border border-accent-purple/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={15} className="text-accent-purple" />
                <span className="text-sm font-semibold text-accent-purple">How I Help</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {[
                  ['🔍', 'Identify what\'s wrong in your code'],
                  ['💡', 'Give hints to guide your thinking'],
                  ['📈', 'Suggest improvements — not solutions'],
                  ['🧠', 'Explain concepts behind errors'],
                ].map(([emoji, text]) => (
                  <li key={text} className="flex items-center gap-2">
                    <span>{emoji}</span> {text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="section-label mb-2.5">Quick Questions</p>
              <div className="space-y-2">
                {HINT_QUESTIONS.map(q => (
                  <motion.button
                    key={q}
                    whileHover={{ x: 4 }}
                    onClick={() => { onQuestionChange(q); inputRef.current?.focus() }}
                    className="w-full text-left flex items-center gap-3 bg-surface-800/50 hover:bg-surface-700/50 border border-white/5 hover:border-brand-500/20 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-all group"
                  >
                    <MessageSquare size={13} className="text-slate-600 group-hover:text-brand-400 flex-shrink-0" />
                    {q}
                    <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-brand-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isMentoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-8"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                <Brain size={28} className="text-accent-purple animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                <Loader2 size={12} className="text-white animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-slate-300 font-semibold">Analyzing your code...</p>
              <p className="text-slate-500 text-sm">Crafting hints, not solutions</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !isMentoring && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {result.issue && (
                <FeedbackCard
                  icon={Bug}
                  title="Issue Detected"
                  content={result.issue}
                  color="bg-accent-red/8 border-accent-red/15 text-accent-red"
                  delay={0}
                />
              )}
              {result.hint && (
                <FeedbackCard
                  icon={Lightbulb}
                  title="Hint"
                  content={result.hint}
                  color="bg-accent-yellow/8 border-accent-yellow/15 text-accent-yellow"
                  delay={0.1}
                />
              )}
              {result.suggestion && (
                <FeedbackCard
                  icon={TrendingUp}
                  title="Suggestion"
                  content={result.suggestion}
                  color="bg-accent-green/8 border-accent-green/15 text-accent-green"
                  delay={0.2}
                />
              )}
              {result.encouragement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-brand-500/8 border border-brand-500/15 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-brand-400" />
                    <span className="text-sm font-semibold text-brand-400">Mentor Note</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.encouragement}</p>
                </motion.div>
              )}
              {result.conceptExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-surface-700/40 border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-accent-purple" />
                    <span className="text-sm font-semibold text-slate-300">Concept</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.conceptExplanation}</p>
                </motion.div>
              )}

              {/* Quality check */}
              {result.codeQuality && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-surface-800/40 border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-accent-yellow" />
                    <span className="text-sm font-semibold text-slate-300">Code Quality</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(result.codeQuality).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 capitalize w-24">{key}</span>
                        <span className={`font-medium ${
                          val === 'Good' || val === 'Efficient' ? 'text-accent-green' :
                          val === 'Moderate' ? 'text-accent-yellow' : 'text-accent-red'
                        }`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-xs text-slate-600 px-1"
              >
                <AlertCircle size={11} />
                <span>Mentor provides guidance only — solutions come from you!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 p-4 flex-shrink-0 bg-surface-800/20">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={question}
            onChange={e => onQuestionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the mentor... (Enter to send)"
            className="flex-1 bg-surface-900/60 border border-white/5 rounded-xl px-3 py-2.5 text-sm font-sans text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-accent-purple/30 transition-colors"
            rows={2}
            disabled={!hasCode}
          />
          <button
            onClick={onAskMentor}
            disabled={isMentoring || !hasCode}
            className="w-11 h-auto bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/20 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isMentoring
              ? <Loader2 size={16} className="text-accent-purple animate-spin" />
              : <Send size={16} className="text-accent-purple" />
            }
          </button>
        </div>
        {!hasCode && (
          <p className="text-xs text-slate-600 mt-2">Write some code first to get hints</p>
        )}
      </div>
    </div>
  )
}