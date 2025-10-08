import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/Layout.css'
import './components/HealthStatus.css'
import './pages/Dashboard.css'
import './pages/Sheets.css'
import './pages/Metadata.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)