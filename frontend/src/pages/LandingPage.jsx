import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Code2, Trophy, Zap, Play, ChevronRight,
  Star, CheckCircle, Terminal, BarChart3, Lightbulb,
  Target, Cpu, Shield, ArrowRight, Sparkles, BookOpen,
  Users, TrendingUp, Award
} from 'lucide-react'
import { PROBLEMS, LANGUAGE_CONFIG } from '../data/problems.js'

const FEATURES = [
  {
    icon: Code2,
    title: 'Monaco Code Editor',
    desc: 'VS Code-grade editor with syntax highlighting, IntelliSense, and multi-language support.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
  },
  {
    icon: Play,
    title: 'Live Code Execution',
    desc: 'Run Java, Python, and JavaScript code instantly with real stdin/stdout support.',
    color: 'text-accent-green',
    bg: 'bg-accent-green/10 border-accent-green/20',
  },
  {
    icon: Brain,
    title: 'AI Mentor (Gemini)',
    desc: 'Get hints, error explanations, and improvement suggestions — never direct solutions.',
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10 border-accent-purple/20',
  },
  {
    icon: Trophy,
    title: 'Smart Auto-Grader',
    desc: 'Rubric-based scoring on correctness (50), quality (25), and efficiency (25).',
    color: 'text-accent-yellow',
    bg: 'bg-accent-yellow/10 border-accent-yellow/20',
  },
]

const STATS = [
  { value: '4+', label: 'Problems', icon: Target },
  { value: '3', label: 'Languages', icon: Code2 },
  { value: 'AI', label: 'Powered Hints', icon: Brain },
  { value: '100', label: 'Max Score', icon: Trophy },
]

const CODE_DEMO = `public class Main {
  public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int complement = target - nums[i];
      if (map.containsKey(complement)) {
        return new int[]{map.get(complement), i};
      }
      map.put(nums[i], i);
    }
    return new int[]{};
  }
}`

const TypewriterText = ({ texts }) => {
  const [current, setCurrent] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[current]
    const speed = isDeleting ? 40 : 80

    const timer = setTimeout(() => {
      if (!isDeleting && displayed.length < text.length) {
        setDisplayed(text.slice(0, displayed.length + 1))
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(text.slice(0, displayed.length - 1))
      } else if (!isDeleting && displayed.length === text.length) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayed.length === 0) {
        setIsDeleting(false)
        setCurrent((c) => (c + 1) % texts.length)
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [displayed, isDeleting, current, texts])

  return (
    <span className="typing-cursor text-brand-400">{displayed}</span>
  )
}

const FloatingCard = ({ delay, x, y, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [y, y - 10, y] }}
    transition={{ delay, duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
    style={{ position: 'absolute', left: x, top: y }}
    className="glass-card px-3 py-2 text-xs font-mono whitespace-nowrap shadow-2xl pointer-events-none"
  >
    {children}
  </motion.div>
)

export default function LandingPage({ onStart }) {
  const [hoveredProblem, setHoveredProblem] = useState(null)

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-animated overflow-x-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center animate-glow">
            <Brain size={18} className="text-brand-400" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Code<span className="text-brand-400">Mentor</span> AI
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="hidden md:flex items-center gap-1.5 text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            Gemini AI Active
          </div>
          <button
            onClick={() => onStart()}
            className="btn-primary text-sm"
          >
            Launch Editor <ArrowRight size={14} />
          </button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-surface-800/60 border border-white/8 rounded-full px-4 py-2 text-sm text-slate-400 mb-8">
              <Sparkles size={14} className="text-accent-yellow" />
              <span>HACKFORGE 2.0 — PS3 + PS4 Combined Solution</span>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-brand-400 font-medium">EdTech Track</span>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">CodeMentor AI</span>
            <br />
            <span className="text-slate-200 text-4xl md:text-5xl font-bold">
              Learn by{' '}
              <TypewriterText texts={['Thinking', 'Debugging', 'Iterating', 'Growing']} />
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            An AI-powered coding platform that acts as your personal mentor — giving
            structured hints, auto-grading your code, and guiding you to solutions
            without spoiling the journey.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onStart()}
              className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-500/20"
            >
              <Play size={18} />
              Start Coding Now
            </button>
            <button
              onClick={() => onStart(PROBLEMS[0])}
              className="btn-secondary text-base px-8 py-3.5 rounded-2xl"
            >
              <BookOpen size={16} />
              Try Two Sum
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="flex justify-center mb-2">
                <stat.icon size={18} className="text-brand-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Code preview section */}
      <section className="relative z-10 py-20 px-6 md:px-12 bg-surface-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label mb-4">How It Works</div>
              <h2 className="text-4xl font-bold text-white mb-5">
                Your AI Mentor,{' '}
                <span className="gradient-text">Always Available</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Write code in our Monaco-powered editor, run it instantly,
                get graded across correctness + quality + efficiency,
                and ask the AI mentor for hints — never answers.
              </p>

              <div className="space-y-4">
                {[
                  { step: '01', title: 'Pick a Problem', desc: 'Choose from curated DSA problems with difficulty tags' },
                  { step: '02', title: 'Write & Run Code', desc: 'Code in Java, Python, or JS with live execution' },
                  { step: '03', title: 'Get AI Hints', desc: 'Ask the Gemini-powered mentor for structured guidance' },
                  { step: '04', title: 'Grade & Improve', desc: 'See rubric-based scores and learn from feedback' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-brand-400">{s.step}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm mb-0.5">{s.title}</p>
                      <p className="text-slate-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Code window mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card overflow-hidden shadow-2xl glow-blue">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-surface-900/60">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-accent-red/60" />
                    <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
                    <div className="w-3 h-3 rounded-full bg-accent-green/60" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 ml-2">Main.java — Two Sum</span>
                </div>
                <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
                  <code>{CODE_DEMO
                    .replace(/Map|HashMap/g, (m) => `<span style="color:#38bdf8">${m}</span>`)
                    .split('\n').map((line, i) => (
                      <span key={i} dangerouslySetInnerHTML={{ __html: line }} />
                    )).reduce((acc, el, i) => [...acc, el, <br key={`br-${i}`} />], [])}
                  </code>
                </pre>

                {/* AI hint overlay */}
                <div className="border-t border-white/5 bg-accent-purple/5 px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb size={12} className="text-accent-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent-purple mb-1">AI Mentor Hint</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Think about what data structure lets you look up values in O(1) time.
                        What information do you need to store as you iterate?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 -bottom-4 glass-card px-4 py-3 shadow-xl border border-accent-green/20"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-accent-green" />
                  <div>
                    <div className="text-lg font-extrabold text-accent-green leading-none">92/100</div>
                    <div className="text-xs text-slate-500">Auto-Grade Score</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="section-label mb-3">Core Features</div>
            <h2 className="text-4xl font-bold text-white">
              Everything You Need to{' '}
              <span className="gradient-text">Level Up</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`glass-card p-6 border ${f.bg} cursor-default`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${f.bg} border`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="relative z-10 py-20 px-6 md:px-12 bg-surface-800/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="section-label mb-3">Problem Set</div>
            <h2 className="text-4xl font-bold text-white mb-3">
              Curated DSA Challenges
            </h2>
            <p className="text-slate-400">Pick a problem and start solving with AI guidance</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredProblem(p.id)}
                onHoverEnd={() => setHoveredProblem(null)}
                className="glass-card p-5 cursor-pointer border border-white/5 hover:border-brand-500/30 transition-all group"
                onClick={() => onStart(p)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge border text-xs ${
                    p.difficulty === 'Easy' ? 'badge-pass' :
                    p.difficulty === 'Medium' ? 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/25' :
                    'badge-fail'
                  }`}>
                    {p.difficulty}
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors mt-0.5" />
                </div>

                <h3 className="font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{p.title}</h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-xs bg-surface-700/60 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Terminal size={11} /> {p.testCases.length} tests
                  </span>
                  <span className="flex items-center gap-1">
                    <Code2 size={11} /> {Object.keys(p.starterCode).length} langs
                  </span>
                </div>

                <AnimatePresence>
                  {hoveredProblem === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <button className="w-full btn-primary text-xs py-2 justify-center">
                        <Play size={12} /> Solve Now
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Policy Section */}
      <section className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Shield size={16} className="text-accent-purple" />
              <span className="section-label">AI Mentor Philosophy</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-8">
              Hints, Not{' '}
              <span className="gradient-text">Spoilers</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                { icon: CheckCircle, color: 'text-accent-green', label: 'What We Give', items: ['Structured hints', 'Error explanations', 'Concept guides', 'Quality feedback'] },
                { icon: Cpu, color: 'text-brand-400', label: 'How AI Responds', items: ['Socratic method', 'Step-by-step logic', 'Encourage thinking', 'Short & focused'] },
                { icon: Award, color: 'text-accent-yellow', label: 'What You Get', items: ['Real understanding', 'Problem-solving skills', 'Better code quality', 'Confidence boost'] },
              ].map((col, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 text-left"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <col.icon size={16} className={col.color} />
                    <span className="font-semibold text-white text-sm">{col.label}</span>
                  </div>
                  <ul className="space-y-2">
                    {col.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStart()}
              className="btn-primary text-lg px-10 py-4 rounded-2xl shadow-xl shadow-brand-500/25 mx-auto"
            >
              <Brain size={20} />
              Start Learning with AI Mentor
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Brain size={14} className="text-brand-400" />
            <span>CodeMentor AI — Built for HACKFORGE 2.0</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>PS3 + PS4 | EdTech Track</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-brand-400" /> Powered by Gemini
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}