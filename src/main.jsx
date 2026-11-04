import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { prefetchModels, preloadFirstModel } from './lib/modelPreload.js'
import './styles/global.css'

preloadFirstModel()
window.addEventListener('load', prefetchModels, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
