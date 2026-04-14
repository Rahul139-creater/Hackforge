import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Play, Zap, Brain, Trophy, ChevronDown,
  RotateCcw, Settings, Maximize2, Terminal, CheckCircle,
  XCircle, AlertTriangle, Clock, Code2, BookOpen,
  MessageSquare, Send, Loader2, BarChart3, Target,
  ChevronRight, Lightbulb, Bug, TrendingUp, Star
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import { PROBLEMS, LANGUAGE_CONFIG } from '../data/problems.js'
import { runCode, gradeCode, analyzeCode } from '../services/api.js'
import toast from 'react-hot-toast'

import ProblemPanel from '../components/ProblemPanel.jsx'
import OutputPanel from '../components/OutputPanel.jsx'
import GradePanel from '../components/GradePanel.jsx'
import MentorPanel from '../components/MentorPanel.jsx'
import ScoreDisplay from '../components/ScoreDisplay.jsx'

const TABS = [
  { id: 'output', label: 'Output', icon: Terminal },
  { id: 'grade', label: 'Grade', icon: BarChart3 },
  { id: 'mentor', label: 'AI Mentor', icon: Brain },
]

const MONACO_THEME = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '4a5568', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'a78bfa' },
    { token: 'string', foreground: '22d3a0' },
    { token: 'number', foreground: 'fbbf24' },
    { token: 'type', foreground: '38bdf8' },
    { token: 'function', foreground: 'fb923c' },
    { token: 'variable', foreground: 'e2e8f0' },
    { token: 'class', foreground: '38bdf8' },
  ],
  colors: {
    'editor.background': '#0f1629',
    'editor.foreground': '#e2e8f0',
    'editor.lineHighlightBackground': '#1c284220',
    'editor.selectionBackground': '#0ea5e930',
    'editor.inactiveSelectionBackground': '#0ea5e915',
    'editorLineNumber.foreground': '#2d3a52',
    'editorLineNumber.activeForeground': '#0ea5e9',
    'editorCursor.foreground': '#0ea5e9',
    'editor.findMatchBackground': '#fbbf2430',
    'editor.findMatchHighlightBackground': '#fbbf2415',
    'scrollbarSlider.background': '#1c284240',
    'scrollbarSlider.hoverBackground': '#1c284260',
    'editorGutter.background': '#0f1629',
    'minimap.background': '#0a0e1a',
    'editorWidget.background': '#0f1629',
    'editorWidget.border': '#1c2842',
    'input.background': '#151e35',
    'input.border': '#1c2842',
    'focusBorder': '#0ea5e9',
    'dropdown.background': '#0f1629',
    'list.hoverBackground': '#1c2842',
    'list.activeSelectionBackground': '#0ea5e920',
  },
}

export default function EditorPage({ problem: initialProblem, onBack }) {
  const [selectedProblem, setSelectedProblem] = useState(initialProblem || PROBLEMS[0])
  const [language, setLanguage] = useState('java')
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('output')
  const [isRunning, setIsRunning] = useState(false)
  const [isGrading, setIsGrading] = useState(false)
  const [isMentoring, setIsMentoring] = useState(false)
  const [runResult, setRunResult] = useState(null)
  const [gradeResult, setGradeResult] = useState(null)
  const [mentorResult, setMentorResult] = useState(null)
  const [mentorQuestion, setMentorQuestion] = useState('')
  const [showProblem, setShowProblem] = useState(true)
  const [editorMounted, setEditorMounted] = useState(false)
  const monacoRef = useRef(null)

  // Load starter code when problem or language changes
  useEffect(() => {
    if (selectedProblem?.starterCode?.[language]) {
      setCode(selectedProblem.starterCode[language])
    }
    setRunResult(null)
    setGradeResult(null)
    setMentorResult(null)
  }, [selectedProblem, language])

  // Set custom Monaco theme
  const handleEditorMount = (editor, monaco) => {
    monacoRef.current = monaco
    monaco.editor.defineTheme('codementor-dark', MONACO_THEME)
    monaco.editor.setTheme('codementor-dark')
    setEditorMounted(true)
  }

  const handleRun = useCallback(async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    setIsRunning(true)
    setActiveTab('output')
    setRunResult(null)
    try {
      const result = await runCode({ code, language, input })
      setRunResult(result)
      if (result.success) toast.success('Code executed!', { icon: '▶️' })
      else toast.error('Runtime error detected')
    } catch (err) {
      const msg = err.response?.data?.error || 'Execution failed'
      setRunResult({ success: false, output: '', error: msg, stderr: msg })
      toast.error(msg)
    } finally {
      setIsRunning(false)
    }
  }, [code, language, input])

  const handleGrade = useCallback(async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    setIsGrading(true)
    setActiveTab('grade')
    setGradeResult(null)
    try {
      const result = await gradeCode({
        code, language,
        problemId: selectedProblem.id,
        testCases: selectedProblem.testCases,
      })
      setGradeResult(result)
      const score = result.totalScore
      if (score === 100) toast.success(`Perfect score! 🎉`, { icon: '🏆' })
      else if (score >= 75) toast.success(`Great job! Score: ${score}/100`)
      else if (score >= 50) toast(`Score: ${score}/100 — Keep going!`, { icon: '💪' })
      else toast.error(`Score: ${score}/100 — Try the hints!`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Grading failed')
    } finally {
      setIsGrading(false)
    }
  }, [code, language, selectedProblem])

  const handleMentor = useCallback(async () => {
    setIsMentoring(true)
    setActiveTab('mentor')
    setMentorResult(null)
    try {
      const result = await analyzeCode({
        code,
        language,
        problemTitle: selectedProblem.title,
        problemDescription: selectedProblem.description,
        errorOutput: runResult?.error || runResult?.stderr || '',
        userQuestion: mentorQuestion,
      })
      setMentorResult(result)
      setMentorQuestion('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI analysis failed')
    } finally {
      setIsMentoring(false)
    }
  }, [code, language, selectedProblem, runResult, mentorQuestion])

  const handleReset = () => {
    if (selectedProblem?.starterCode?.[language]) {
      setCode(selectedProblem.starterCode[language])
      toast('Code reset to starter template', { icon: '🔄' })
    }
  }

  const langCfg = LANGUAGE_CONFIG[language]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-900">
      {/* Top Bar */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-surface-800/80 backdrop-blur-xl flex-shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={15} className="text-slate-400" />
        </button>

        <div className="w-px h-5 bg-white/10" />

        {/* Problem Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-surface-700/60 hover:bg-surface-700 border border-white/5 px-3 py-1.5 rounded-lg transition-all text-sm">
            <Target size={13} className="text-brand-400" />
            <span className="text-slate-200 font-medium max-w-[160px] truncate">{selectedProblem?.title}</span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-64 glass-card border border-white/8 shadow-2xl z-50 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {PROBLEMS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-surface-700/50 transition-colors flex items-center gap-2 ${selectedProblem?.id === p.id ? 'text-brand-400' : 'text-slate-300'}`}
              >
                {selectedProblem?.id === p.id && <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />}
                <span className={selectedProblem?.id !== p.id ? 'ml-3.5' : ''}>{p.title}</span>
                <span className={`ml-auto badge border text-xs ${p.difficulty === 'Easy' ? 'badge-pass' : p.difficulty === 'Medium' ? 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/25' : 'badge-fail'}`}>
                  {p.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-surface-700/60 hover:bg-surface-700 border border-white/5 px-3 py-1.5 rounded-lg transition-all text-sm">
            <span>{langCfg.icon}</span>
            <span className="text-slate-200 font-mono font-medium">{langCfg.label}</span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-36 glass-card border border-white/8 shadow-2xl z-50 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {Object.values(LANGUAGE_CONFIG).map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-700/50 transition-colors flex items-center gap-2 ${language === l.id ? 'text-brand-400' : 'text-slate-300'}`}
              >
                <span>{l.icon}</span> {l.label}
                {language === l.id && <CheckCircle size={12} className="ml-auto text-brand-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleReset} className="w-8 h-8 rounded-lg bg-surface-700/60 hover:bg-surface-700 flex items-center justify-center transition-colors" title="Reset Code">
            <RotateCcw size={14} className="text-slate-400" />
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn-primary text-sm py-1.5 px-4"
          >
            {isRunning
              ? <><Loader2 size={14} className="animate-spin" /> Running...</>
              : <><Play size={14} /> Run</>
            }
          </button>

          <button
            onClick={handleGrade}
            disabled={isGrading}
            className="bg-accent-green/20 hover:bg-accent-green/30 text-accent-green font-semibold text-sm px-4 py-1.5 rounded-xl transition-all flex items-center gap-2 border border-accent-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGrading
              ? <><Loader2 size={14} className="animate-spin" /> Grading...</>
              : <><Trophy size={14} /> Grade</>
            }
          </button>

          {gradeResult && (
            <ScoreDisplay score={gradeResult.totalScore} />
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Panel (collapsible) */}
        <AnimatePresence>
          {showProblem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-white/5 overflow-hidden flex-shrink-0"
            >
              <ProblemPanel
                problem={selectedProblem}
                onCollapse={() => setShowProblem(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle problem panel */}
        {!showProblem && (
          <button
            onClick={() => setShowProblem(true)}
            className="w-7 border-r border-white/5 bg-surface-800/40 hover:bg-surface-700/40 flex items-center justify-center flex-shrink-0 transition-colors group"
          >
            <ChevronRight size={14} className="text-slate-500 group-hover:text-brand-400" />
          </button>
        )}

        {/* Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-surface-800/30">
            <Code2 size={13} className="text-brand-400" />
            <span className="text-xs text-slate-400 font-mono">
              Solution{langCfg.extension}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-600 font-mono">
                {code.split('\n').length} lines
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={langCfg.monacoLang}
              value={code}
              onChange={val => setCode(val || '')}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 4,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                suggest: { showKeywords: true },
                padding: { top: 16, bottom: 16 },
              }}
              theme="codementor-dark"
            />
          </div>

          {/* Input area */}
          <div className="border-t border-white/5 bg-surface-800/30 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={12} className="text-slate-500" />
              <span className="section-label">Custom Input</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter test input here (stdin)..."
              className="w-full bg-surface-900/60 border border-white/5 rounded-lg px-3 py-2 text-sm font-mono text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-brand-500/40 transition-colors"
              rows={2}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[420px] flex-shrink-0 flex flex-col border-l border-white/5 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-surface-800/30 flex-shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative flex-1 justify-center
                  ${activeTab === tab.id ? 'text-white tab-active' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
                {tab.id === 'grade' && gradeResult && (
                  <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ml-1
                    ${gradeResult.totalScore >= 75 ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'}`}>
                    {Math.round(gradeResult.totalScore / 25)}
                  </span>
                )}
                {tab.id === 'mentor' && (isMentoring || mentorResult) && (
                  <div className="w-2 h-2 bg-accent-purple rounded-full ml-1" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'output' && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="h-full overflow-auto"
                >
                  <OutputPanel result={runResult} isRunning={isRunning} input={input} />
                </motion.div>
              )}
              {activeTab === 'grade' && (
                <motion.div
                  key="grade"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="h-full overflow-auto"
                >
                  <GradePanel result={gradeResult} isGrading={isGrading} onGrade={handleGrade} />
                </motion.div>
              )}
              {activeTab === 'mentor' && (
                <motion.div
                  key="mentor"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="h-full flex flex-col"
                >
                  <MentorPanel
                    result={mentorResult}
                    isMentoring={isMentoring}
                    question={mentorQuestion}
                    onQuestionChange={setMentorQuestion}
                    onAskMentor={handleMentor}
                    hasCode={!!code.trim()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}