import { createFileRoute } from '@tanstack/react-router'
import { Window } from '../components/term/Window'
import { Hero } from '../components/term/Hero'
import { QuakeTerminal } from '../components/term/Quake'
import {
  About,
  Activity,
  Clients,
  Contact,
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

// Une page visuelle dans une fenêtre Windows Terminal ; le vrai shell attend
// dans le tiroir « quake mode » (touche ` ou bouton terminal).
function Home() {
  return (
    <>
      <Window>
        <main>
          <Hero />
          <Projects />
          <Clients />
          <Stack />
          <Activity />
          <About />
          <Contact />
          <Exit />
        </main>
      </Window>
      <QuakeTerminal />
    </>
  )
}
