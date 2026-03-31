import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import hiTranslations from './locales/hi.json'
import taTranslations from './locales/ta.json'

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      ta: { translation: taTranslations }
    },
    fallbackLng: 'en',
    debug: false,
    
    // We explicitly set the localStorage key to match what we already
    // used in LanguageContext to ensure a smooth transition
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'smartcrop_lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  })

export default i18n
