import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  type Language,
  type Translations,
  translations,
  getStoredLanguage,
  setStoredLanguage,
} from '../lib/i18n'

interface LanguageContextValue {
  language: Language
  t: Translations
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(getStoredLanguage)

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang)
    setStoredLanguage(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr'
      setStoredLanguage(next)
      return next
    })
  }, [])

  const value: LanguageContextValue = {
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
