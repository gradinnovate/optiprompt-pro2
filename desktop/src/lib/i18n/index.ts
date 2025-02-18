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
          modes: {
            selectTitle: 'Choose Your Optimization Mode',
            selectDescription: 'Select the mode that best fits your needs',
            exampleGuided: {
              title: 'Example-Guided Optimization',
              description: 'Optimize prompts using examples as reference. Perfect for translation, rewriting, and summarization tasks.',
              taskDescriptionPlaceholder: 'Describe your task (e.g., "Improve translation quality")',
              initialPromptPlaceholder: 'Enter your initial prompt',
              examplePlaceholder: 'Enter an example of a good prompt'
            },
            standalone: {
              title: 'Standalone Optimization',
              description: 'Optimize your prompts directly without examples',
              taskDescriptionPlaceholder: 'Describe your task (e.g., "Create a translation prompt")',
              initialPromptPlaceholder: 'Enter your initial prompt'
            },
            select: 'Select'
          },
          optimize: 'Optimize',
          results: {
            optimized: 'Optimized',
            variants: 'Variants',
            outputs: 'Outputs',
            scores: 'Scores'
          },
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
            connection: 'Connection',
          },
        },
      },
      zh: {
        translation: {
          modes: {
            selectTitle: '選擇優化模式',
            selectDescription: '選擇最適合您需求的模式',
            exampleGuided: {
              title: '範例引導優化',
              description: '使用範例作為參考來優化提示詞。適合翻譯、改寫和摘要任務。',
              taskDescriptionPlaceholder: '描述您的任務（例如：「提高翻譯質量」）',
              initialPromptPlaceholder: '輸入您的初始提示詞',
              examplePlaceholder: '輸入一個良好提示詞的範例'
            },
            standalone: {
              title: '獨立優化',
              description: '直接優化您的提示詞，無需範例',
              taskDescriptionPlaceholder: '描述您的任務（例如：「創建翻譯提示詞」）',
              initialPromptPlaceholder: '輸入您的初始提示詞'
            },
            select: '選擇'
          },
          optimize: '優化',
          results: {
            optimized: '優化結果',
            variants: '變體',
            outputs: '輸出',
            scores: '評分'
          },
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
            connection: '連線設定',
          },
        },
      },
      ja: {
        translation: {
          modes: {
            selectTitle: '最適化モードを選択',
            selectDescription: 'ニーズに最適なモードを選択してください',
            exampleGuided: {
              title: '例示ガイド最適化',
              description: '例を参考にプロンプトを最適化。翻訳、書き換え、要約タスクに最適。',
              taskDescriptionPlaceholder: 'タスクを説明してください（例：「翻訳品質の向上」）',
              initialPromptPlaceholder: '初期プロンプトを入力',
              examplePlaceholder: '良いプロンプトの例を入力'
            },
            standalone: {
              title: 'スタンドアロン最適化',
              description: '例なしで直接プロンプトを最適化',
              taskDescriptionPlaceholder: 'タスクを説明してください（例：「翻訳プロンプトの作成」）',
              initialPromptPlaceholder: '初期プロンプトを入力'
            },
            select: '選択'
          },
          optimize: '最適化',
          results: {
            optimized: '最適化結果',
            variants: 'バリエーション',
            outputs: '出力',
            scores: 'スコア'
          },
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
            connection: '接続設定',
          },
        },
      },
      ko: {
        translation: {
          modes: {
            selectTitle: '최적화 모드 선택',
            selectDescription: '필요에 가장 적합한 모드를 선택하세요',
            exampleGuided: {
              title: '예시 기반 최적화',
              description: '예시를 참조하여 프롬프트를 최적화합니다. 번역, 다시 쓰기, 요약 작업에 적합합니다.',
              taskDescriptionPlaceholder: '작업을 설명하세요 (예: "번역 품질 향상")',
              initialPromptPlaceholder: '초기 프롬프트 입력',
              examplePlaceholder: '좋은 프롬프트의 예시 입력'
            },
            standalone: {
              title: '독립 최적화',
              description: '예시 없이 직접 프롬프트를 최적화',
              taskDescriptionPlaceholder: '작업을 설명하세요 (예: "번역 프롬프트 생성")',
              initialPromptPlaceholder: '초기 프롬프트 입력'
            },
            select: '선택'
          },
          optimize: '최적화',
          results: {
            optimized: '최적화 결과',
            variants: '변형',
            outputs: '출력',
            scores: '점수'
          },
          welcome: 'OptiPrompt Pro에 오신 것을 환영합니다',
          description: '원활한 의사소통과 생산성 향상을 위한 지능형 AI 데스크톱 어시스턴트',
          language: '언어',
          signInWithGoogle: 'Google로 로그인',
          signOut: '로그아웃',
          getStarted: '시작하기',
          learnMore: '자세히 알아보기',
          feature1: {
            title: 'AI 채팅',
            description: '고급 언어 모델 통합으로 지능적인 대화와 작업 지원 실현',
          },
          feature2: {
            title: '생산성 도구',
            description: '통합된 생산성 기능과 자동화로 워크플로우 간소화',
          },
          feature3: {
            title: '보안 및 개인정보',
            description: '엔드투엔드 암호화와 데이터 프라이버시를 갖춘 기업급 보안',
          },
          checkConnection: {
            title: '연결 설정',
            baseUrlLabel: 'Ollama 기본 URL',
            check: '연결 확인',
            proceed: '애플리케이션으로 이동',
            availableModels: '사용 가능한 모델',
            modelInfo: {
              size: '크기',
              gb: 'GB',
              family: '모델 계열',
              parameters: '매개변수',
              quantization: '양자화 수준',
              modified: '마지막 수정'
            }
          },
          nav: {
            home: '홈',
            chat: '채팅',
            connection: '연결 설정',
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