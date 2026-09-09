import React, { createContext, useContext, useMemo, useState } from 'react';

const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English', badge: 'A' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', badge: 'अ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', badge: 'అ' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const value = useMemo(() => ({
    language,
    setLanguage,
    languages: languageOptions,
    currentLanguageOption: languageOptions.find((option) => option.code === language) || languageOptions[0],
    t: (key) => key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
