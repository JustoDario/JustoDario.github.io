import { useState } from 'react'
import { publications } from '../data/entries.js'
import { profile, skills } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { assetUrl } from '../lib/assetUrl.js'
import { CopyIcon, ExternalIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons.jsx'

export function Section({ id, children, wide = false, carousel = false }) {
  const { t } = useLanguage()
  const className = `section${wide ? ' section--wide' : ''}${carousel ? ' section--carousel' : ''}`
  return (
    <section id={id} className={className} aria-labelledby={`${id}-title`}>
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

export function Publications() {
  const { l } = useLanguage()
  return (
    <Section id="publications">
      {publications.map((item) => (
        <article className="panel entry" key={item.id}>
          <span className="tag">{l(item.status)}</span>
          <h3>{item.title}</h3>
          <p className="entry__role">{l(item.role)}</p>
          <p>{l(item.venue)}</p>
          <p>{l(item.collaboration)}</p>
          <a className="button" href={item.link.url} target="_blank" rel="noreferrer">
            {l(item.link.label)} <ExternalIcon />
          </a>
        </article>
      ))}
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

// One line typed out when the section is first reached. The text is always in the page:
// only its width is animated, so readers and copy and paste never depend on the effect.
function TypedLine({ children, className = '', delay = 0 }) {
  return (
    <span
      className={`terminal__line terminal__line--typed ${className}`}
      style={{ '--chars': children.length, '--delay': `${delay}s` }}
    >
      {children}
    </span>
  )
}

export function Contact() {
  const { t } = useLanguage()
  const { activeSection } = useNavigation()
  const [status, setStatus] = useState('idle')
  const [reached, setReached] = useState(false)
  if (activeSection === 'contact' && !reached) setReached(true)

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
      <div className={`panel contact terminal${reached ? ' is-reached' : ''}`}>
        <div className="terminal__bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <code>justo@coco: ~</code>
        </div>
        <div className="terminal__body">
          <code className="terminal__screen">
            <TypedLine className="terminal__command">{'ros2 topic echo /justo/contact --once'}</TypedLine>
            <TypedLine className="contact__email" delay={1}>{`data: "${profile.email}"`}</TypedLine>
            <span className="terminal__line terminal__line--late terminal__line--dim">---</span>
            <span className="terminal__line terminal__line--late terminal__line--comment"># {t('contact.intro')}</span>
          </code>
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
            {status !== 'idle' && (
              <>
                <span className={status === 'copied' ? 'terminal__ok' : 'terminal__warn'}>
                  {status === 'copied' ? '[INFO]' : '[WARN]'}
                </span>{' '}
                {t(`contact.${status}`)}
              </>
            )}
          </p>
        </div>
      </div>
    </Section>
  )
}
