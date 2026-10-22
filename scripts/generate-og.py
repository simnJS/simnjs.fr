"""Génère les images Open Graph (1200x630) du portfolio dans le DA terminal.
Usage, depuis la racine du repo : python scripts/generate-og.py .
Demande Pillow et JetBrainsMono Nerd Font Mono installée (chemin FONTS)."""
import math
import pathlib
import re
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = pathlib.Path(sys.argv[1])
PUB = REPO / 'public'
FONTS = pathlib.Path(r'C:/Users/simnJS/AppData/Local/Microsoft/Windows/Fonts')
S = 2  # suréchantillonnage, réduit à la fin pour lisser
W, H = 1200, 630

CHROME, BG, LINE = '#0b0b10', '#101016', '#26263a'
FG, DIM, MUTED = '#dcdce4', '#9a9aae', '#6c6c80'
PINK, CAT = '#f5a3c7', '#ececf4'
PRIDE = ['#f07a8c', '#f5b98a', '#f2d38a', '#9fd8a4', '#8fb4f5', '#c9a3f5']


def font(weight, size):
    return ImageFont.truetype(str(FONTS / f'JetBrainsMonoNerdFontMono-{weight}.ttf'), size * S)


def s(*v):
    return [x * S for x in v]


def text(d, xy, t, f, fill):
    d.text(s(*xy), t, font=f, fill=fill)
    return xy[0] + d.textlength(t, font=f) / S


def window(tab):
    im = Image.new('RGB', s(W, H), CHROME)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle(s(36, 36, W - 36, H - 36), radius=18 * S, fill=BG, outline=LINE, width=2 * S)
    d.rounded_rectangle(s(37, 37, W - 37, 92), radius=17 * S, fill=CHROME)
    d.rectangle(s(37, 70, W - 37, 92), fill=CHROME)
    d.line(s(37, 92, W - 37, 92), fill=LINE, width=2 * S)
    d.rounded_rectangle(s(52, 48, 300, 100), radius=9 * S, fill=BG)
    d.rectangle(s(52, 80, 300, 92), fill=BG)
    text(d, (70, 55), '❯', font('Bold', 22), PINK)
    text(d, (98, 56), tab, font('Regular', 21), FG)
    # Commandes de fenêtre, comme dans Windows Terminal.
    cy = 66
    d.line(s(1020, cy, 1036, cy), fill=MUTED, width=2 * S)
    d.rectangle(s(1062, cy - 8, 1078, cy + 8), outline=MUTED, width=2 * S)
    d.line(s(1104, cy - 8, 1120, cy + 8), fill=MUTED, width=2 * S)
    d.line(s(1104, cy + 8, 1120, cy - 8), fill=MUTED, width=2 * S)
    return im, d


def pride(d, x, y, w=34, h=22):
    for i, c in enumerate(PRIDE):
        d.rectangle(s(x, y + i * h / 6, x + w, y + (i + 1) * h / 6), fill=c)


def boykisser(d, box_x, box_y, width):
    src = (REPO / 'src/term/boykisser.ts').read_text(encoding='utf-8')
    art = re.search(r'`([^`]*)`', src).group(1).split('\n')
    cw = width / max(len(l) for l in art)
    ch = cw * 18 / 8.4
    r = max(1.2, cw * 0.17)
    offs = [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (0, 3), (1, 3)]
    for row, line in enumerate(art):
        for col, c in enumerate(line):
            bits = ord(c) - 0x2800
            if not 0 < bits < 256:
                continue
            for b, (dc, dr) in enumerate(offs):
                if bits >> b & 1:
                    x = box_x + col * cw + cw * (0.25 + 0.5 * dc)
                    y = box_y + row * ch + ch * (0.125 + 0.25 * dr)
                    d.ellipse(s(x - r, y - r, x + r, y + r), fill=CAT)
    return len(art) * ch


def chip(d, x, y, label):
    f = font('Regular', 21)
    w = d.textlength(label, font=f) / S + 32
    d.rounded_rectangle(s(x, y, x + w, y + 40), radius=20 * S, outline=LINE, width=2 * S)
    text(d, (x + 16, y + 8), label, f, DIM)
    return x + w + 12


def finish(im, name):
    im.resize((W, H), Image.LANCZOS).save(PUB / name, optimize=True)
    print('wrote', name)


# ─── Accueil ────────────────────────────────────────────────────────────────
im, d = window('simnJS')
x = text(d, (88, 132), '❯ ', font('Bold', 26), PINK)
text(d, (x, 132), 'whoami', font('Regular', 26), DIM)
end = text(d, (82, 160), 'simnJS', font('ExtraBold', 150), FG)
d.rectangle(s(end + 10, 196, end + 26, 314), fill=PINK)
x = text(d, (88, 352), 'Simon GAY, software engineer, Lyon', font('Regular', 27), DIM)
pride(d, x + 14, 358)
cx = 88
for label in ['UEFN', 'Roblox', 'Stake Engine', 's&box']:
    cx = chip(d, cx, 418, label)
text(d, (88, 512), 'simnjs.fr', font('Bold', 28), PINK)
boykisser(d, 760, 160, 360)
finish(im, 'og.png')


# ─── Études de cas ─────────────────────────────────────────────────────────
def wrap(t, f, width, d):
    words, lines, cur = t.split(), [], ''
    for w_ in words:
        nxt = f'{cur} {w_}'.strip()
        if d.textlength(nxt, font=f) / S > width and cur:
            lines.append(cur)
            cur = w_
        else:
            cur = nxt
    return lines + ([cur] if cur else [])


def panel_image(im, path, box, fit, bg=None):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    tile = Image.new('RGB', (w * S, h * S), bg or BG)
    pic = Image.open(path).convert('RGBA')
    if fit == 'cover':
        k = max(w * S / pic.width, h * S / pic.height)
        pic = pic.resize((math.ceil(pic.width * k), math.ceil(pic.height * k)), Image.LANCZOS)
        tile.paste(pic, ((w * S - pic.width) // 2, (h * S - pic.height) // 2), pic)
    else:
        side = int(min(w, h) * S * 0.86)
        pic = pic.resize((side, side), Image.LANCZOS)
        # Bords du logo fondus dans le fond, comme sur le site.
        mask = Image.new('L', (side, side), 0)
        md = ImageDraw.Draw(mask)
        for i in range(60):
            rad = side / 2 * (1 - i / 60 * 0.2)
            a = int(255 * min(1, (i + 1) / 60 * 1.6))
            md.ellipse((side / 2 - rad, side / 2 - rad, side / 2 + rad, side / 2 + rad), fill=a)
        alpha = Image.composite(pic.getchannel('A'), Image.new('L', (side, side), 0), mask)
        pic.putalpha(alpha)
        tile.paste(pic, ((w * S - side) // 2, (h * S - side) // 2), pic)
    rounded = Image.new('L', tile.size, 0)
    ImageDraw.Draw(rounded).rounded_rectangle((0, 0, tile.width - 1, tile.height - 1), radius=14 * S, fill=255)
    im.paste(tile, (x0 * S, y0 * S), rounded)
    ImageDraw.Draw(im).rounded_rectangle(s(x0, y0, x1, y1), radius=14 * S, outline=LINE, width=2 * S)


def panel_chart(d, box):
    x0, y0, x1, y1 = box
    d.rounded_rectangle(s(x0, y0, x1, y1), radius=14 * S, fill=BG, outline=LINE, width=2 * S)
    text(d, (x0 + 24, y0 + 22), 'players online, last 24h', font('Regular', 19), MUTED)
    n, gap = 24, 5
    bw = (x1 - x0 - 48 - gap * (n - 1)) / n
    base, top = y1 - 60, y0 + 70
    for h_ in range(n):
        v = 0.18 + 0.82 * max(0, math.sin(((h_ - 7) / 24) * math.pi * 2 - 0.4)) ** 1.6
        bx = x0 + 24 + h_ * (bw + gap)
        d.rounded_rectangle(s(bx, base - (base - top) * v, bx + bw, base), radius=3 * S,
                            fill=PINK if v > 0.85 else '#5e3f52')
    for i, lab in enumerate(['00h', '06h', '12h', '18h', '24h']):
        text(d, (x0 + 24 + i * (x1 - x0 - 80) / 4, y1 - 44), lab, font('Regular', 17), MUTED)


CASES = [
    ('play-and-chill', 'Play & Chill', 'Casino, studio', 2025, 'Mon studio casino. Des slots originaux pour Stake Engine, sur notre propre moteur front Pixi.js.',
     ('logo', 'projects/playandchill.png', '#113eff')),
    ('playn-chill', "Play'n Chill", 'Roblox, studio', 2026, 'Mon studio Roblox : un nouveau jeu toutes les six à huit semaines.',
     ('cover', 'projects/planet-tycoon.png', None)),
    ('stakeplayercount', 'Engine Players', 'Stake Engine, analytics', 2025, 'Tracker temps réel des jeux Stake Engine : joueurs, turnover, heures de pointe.',
     ('chart', None, None)),
    ('tacline', 'Tacline', 'Airsoft, SaaS', 2026, 'La plateforme qui connecte joueurs et organisateurs d’airsoft.',
     ('cover', 'projects/tacline.png', None)),
]

for slug, title, tag, year, desc, (kind, img, bg) in CASES:
    im, d = window(f'{slug}.md')
    x = text(d, (88, 128), '❯ ', font('Bold', 22), PINK)
    x = text(d, (x, 128), 'less ', font('Regular', 22), '#f2d38a')
    text(d, (x, 128), f'{slug}.md', font('Regular', 22), DIM)
    # Le titre rapetisse s'il déborde sur le visuel de droite.
    size = 62
    while d.textlength(f'# {title}', font=font('ExtraBold', size)) / S > 560:
        size -= 2
    x = text(d, (84, 178 + (62 - size) / 2), '# ', font('ExtraBold', size), MUTED)
    text(d, (x, 178 + (62 - size) / 2), title, font('ExtraBold', size), PINK)
    text(d, (88, 272), f'{tag}, {year}', font('Regular', 24), DIM)
    f = font('Regular', 24)
    for i, l in enumerate(wrap(desc, f, 520, d)[:4]):
        text(d, (88, 326 + i * 36), l, f, FG)
    text(d, (88, 520), f'simnjs.fr/work/{slug}', font('Bold', 24), PINK)
    box = (680, 128, 1124, 554)
    if kind == 'chart':
        panel_chart(d, box)
    else:
        panel_image(im, PUB / img, box, 'cover' if kind == 'cover' else 'logo', bg)
        d = ImageDraw.Draw(im)
    finish(im, f'og-{slug}.png')
