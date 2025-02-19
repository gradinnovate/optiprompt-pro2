'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageKey, DEFAULT_LANGUAGE, getBrowserLanguage } from '@/config/languages';

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageKey>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 