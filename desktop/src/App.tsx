import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/context/AuthContext'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/Home'
import CheckConnection from './pages/CheckConnection'

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      {children}
    </div>
  )
}

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/check-connection" element={<AppLayout><CheckConnection /></AppLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 