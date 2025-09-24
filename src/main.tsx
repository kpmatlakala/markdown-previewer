import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import DeLightPlus UI styles
// import 'delightplus-ui/styles.css';
import 'delightplus-ui/dist/styles.css';

// Import your own Tailwind styles
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
