// ─── Édite ici pour ajouter/retirer des clients ─────────────────────────────
// Une entrée par client. La section « Ils m'ont fait confiance » disparaît
// automatiquement de la page si la liste est vide.
//
// logo   : fichier déposé dans public/clients/ (SVG de préférence, sinon PNG
//          transparent). Si le fichier est absent ou ne charge pas, la carte
//          bascule sur une plaque typographique colorée — rien ne casse.
// accent : bg-yellow | bg-coral | bg-cyan | bg-violet (liseré de la carte, et
//          fond de la plaque typographique quand il n'y a pas de logo).
// url    : optionnel. Rend la carte cliquable vers le site du client.
// shape  : cale la taille du logo pour que le mur reste homogène.
//          absent   → logo large (type bandeau), contraint en hauteur ;
//          'square' → logo carré transparent, rendu plus grand ;
//          'tile'   → image opaque (photo, avatar), recadrée et encadrée.

export type Client = {
  name: string
  logo?: string
  url?: string
  accent: string
  shape?: 'square' | 'tile'
}

export const CLIENTS: Client[] = [
  {
    name: 'Lofi Girl',
    logo: '/clients/lofi-girl.svg',
    url: 'https://lofigirl.com/',
    accent: 'bg-violet',
  },
  {
    name: 'Epic Games',
    logo: '/clients/epic-games.svg',
    url: 'https://www.epicgames.com/',
    accent: 'bg-yellow',
    shape: 'square',
  },
  {
    name: 'Banco de Chile',
    logo: '/clients/banco-de-chile.png',
    url: 'https://www.bancochile.cl/',
    accent: 'bg-cyan',
    shape: 'square',
  },
  {
    name: 'Chhetz Creative',
    logo: '/clients/chhetz-creative.jpg',
    accent: 'bg-coral',
    shape: 'tile',
  },
]
