import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, CheckCircle, XCircle, Clock, Play, AlertTriangle, Zap } from 'lucide-react'

const LoadingDots = () => (
  <div className="loading-dots flex items-center gap-1.5">
    <span className="w-2 h-2 bg-brand-400 rounded-full inline-block" />
    <span className="w-2 h-2 bg-brand-400 rounded-full inline-block" />
    <span className="w-2 h-2 bg-brand-400 rounded-full inline-block" />
  </div>
)

export default function OutputPanel({ result, isRunning, input }) {
  if (isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Terminal size={20} className="text-brand-400 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-slate-300 font-medium mb-2">Executing code...</p>
          <LoadingDots />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-700/50 flex items-center justify-center mb-2">
          <Play size={22} className="text-slate-500" />
        </div>
        <p className="text-slate-400 font-medium">No output yet</p>
        <p className="text-slate-600 text-sm">Click <strong className="text-brand-400">Run</strong> to execute your code</p>
        <div className="mt-4 bg-surface-800/50 rounded-xl px-4 py-3 border border-white/5 w-full max-w-xs">
          <p className="text-xs text-slate-500 font-mono">Keyboard: Ctrl+Enter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-auto">
      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
          result.success
            ? 'bg-accent-green/10 border-accent-green/20'
            : 'bg-accent-red/10 border-accent-red/20'
        }`}
      >
        {result.success
          ? <CheckCircle size={16} className="text-accent-green flex-shrink-0" />
          : <XCircle size={16} className="text-accent-red flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${result.success ? 'text-accent-green' : 'text-accent-red'}`}>
            {result.success ? 'Execution Successful' : 'Execution Failed'}
          </p>
          {result.executionTime && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock size={11} /> {result.executionTime}ms
            </p>
          )}
        </div>
        <Zap size={14} className={result.success ? 'text-accent-green/50' : 'text-accent-red/50'} />
      </motion.div>

      {/* Output */}
      {(result.output || result.stdout) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-900/80 rounded-xl border border-white/5 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-red/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent-green/40" />
            </div>
            <span className="text-xs text-slate-500 font-mono ml-1">stdout</span>
          </div>
          <pre className="p-4 text-sm font-mono text-accent-green leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {result.output || result.stdout}
          </pre>
        </motion.div>
      )}

      {/* Error / Stderr */}
      {(result.error || result.stderr) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-accent-red/5 rounded-xl border border-accent-red/15 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-accent-red/10">
            <AlertTriangle size={13} className="text-accent-red" />
            <span className="text-xs text-accent-red/70 font-mono">stderr / error</span>
          </div>
          <pre className="p-4 text-xs font-mono text-accent-red/80 leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {result.error || result.stderr}
          </pre>
        </motion.div>
      )}

      {/* Input echo */}
      {input && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-900/40 rounded-xl border border-white/5 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
            <Terminal size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500 font-mono">stdin (your input)</span>
          </div>
          <pre className="p-3 text-xs font-mono text-slate-500 leading-relaxed whitespace-pre-wrap">
            {input}
          </pre>
        </motion.div>
      )}
    </div>
  )
}