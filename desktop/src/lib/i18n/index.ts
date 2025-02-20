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
          selectModel: 'Select Model',
          loading: 'Loading...',
          modelSelector: {
            label: 'Language Model',
            description: 'Choose the AI model that will be used for prompt optimization'
          },
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
            initialResult: 'Initial Result',
            polish: 'AI Rewrite',
            analysis: 'AI Analysis',
            variants: 'Prompt Variants',
            variantResults: 'Variant Results'
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
            optimize: 'Optimize',
          },
          noResults: 'No results yet',
          optimizedPrompt: 'Optimized Prompt',
          critiqueFeedback: 'Critique Feedback',
          variant: 'Variant',
          variantResult: 'Variant Result',
          initialPromptTitle: 'Initial Prompt',
          initialResult: 'Initial Result',
          noPrompt: 'No prompt entered',
          taskDescription: {
            label: 'Task Description',
            description: 'Describe what you want to achieve with this prompt'
          },
          initialPrompt: {
            label: 'Initial Prompt',
            description: 'Enter your starting prompt that needs optimization'
          },
          example: {
            label: 'Example',
            description: 'Provide an example to guide the optimization process'
          },
          showThinkingProcess: 'Show Thinking Process',
          toast: {
            credits: {
              insufficient: {
                title: "Insufficient credits",
                description: "You are running out of free credits."
              }
            }
          },
          download: {
            json: "Download JSON"
          }
        },
      },
      zh: {
        translation: {
          selectModel: '選擇模型',
          loading: '載入中...',
          modelSelector: {
            label: '語言模型',
            description: '選擇用於提示詞優化的 AI 模型'
          },
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
            initialResult: '初始提示詞結果',
            polish: 'AI 潤飾',
            analysis: 'AI 分析',
            variants: '變體提示詞',
            variantResults: '變體測試結果'
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
            optimize: '優化',
          },
          noResults: '尚無結果',
          optimizedPrompt: '優化後提示詞',
          critiqueFeedback: '分析回饋',
          variant: '變體',
          variantResult: '變體結果',
          initialPromptTitle: '初始提示詞',
          initialResult: '執行結果',
          noPrompt: '尚未輸入提示詞',
          taskDescription: {
            label: '任務描述',
            description: '描述你想要達成的目標'
          },
          initialPrompt: {
            label: '初始提示詞',
            description: '輸入需要優化的提示詞'
          },
          example: {
            label: '範例',
            description: '提供一個範例來引導優化過程'
          },
          showThinkingProcess: '顯示思考過程',
          toast: {
            credits: {
              insufficient: {
                title: "點數不足",
                description: "您的免費點數已用完"
              }
            }
          },
          download: {
            json: "下載 JSON"
          }
        },
      },
      ja: {
        translation: {
          selectModel: 'モデルを選択',
          loading: '読み込み中...',
          modelSelector: {
            label: '言語モデル',
            description: 'プロンプト最適化に使用するAIモデルを選択してください'
          },
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
            initialResult: '初期プロンプト結果',
            polish: 'AI リライト',
            analysis: 'AI 分析',
            variants: 'プロンプトバリエーション',
            variantResults: 'バリエーションテスト結果'
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
            optimize: '最適化',
          },
          noResults: '結果はまだありません',
          optimizedPrompt: 'Optimized Prompt',
          critiqueFeedback: 'Critique Feedback',
          variant: 'Variant',
          variantResult: 'Variant Result',
          initialPromptTitle: '初期プロンプト',
          initialResult: '実行結果',
          noPrompt: 'プロンプトが未入力です',
          taskDescription: {
            label: 'タスクの説明',
            description: 'このプロンプトで達成したいことを説明してください'
          },
          initialPrompt: {
            label: '初期プロンプト',
            description: '最適化が必要な開始プロンプトを入力してください'
          },
          example: {
            label: '例',
            description: '最適化プロセスを導くための例を提供してください'
          },
          showThinkingProcess: '思考プロセスを表示',
          toast: {
            credits: {
              insufficient: {
                title: "Insufficient credits",
                description: "You are running out of free credits."
              }
            }
          },
          download: {
            json: "JSONをダウンロード"
          }
        },
      },
      ko: {
        translation: {
          selectModel: '모델 선택',
          loading: '로딩 중...',
          modelSelector: {
            label: '언어 모델',
            description: '프롬프트 최적화에 사용할 AI 모델을 선택하세요'
          },
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
            initialResult: '초기 프롬프트 결과',
            polish: 'AI 리라이트',
            analysis: 'AI 분석',
            variants: '프롬프트 변형',
            variantResults: '변형 테스트 결과'
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
            optimize: '최적화',
          },
          noResults: '아직 결과가 없습니다',
          optimizedPrompt: 'Optimized Prompt',
          critiqueFeedback: 'Critique Feedback',
          variant: 'Variant',
          variantResult: 'Variant Result',
          initialPromptTitle: '초기 프롬프트',
          initialResult: '실행 결과',
          noPrompt: '프롬프트가 입력되지 않았습니다',
          taskDescription: {
            label: '작업 설명',
            description: '이 프롬프트로 달성하고자 하는 목표를 설명하세요'
          },
          initialPrompt: {
            label: '초기 프롬프트',
            description: '최적화가 필요한 시작 프롬프트를 입력하세요'
          },
          example: {
            label: '예시',
            description: '최적화 과정을 안내할 예시를 제공하세요'
          },
          showThinkingProcess: '사고 과정 표시',
          toast: {
            credits: {
              insufficient: {
                title: "Insufficient credits",
                description: "You are running out of free credits."
              }
            }
          },
          download: {
            json: "JSON 다운로드"
          }
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 