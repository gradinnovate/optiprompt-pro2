import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
  ];

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm text-gray-600 dark:text-gray-300">
        {t('language')}:
      </label>
      <select
        id="language-select"
        name="language"
        aria-label={t('language')}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 