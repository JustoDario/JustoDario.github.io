import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { ChevronDownIcon, GitHubIcon, LinkedInIcon } from './icons.jsx'

// Coco stands on the left in the 3D scene; the text sits on the right.
export default function Hero() {
  const { t, l } = useLanguage()
  return (
    <section id="home" className="section hero">
      <div className="hero__content">
        <div className="hero__intro">
          <img className="hero__photo" src={assetUrl(`media/${profile.photo.file}`)} alt={l(profile.photo.alt)} />
          <h1>{profile.name}</h1>
        </div>
        <p className="hero__subtitle">{l(profile.subtitle)}</p>
        <p className="hero__tagline">{l(profile.tagline)}</p>
        <div className="actions">
          <a className="button button--primary" href="#projects">
            {t('hero.viewWork')}
          </a>
          <a className="button" href={assetUrl(profile.cv)} target="_blank" rel="noreferrer">
            {t('hero.cv')}
          </a>
          <a className="icon-link" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a className="icon-link" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
      <a className="hero__next" href="#about" aria-label={t('hero.next')}>
        <ChevronDownIcon />
      </a>
    </section>
  )
}
