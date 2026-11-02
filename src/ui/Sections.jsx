import { useState } from 'react'
import { profile, skills } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { CopyIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons.jsx'

export function Section({ id, children, wide = false }) {
  const { t } = useLanguage()
  return (
    <section id={id} className={`section${wide ? ' section--wide' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="section__content">
        <h2 id={`${id}-title`}>{t(`section.${id}`)}</h2>
        {children}
      </div>
    </section>
  )
}

export function About() {
  const { l } = useLanguage()
  return (
    <Section id="about">
      <div className="panel panel--prose">
        {profile.about.map((paragraph) => (
          <p key={paragraph.en}>{l(paragraph)}</p>
        ))}
      </div>
    </Section>
  )
}

export function Skills() {
  return (
    <Section id="skills" wide>
      <ul className="skills">
        {skills.map((skill) => (
          <li className="skill" key={skill.name}>
            <span className="skill__logo">
              <img src={assetUrl(`media/${skill.logo}`)} alt="" loading="lazy" />
            </span>
            {skill.name}
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState('idle')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setStatus('copied')
    } catch {
      setStatus('copyFailed')
    }
  }

  return (
    <Section id="contact" wide>
      <div className="panel contact">
        <p>{t('contact.intro')}</p>
        <p className="contact__email">{profile.email}</p>
        <div className="actions">
          <a className="button button--primary" href={`mailto:${profile.email}`}>
            <MailIcon /> {t('contact.send')}
          </a>
          <button type="button" className="button" onClick={copyEmail}>
            <CopyIcon /> {t('contact.copy')}
          </button>
          <a className="icon-link" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a className="icon-link" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
        <p className="contact__status" role="status">
          {status !== 'idle' && t(`contact.${status}`)}
        </p>
      </div>
    </Section>
  )
}
