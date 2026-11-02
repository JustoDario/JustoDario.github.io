import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './en.js'
import { es } from './es.js'

const dictionaries = { en, es }
const STORAGE_KEY = 'portfolioLang' // same key as the previous site

function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStored)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dictionaries[lang]['meta.title']
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Storage can be unavailable in private browsing; the choice just won't persist.
    }
  }, [lang])

  const toggle = useCallback(() => setLang((current) => (current === 'en' ? 'es' : 'en')), [])

  const value = useMemo(
    () => ({
      lang,
      toggle,
      t: (key) => dictionaries[lang][key], // interface strings
      l: (field) => field?.[lang], // localised content fields
    }),
    [lang, toggle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
