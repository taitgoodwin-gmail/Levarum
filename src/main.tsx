import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/base.css'
import '@fontsource/quicksand/latin-300.css'
import '@fontsource/quicksand/latin-400.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
