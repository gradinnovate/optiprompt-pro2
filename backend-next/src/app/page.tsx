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
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              {t.buttons.getStarted}
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              {t.buttons.learnMore}
            </button>
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
