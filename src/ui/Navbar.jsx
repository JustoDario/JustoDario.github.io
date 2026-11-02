import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { CloseIcon, MenuIcon } from './icons.jsx'

const LINKS = ['about', 'experience', 'projects', 'hackathons', 'education', 'skills', 'contact']

export default function Navbar() {
  const { t, toggle } = useLanguage()
  const [open, setOpen] = useState(false)
  const nav = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const closeOutside = (event) => {
      // composedPath, not contains: the clicked icon may already have been replaced.
      if (!event.composedPath().includes(nav.current)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <header className="navbar" ref={nav}>
      <a className="navbar__brand" href="#home">
        Justo
      </a>

      <nav className={`navbar__links${open ? ' is-open' : ''}`} id="nav-links" aria-label={t('nav.main')}>
        {LINKS.map((id) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {t(`nav.${id}`)}
          </a>
        ))}
      </nav>

      <div className="navbar__actions">
        <button
          type="button"
          className="navbar__button navbar__menu"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={t(open ? 'nav.closeMenu' : 'nav.openMenu')}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <button
          type="button"
          className="navbar__button"
          data-testid="lang-toggle"
          aria-label={t('nav.language')}
          onClick={toggle}
        >
          {t('nav.languageShort')}
        </button>
      </div>
    </header>
  )
}
