import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ApplicationsProvider } from './context/ApplicationsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApplicationsProvider>
        <App />
      </ApplicationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
