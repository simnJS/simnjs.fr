import { useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import type { Dictionary } from '../i18n/translations'
import { CLIENTS, type Client } from '../content/clients'

// Les logos arrivent dans des formats hétérogènes : on normalise leur emprise
// pour qu'aucun ne domine visuellement le mur.
const LOGO_SHAPE = {
  wide: 'max-h-11 w-auto max-w-[78%] object-contain',
  square: 'h-16 w-16 object-contain',
  tile: 'h-16 w-16 border-2 border-ink object-cover',
} as const

export function Clients({ t, index }: { t: Dictionary; index: string }) {
  if (CLIENTS.length === 0) return null

  return (
    <section id="clients" className="bg-grid-ink border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle index={index} title={t.sections.clients} />
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-ink/70">
          {t.clients.subtitle}
        </p>

        <div
          data-anim="client-grid"
          className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {CLIENTS.map((c) => (
            <ClientCard key={c.name} client={c} />
          ))}
        </div>

        <ClientCta label={t.clients.cta} />
      </div>
    </section>
  )
}

function ClientCard({ client }: { client: Client }) {
  // Le logo peut manquer (fichier pas encore déposé) : on retombe alors sur
  // une plaque typographique aux couleurs du client.
  const [logoFailed, setLogoFailed] = useState(false)
  const hasLogo = Boolean(client.logo) && !logoFailed

  const cardClass =
    'group relative block border-2 border-ink bg-bg shadow-[6px_6px_0_0_var(--color-ink)] transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none'

  const inner = (
    <>
      <div
        className={`relative grid aspect-[3/2] place-items-center overflow-hidden px-5 ${hasLogo ? '' : client.accent}`}
      >
        {hasLogo ? (
          <img
            src={client.logo}
            alt={client.name}
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className={`grayscale transition duration-200 group-hover:grayscale-0 ${LOGO_SHAPE[client.shape ?? 'wide']}`}
          />
        ) : (
          <span className="text-balance text-center font-display text-lg leading-none tracking-tight">
            {client.name}
          </span>
        )}
        {client.url && (
          <ArrowUpRight
            size={18}
            strokeWidth={3}
            className="absolute right-2 top-2 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        )}
        {/* Étiquette du nom : glisse depuis le bas au survol. Inutile sur la
            plaque typographique, qui affiche déjà le nom en grand. */}
        {hasLogo && (
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 translate-y-full border-t-2 border-ink bg-ink px-2 py-1.5 text-center font-display text-xs leading-tight text-bg transition-transform duration-200 ease-out group-hover:translate-y-0"
          >
            {client.name}
          </span>
        )}
      </div>
      <div className={`${client.accent} h-2 border-t-2 border-ink`} />
    </>
  )

  if (client.url) {
    return (
      <a
        data-anim="client-card"
        href={client.url}
        target="_blank"
        rel="noreferrer"
        aria-label={client.name}
        className={cardClass}
      >
        {inner}
      </a>
    )
  }
  return (
    <div data-anim="client-card" className={cardClass}>
      {inner}
    </div>
  )
}

function ClientCta({ label }: { label: string }) {
  return (
    <a
      data-anim="client-cta"
      href="#contact"
      onClick={(e) => {
        e.preventDefault()
        document
          .getElementById('contact')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      className="group mt-5 flex items-center justify-center gap-3 border-2 border-dashed border-ink bg-bg/50 py-5 font-display text-lg transition-all hover:border-solid hover:bg-yellow hover:shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <Plus
        size={20}
        strokeWidth={3}
        className="transition-transform group-hover:rotate-90"
      />
      {label}
    </a>
  )
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div data-anim="section-title" className="flex items-end gap-4">
      <span className="font-mono text-sm text-ink/60">// {index}</span>
      <h2 className="font-display text-4xl leading-none md:text-6xl">{title}</h2>
    </div>
  )
}
