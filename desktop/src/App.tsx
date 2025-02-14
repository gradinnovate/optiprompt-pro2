import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './components/LanguageSelector'
import LoginButton from './components/auth/LoginButton'
import { AuthProvider } from './lib/context/AuthContext'

const AppContent: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <LoginButton />
      <LanguageSelector />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('description')}
          </p>
        </div>
      </div>
    </div>
  )
}

const App: FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App 