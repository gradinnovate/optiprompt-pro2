import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to OptiPrompt Pro',
          description: 'Your AI-powered desktop assistant',
          language: 'Language',
          signInWithGoogle: 'Sign in with Google',
          signOut: 'Sign Out',
        },
      },
      zh: {
        translation: {
          welcome: '歡迎使用 OptiPrompt Pro',
          description: '您的 AI 桌面助手',
          language: '語言',
          signInWithGoogle: '使用 Google 登入',
          signOut: '登出',
        },
      },
      ja: {
        translation: {
          welcome: 'OptiPrompt Pro へようこそ',
          description: 'あなたの AI デスクトップアシスタント',
          language: '言語',
          signInWithGoogle: 'Google でログイン',
          signOut: 'ログアウト',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 