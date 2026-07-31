import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import TrackingContextProvider from './context/TrackingContext.jsx'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <TrackingContextProvider>
        <App />
      </TrackingContextProvider>
    </StoreContextProvider>
  </BrowserRouter>
)
