export const LANGUAGES = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
} as const;

export type LanguageKey = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: LanguageKey = 'en';

export function getBrowserLanguage(): LanguageKey {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0];
  return (browserLang in LANGUAGES ? browserLang : DEFAULT_LANGUAGE) as LanguageKey;
} 