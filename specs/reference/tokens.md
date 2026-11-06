# Tokens — Invoice app (lus dans le fichier Figma)

> SDL-FM 1.6.0, Phase 1. Source : `design/invoice-app.fig` (hors dépôt), page « Design System » et styles du fichier, lus par le décodeur kiwi (`specs/brainstorming/2026-11-06-invoice-app.md`). Ce fichier ne contient que ce que donne la maquette ; les mesures d'écran sont relevées en Phase 2.

## Couleurs (12)

| # | Valeur | RGB | HSL |
|---|---|---|---|
| 01 | `#7c5dfa` | 124, 93, 250 | 252°, 94 %, 67 % |
| 02 | `#9277ff` | 146, 119, 255 | 252°, 100 %, 73 % |
| 03 | `#1e2139` | 30, 33, 57 | 233°, 31 %, 17 % |
| 04 | `#252945` | 37, 41, 69 | 233°, 30 %, 21 % |
| 05 | `#dfe3fa` | 223, 227, 250 | 231°, 73 %, 93 % |
| 06 | `#888eb0` | 136, 142, 176 | 231°, 20 %, 61 % |
| 07 | `#7e88c3` | 126, 136, 195 | 231°, 37 %, 63 % |
| 08 | `#0c0e16` | 12, 14, 22 | 228°, 29 %, 7 % |
| 09 | `#ec5757` | 236, 87, 87 | 0°, 80 %, 63 % |
| 10 | `#ff9797` | 255, 151, 151 | 0°, 100 %, 80 % |
| 11 | `#f8f8fb` (fond clair) | 248, 248, 251 | 240°, 27 %, 98 % |
| 12 | `#141625` | 20, 22, 37 | 233°, 30 %, 11 % |

Écart de la maquette : la page « Design System » écrit `#9277FF` sous la couleur 10, dont le RGB et le style du fichier donnent `#FF9797` ; on retient `#ff9797`. Les couleurs de statut (paid, pending, draft) et les fonds du thème sombre seront relevés écran par écran en Phase 2.

## Typographie

Une seule famille : **League Spartan** (Google Fonts), graisses Bold (700), SemiBold (600), Medium (500).

| Style | Graisse | Taille | Interligne | Espacement des lettres |
|---|---|---|---|---|
| Heading L | Bold | 36 px | 100 % (la page Design System dit 33 px) | −1,125 px |
| Heading M | Bold | 24 px | 100 % (la page dit 22 px) | −0,75 px |
| Heading S | Bold | 15 px | 24 px | −0,25 px |
| Heading S (variante) | Bold | 15 px | 15 px | −0,25 px |
| Body | Medium | 13 px | 18 px | −0,1 px |
| Body (variante) | Medium | 13 px | 15 px | −0,1 px (la page dit −0,25) |

Tailles relevées dans les écrans en plus des styles : Bold 18, 28 et 80 px, SemiBold 10 px (à situer en Phase 2). Les écarts entre la page « Design System » et les styles du fichier sont tranchés en Phase 2 sur les écrans eux-mêmes.

## Largeurs des maquettes

Desktop 1440 px · tablette 768 px · mobile 375 px. 54 écrans : 6 vues (liste, liste vide, facture, création, modification, suppression), en clair et en sombre, aux 3 largeurs, plus des écrans d'états (survol, actif, erreur, formulaire vide, défilement).
