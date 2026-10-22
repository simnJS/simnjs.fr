import { useTerm } from '../../i18n/term'
import { Window } from './Window'
import { PromptHeader, PromptLine } from './Prompt'

export function NotFoundPage() {
  const t = useTerm()
  const path = typeof window === 'undefined' ? '' : window.location.pathname
  return (
    <Window tabs={false}>
      <main>
        <PromptHeader />
        <PromptLine>
          <span className="text-yellow">cd</span> <span suppressHydrationWarning>{path}</span>
        </PromptLine>
        <h1 className="term-line font-normal text-red">404: {t.notFound}</h1>
        <div className="term-line mt-4">
          <a href="/" className="text-blue underline decoration-transparent underline-offset-4 hover:decoration-current">
            cd ~ <span className="text-muted"># {t.back}</span>
          </a>
        </div>
      </main>
    </Window>
  )
}
