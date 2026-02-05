import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ✅ IMPORT ORDER IS CRITICAL - Variables must be first!
// 1. CSS Variables (must be imported first)
import './styles/variables.css';

// 2. Global/Base Styles
import './styles/globals.css';
import './styles/typography.css';

// 3. Shared Component Styles
import './styles/forms.css';
import './styles/utilities.css';
import './styles/animations.css';

// 4. React App
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
