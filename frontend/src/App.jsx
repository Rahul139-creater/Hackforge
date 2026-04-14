import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage.jsx'
import EditorPage from './pages/EditorPage.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedProblem, setSelectedProblem] = useState(null)

  const goToEditor = (problem = null) => {
    setSelectedProblem(problem)
    setPage('editor')
  }

  return (
    <div className="min-h-screen bg-animated font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1629',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Syne, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22d3a0', secondary: '#0f1629' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#0f1629' } },
        }}
      />
      {page === 'landing'
        ? <LandingPage onStart={goToEditor} />
        : <EditorPage
            problem={selectedProblem}
            onBack={() => setPage('landing')}
          />
      }
    </div>
  )
}