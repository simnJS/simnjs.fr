import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Window } from '../components/term/Window'
import { PromptHeader, PromptLine } from '../components/term/Prompt'
import { Fastfetch } from '../components/term/Fastfetch'
import { Shell } from '../components/term/Shell'
import {
  About,
  ActivityLog,
  Clients,
  Contact,
  Contributions,
  Exit,
  Projects,
  Stack,
} from '../components/term/Sections'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://simnjs.fr' }],
  }),
})

// Toute la page est une session de terminal : le fastfetch d'ouverture, le
// shell interactif, puis les commandes déjà exécutées qui font les sections.
function Home() {
  return (
    <Window>
      <main>
        <section id="top">
          <PromptHeader />
          <PromptLine>
            <span className="typed text-yellow" style={{ '--chars': 9 } as CSSProperties}>
              fastfetch
            </span>
          </PromptLine>
          <Fastfetch heading />
          <Shell />
        </section>
        <Projects />
        <Clients />
        <Stack />
        <Contributions />
        <ActivityLog />
        <About />
        <Contact />
        <Exit />
      </main>
    </Window>
  )
}
