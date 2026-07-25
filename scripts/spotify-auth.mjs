#!/usr/bin/env node
// One-shot : récupère le refresh token Spotify à coller dans .env.
//
//   node scripts/spotify-auth.mjs
//
// Prérequis — une app créée sur https://developer.spotify.com/dashboard,
// avec exactement « http://127.0.0.1:8888/callback » en Redirect URI.
// Spotify refuse http://localhost depuis 2025 : seule la loopback littérale
// est acceptée en clair.
//
// À lancer une seule fois. Le refresh token obtenu ne tourne pas sur ce flow
// (Authorization Code confidentiel), il reste valable tant que l'accès n'est
// pas révoqué depuis le compte Spotify.

import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const PORT = 8888
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played']

function readEnvFile() {
  try {
    const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    const out = {}
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
    return out
  } catch {
    return {}
  }
}

const env = { ...readEnvFile(), ...process.env }
const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\n  Il manque SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.\n' +
      '  Crée une app sur https://developer.spotify.com/dashboard,\n' +
      `  déclare « ${REDIRECT_URI} » en Redirect URI,\n` +
      '  puis renseigne les deux valeurs dans .env avant de relancer.\n',
  )
  process.exit(1)
}

const state = randomBytes(8).toString('hex')
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    state,
  })

function page(title, body) {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="font-family:ui-monospace,monospace;background:#FAF7F0;color:#0A0A0A;padding:3rem;line-height:1.6">
<div style="max-width:34rem;border:2px solid #0A0A0A;background:#fff;padding:1.5rem;box-shadow:6px 6px 0 0 #0A0A0A">
${body}</div></body>`
}

let done = false

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  if (url.pathname !== '/callback') {
    res.writeHead(404).end()
    return
  }

  const fail = (msg) => {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(page('Échec', `<h2>Échec</h2><p>${msg}</p>`))
    console.error(`\n  ✗ ${msg}\n`)
    server.close()
    process.exit(1)
  }

  const error = url.searchParams.get('error')
  if (error) return fail(`Spotify a renvoyé : ${error}`)
  if (url.searchParams.get('state') !== state) {
    return fail('State invalide — relance le script.')
  }
  const code = url.searchParams.get('code')
  if (!code) return fail('Pas de code dans la réponse.')

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })
    const j = await tokenRes.json()
    if (!tokenRes.ok || !j.refresh_token) {
      return fail(
        `Échange du code refusé (${tokenRes.status}) : ${j.error_description ?? j.error ?? 'raison inconnue'}`,
      )
    }

    done = true
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(
      page(
        'Terminé',
        '<h2>C\'est bon 👌</h2><p>Le refresh token est affiché dans ton terminal. Tu peux fermer cet onglet.</p>',
      ),
    )
    console.log(
      '\n  ✓ Refresh token obtenu. Colle cette ligne dans ton .env :\n\n' +
        `SPOTIFY_REFRESH_TOKEN=${j.refresh_token}\n\n` +
        '  Pense à ajouter les trois variables SPOTIFY_* dans Vercel\n' +
        '  (Project Settings → Environment Variables) pour la prod.\n',
    )
    server.close()
    process.exit(0)
  } catch (err) {
    return fail(`Erreur réseau : ${err.message}`)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(
    '\n  Ouvre cette URL dans ton navigateur pour autoriser l\'app :\n\n' +
      `  ${authUrl}\n\n` +
      '  (en attente du retour sur ' +
      REDIRECT_URI +
      '…)\n',
  )
})

// Filet de sécurité : ne pas laisser un serveur ouvert indéfiniment.
setTimeout(
  () => {
    if (!done) {
      console.error('\n  ✗ Rien reçu au bout de 5 minutes — script arrêté.\n')
      server.close()
      process.exit(1)
    }
  },
  5 * 60 * 1000,
).unref()
