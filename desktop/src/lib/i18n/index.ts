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
          description: 'Your intelligent AI-powered desktop assistant for seamless communication and enhanced productivity',
          language: 'Language',
          signInWithGoogle: 'Sign in with Google',
          signOut: 'Sign Out',
          getStarted: 'Get Started',
          learnMore: 'Learn More',
          feature1: {
            title: 'AI-Powered Chat',
            description: 'Advanced language model integration for intelligent conversations and task assistance',
          },
          feature2: {
            title: 'Productivity Tools',
            description: 'Streamline your workflow with integrated productivity features and automations',
          },
          feature3: {
            title: 'Secure & Private',
            description: 'Enterprise-grade security with end-to-end encryption and data privacy',
          },
          checkConnection: {
            title: 'Connection Settings',
            baseUrlLabel: 'Ollama Base URL',
            check: 'Check Connection',
            proceed: 'Proceed to Application',
            availableModels: 'Available Models',
            modelInfo: {
              size: 'Size',
              gb: 'GB',
              family: 'Family',
              parameters: 'Parameters',
              quantization: 'Quantization',
              modified: 'Last Modified'
            }
          },
          nav: {
            home: 'Home',
            chat: 'Chat',
          },
        },
      },
      zh: {
        translation: {
          welcome: '歡迎使用 OptiPrompt Pro',
          description: '您的智能 AI 桌面助手，實現無縫溝通和提升生產力',
          language: '語言',
          signInWithGoogle: '使用 Google 登入',
          signOut: '登出',
          getStarted: '立即開始',
          learnMore: '了解更多',
          feature1: {
            title: 'AI 對話功能',
            description: '整合先進語言模型，實現智能對話和任務協助',
          },
          feature2: {
            title: '生產力工具',
            description: '通過集成的生產力功能和自動化簡化工作流程',
          },
          feature3: {
            title: '安全與隱私',
            description: '企業級安全性，提供端到端加密和數據隱私保護',
          },
          checkConnection: {
            title: '連線設定',
            baseUrlLabel: 'Ollama 基礎 URL',
            check: '檢查連線',
            proceed: '前往應用',
            availableModels: '可用模型',
            modelInfo: {
              size: '大小',
              gb: 'GB',
              family: '模型系列',
              parameters: '參數量',
              quantization: '量化等級',
              modified: '最後修改'
            }
          },
          nav: {
            home: '首頁',
            chat: '聊天',
          },
        },
      },
      ja: {
        translation: {
          welcome: 'OptiPrompt Pro へようこそ',
          description: 'シームレスなコミュニケーションと生産性向上のためのインテリジェントAIデスクトップアシスタント',
          language: '言語',
          signInWithGoogle: 'Google でログイン',
          signOut: 'ログアウト',
          getStarted: '始めましょう',
          learnMore: '詳細を見る',
          feature1: {
            title: 'AI チャット',
            description: '高度な言語モデルを統合し、インテリジェントな会話とタスクサポートを実現',
          },
          feature2: {
            title: '生産性ツール',
            description: '統合された生産性機能と自動化でワークフローを効率化',
          },
          feature3: {
            title: 'セキュリティとプライバシー',
            description: 'エンドツーエンドの暗号化とデータプライバシーを備えたエンタープライズグレードのセキュリティ',
          },
          checkConnection: {
            title: '接続設定',
            baseUrlLabel: 'Ollama ベース URL',
            check: '接続確認',
            proceed: 'アプリケーションへ',
            availableModels: '利用可能なモデル',
            modelInfo: {
              size: 'サイズ',
              gb: 'GB',
              family: 'モデルファミリー',
              parameters: 'パラメータ数',
              quantization: '量子化レベル',
              modified: '最終更新'
            }
          },
          nav: {
            home: 'ホーム',
            chat: 'チャット',
          },
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 