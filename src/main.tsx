import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/levarum/index.css'
import './styles/site.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing from index.html')

try { const saved = localStorage.getItem('levarum.theme.v1'); document.documentElement.dataset.theme = saved === 'dark' || saved === 'light' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' } catch { /* Use light theme when storage is unavailable. */ }

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
