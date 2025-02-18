import { ErrorBoundary } from 'react-error-boundary'
import { FC } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/context/AuthContext'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/Home'
import CheckConnection from './pages/CheckConnection'
import MainPage from './pages/Main'
import StandalonePage from './pages/optimize/standalone'
import ExampleGuidedPage from './pages/optimize/example-guided'

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      {children}
    </div>
  )
}

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert" className="p-4">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

const App: FC = () => {
  console.log('App component rendering')
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error('React error boundary caught error:', error)
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

const AppContent: FC = () => {
  const { loading, user } = useAuth()
  console.log('App content auth state:', { loading, user })

  // 在這裡直接渲染 HomePage，不使用路由
  //if (process.env.NODE_ENV === 'production') {
  //  return <AppLayout><HomePage /></AppLayout>
  //}

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/check-connection" element={<AppLayout><CheckConnection /></AppLayout>} />
        <Route path="/app" element={<AppLayout><MainPage /></AppLayout>} />
        <Route path="/optimize/standalone" element={<AppLayout><StandalonePage /></AppLayout>} />
        <Route path="/optimize/example-guided" element={<AppLayout><ExampleGuidedPage /></AppLayout>} />
      </Routes>
    </Router>
  )
}

export default App 