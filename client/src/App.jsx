import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import EditorPage from './pages/EditorPage.jsx'
import AuthPage from './pages/Auth/Auth.jsx'

export default function App() {
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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:problemId" element={<EditorPage />} />
      </Routes>
    </div>
  )
}