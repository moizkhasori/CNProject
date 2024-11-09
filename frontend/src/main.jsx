import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline';
import UserCredentials from './pages/UserCredentials.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <CssBaseline>
    <App />
    </CssBaseline>
    
  </>
)
