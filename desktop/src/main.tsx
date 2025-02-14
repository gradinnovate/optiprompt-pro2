import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import './lib/i18n'

console.log('main.tsx executing')

const rootElement = document.getElementById('root')
console.log('Root element in main.tsx:', rootElement)

try {
  console.log('Starting React render')
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  )
  console.log('React render initiated')
} catch (error: unknown) {
  console.error('React render error:', error)
} 