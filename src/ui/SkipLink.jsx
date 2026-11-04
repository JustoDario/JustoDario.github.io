import { useLanguage } from '../i18n/LanguageProvider.jsx'

// First stop for the keyboard. Moves focus without a hash, which would be a deep link.
export default function SkipLink() {
  const { t } = useLanguage()
  return (
    <a
      className="skip-link"
      href="#main"
      onClick={(event) => {
        event.preventDefault()
        document.getElementById('main')?.focus()
      }}
    >
      {t('nav.skip')}
    </a>
  )
}
