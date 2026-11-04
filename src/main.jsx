import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { afterFirstPaint } from './lib/afterFirstPaint.js'
import { prefetchModels, preloadFirstModel } from './lib/modelPreload.js'
import './styles/global.css'

afterFirstPaint(preloadFirstModel)
prefetchModels()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
