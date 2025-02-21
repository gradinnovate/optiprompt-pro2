'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/config/translations';
import { LANGUAGES, LanguageKey } from '@/config/languages';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Language Selector */}
      <div className="fixed top-4 right-8 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageKey)}
          className="bg-white/80 backdrop-blur border rounded-md px-3 py-1 shadow-sm"
          aria-label="Select Language"
        >
          {Object.entries(LANGUAGES).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <main className="max-w-6xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold text-center mb-6 animate-fade-in">
            {t.hero.title}
          </h1>
          <p className="text-xl text-center text-white/90 mb-8">
            {t.hero.subtitle}
          </p>
          
          {/* Model Description */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-12">
            <p className="text-white/90 mb-4">
              {t.hero.description1} <span className="font-bold">{t.hero.modelList}</span> {t.hero.description2} {t.hero.comparison}？
            </p>
            <p className="text-white/90">
              <span className="font-bold">OptiPrompt Pro</span> {t.hero.description3}
              <span className="font-bold">{t.hero.description4}</span>
              {t.hero.description5}
              <span className="font-bold">{t.hero.description6}</span>
              {t.hero.description7}
            </p>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <a 
              href="https://drive.google.com/file/d/123hwnAAGIZTMYcScpLtOZ8ZLyb9-2AJS/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              {t.buttons.downloadMac}
            </a>
            <a 
              href="https://github.com/gradinnovate/optiprompt-pro2"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </main>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Why Optimize Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            {t.whyOptimize}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {t.whyReasons.map((reason, index) => (
              <div key={index} 
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="text-gray-700">
                    <p className="font-medium">{reason.split('：')[0]}</p>
                    <p className="text-gray-600 mt-1">{reason.split('：')[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Note section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 max-w-5xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 text-2xl">💡</span>
              <p className="text-blue-800">
                {t.whyOptimizeNote}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.list.map((feature, index) => (
              <div key={index} 
                className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl" aria-label={t.features.iconAlt}>✨</span>
                  </div>
                </div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            {t.targetUsers.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {t.targetUsers.contentCreators.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.targetUsers.contentCreators.list.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {t.targetUsers.business.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.targetUsers.business.list.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {t.targetUsers.researchers.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.targetUsers.researchers.list.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {t.targetUsers.enthusiasts.title}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.targetUsers.enthusiasts.list.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            {t.howToUse.title}
          </h2>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-blue-100"></div>
            <div className="space-y-8">
              {t.howToUse.steps.map((step, index) => (
                <div key={index} className="relative pl-16">
                  <div className="absolute left-4 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {`${t.howToUse.stepPrefix} ${index + 1}`}
                  </h3>
                  <p className="text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              OptiPrompt Pro
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            {t.footer.slogan}
          </p>
          <p className="text-gray-500">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
