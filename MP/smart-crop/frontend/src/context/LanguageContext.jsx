import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('smartcrop_lang') || 'en'
  })

  // Sync state changes to i18n
  useEffect(() => {
    localStorage.setItem('smartcrop_lang', language)
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
