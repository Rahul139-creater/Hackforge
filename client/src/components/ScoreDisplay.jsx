import React from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

export default function ScoreDisplay({ score }) {
  const color = score >= 75 ? 'text-accent-green border-accent-green/30 bg-accent-green/10'
    : score >= 50 ? 'text-accent-yellow border-accent-yellow/30 bg-accent-yellow/10'
    : 'text-accent-red border-accent-red/30 bg-accent-red/10'

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex items-center gap-1.5 border rounded-xl px-3 py-1.5 font-mono font-bold text-sm ${color}`}
    >
      <Trophy size={13} />
      {score}/100
    </motion.div>
  )
}