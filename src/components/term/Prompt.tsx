import type { ReactNode } from 'react'
import { GitBranch } from 'lucide-react'
import { lyonTime, useNow } from './bits'

// Le prompt Oh My Posh « boykisser » : dossier en bleu, « on » atténué,
// branche en rose, heure à droite, puis ❯ sur la ligne suivante.

export function PromptHeader({ path = '~\\simnJS' }: { path?: string }) {
  const now = useNow(15_000)
  return (
    <div className="term-line flex justify-between gap-4">
      <span>
        <span className="text-blue">{path}</span>
        <span className="text-muted"> on </span>
        <span className="text-pink">
          <GitBranch size={13} strokeWidth={2.2} className="mr-[0.5ch] inline align-[-0.1em]" aria-hidden />
          main
        </span>
      </span>
      <span className="text-muted" title="Lyon">
        {now === null ? '' : lyonTime(now)}
      </span>
    </div>
  )
}

export function PromptLine({ children }: { children?: ReactNode }) {
  return (
    <div className="term-line">
      <span className="text-pink" aria-hidden>
        ❯{' '}
      </span>
      {children}
    </div>
  )
}

/** En-tête de section : une commande déjà exécutée. */
export function CommandHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="mt-14">
      <PromptHeader />
      <h2 id={id} className="term-line font-normal">
        <span className="text-pink" aria-hidden>
          ❯{' '}
        </span>
        <span className="text-yellow">{children}</span>
      </h2>
    </div>
  )
}
