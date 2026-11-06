# 2026-11-06 — Brainstorming : Invoice app (Guru, premium)

> SDL-FM 1.6.0, Pré-dev 1 et 2. Étape F de la remise à niveau (Pro) : premier des 2 challenges Guru (+200 points chacun ; 375 → 575, puis 775 avec le Kanban : niveau 4 à 600). Challenge : https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl

## Pré-dev 1 : choix de Koya (2026-11-06)

| # | Question | Options | Décision |
|---|---|---|---|
| P1 | Périmètre | Front + localStorage ; full-stack ; front seul | **Front + localStorage** : tout le brief et le premier bonus (les changements restent après rechargement) ; GitHub Pages |
| P2 | Pile | Svelte 5 + Vite ; JavaScript sans cadriciel | **Svelte 5 + Vite** : composants et état réactif ; cohérent avec LaunchKit (SvelteKit) dans le portfolio ; Tailwind v4, Playwright et règles FM gardés |
| P3 | Penpot | Un fichier « FM Guru » ; un fichier par Guru | **Un fichier « FM Guru »**, une page par Guru ; dans les faits, Koya a créé un fichier « invoice-app » (voir G2) |
| P4 | Démarrage FM et téléchargements | Maintenant ; après G1 | **Maintenant** : challenge démarré (1 des 2 crédits premium du mois ; il en reste 1, recharge le 2026-12-06) ; `invoice-app.zip` (76 Ko) et `invoice-app-figma.zip` (788 Ko) téléchargés depuis frontendmentor.io |

Choix déjà faits pour l'étape F : Guru Invoice app puis Kanban ; fichiers Figma pour ces 2 Guru (`frontmentor/specs/TASKS.md`).

## Ce que contient le challenge

- **Starter** : `index.html`, `invoice.html` (contenu pré-écrit), `data.json` (7 factures), `assets/` (icônes, illustration, avatar, logo), README, modèle de README, `AGENTS.md` et `CLAUDE.md`. **Aucune image de maquette ni guide de style** : tout est dans le fichier Figma.
- **Fichier Figma** : `invoice-app.fig` est une archive (`canvas.fig` au format « fig-kiwi », une image). Lu **sans Figma** par un décodeur kiwi écrit pour l'occasion (format public : schéma binaire + message, blocs compressés en deflate) : **54 écrans** (desktop 1440, tablette 768, mobile 375 ; clair et sombre ; liste, liste vide, facture, création, modification, suppression ; états survol, actif et erreur) et une page « Design System ».
- **Mesures exactes** : 12 couleurs (`#7c5dfa`, `#9277ff`, `#1e2139`, `#252945`, `#dfe3fa`, `#888eb0`, `#7e88c3`, `#0c0e16`, `#ec5757`, `#ff9797`, `#f8f8fb`, `#141625`) ; une police, League Spartan (Bold, Medium, SemiBold) ; 6 styles de texte (Heading L 36/100 %, Heading M 24/100 %, Heading S 15/24, Heading S variante 15/15, Body 13/18, Body variante 13/15, avec leur espacement des lettres).
- **Comportements attendus** (README) : identifiant de 2 lettres majuscules et 4 chiffres ; « Save as Draft » accepte les champs vides, « Save & Send » les exige et passe en « pending » ; l'échéance suit la date et les conditions de paiement ; total = somme des lignes ; « Save Changes » exige tous les champs et fait passer un brouillon en « pending » ; « Cancel » annule ; « Mark as Paid » ; confirmation avant suppression ; date et liste déroulante sans style sur mesure possible.

## Règles particulières à ce challenge

- **Maquettes premium non publiées** (README de FM) : le `.fig`, l'aperçu, les rendus et toute image de référence restent dans `design/`, ignoré par git. Les tests visuels lisent ces références en local et ne tournent pas sur le site en ligne.
- **`AGENTS.md` du starter** (donnée, rangée dans `specs/reference/starter-AGENTS.md`) : pour un Guru, FM conseille l'IA en partenaire qui guide plutôt qu'en auteur de la solution. Choix de Koya : « Claude écrit le code » ; la section « AI Collaboration » du README le dira.

## Pré-dev 2 : plan validé (G1, 2026-11-06)

Koya : « Je valide (G1) » (schéma sur le canevas partagé, zone x 106 200). **Qui fait quoi :** Claude écrit tout le code ; Koya valide l'analyse (G2) et la maquette (G3), donne son accord au verrou, à la publication et à la soumission ; Koya crée le fichier Penpot « FM Guru ».

| Phase | Contenu |
|---|---|
| 0 | Starter importé, git, Vite + Svelte 5 + Tailwind v4, outils de test ; consignes IA rangées en données |
| 1 | `tokens.md` lu dans le `.fig` ; rendu des écrans de référence depuis le `.fig` (hors dépôt) |
| 2 | Analyse Excalidraw (G2) : écrans, flux, règles, questions |
| 3 | Maquette Penpot (G3) : bibliothèque, composants, écrans clés ; mesures du `.fig` |
| 4 et 5 | Spec, tests de parcours complets au rouge, ADR ; 🔒 verrou (accord) |
| 6 à 10 | Code (un commit par partie), tests, parcours réel, README (une capture par état) |
| 11 à 13 | Dépôt public `invoice-app`, `gh-pages`, soumission FM (accord), rapport IA trié |

Prérequis vérifiés le 2026-11-06 : `gh` connecté (`repo`, `workflow`) ; dépôts `invoice-app` et `kanban-task-management` libres ; Java 21 et Chromium de Playwright présents ; plugin Penpot connecté (fichier « FM Guru » à créer par Koya) ; Pro : une analyse IA par solution soumise.

## Analyse validée (G2, 2026-11-06)

Koya : « Je valide (G2) ». Analyse : `specs/visuel/invoice-app-analyse.md` et `.png`. **Toutes les propositions sont retenues** : Q-A1 à Q-A6 (teintes AA en thème clair ; `#7a5afa` et `#e62525` dans les deux thèmes, où le texte blanc était aussi sous AA) et Q-B1 à Q-B15 (adresses par ancre, formulaire et suppression en `dialog`, date et Payment Terms natifs, filtre multiple, textes mobiles de la maquette, Mark as Paid pour `pending` seulement, facture payée gardée payée, e-mail et nombres validés, `en-GB`, thème de l'appareil puis choix gardé, liste vide filtrée, compteur cohérent, relecture de `data.json`, Price à 2 décimales, focus 2 px).

Penpot : Koya a créé le fichier « invoice-app » (au lieu de « FM Guru ») et y a connecté le plugin ; la maquette y est dessinée.

## Maquette validée (G3, 2026-11-06)

Koya : « Je valide (G3) ». Maquette : `specs/visuel/penpot/maquette.md`. **Toutes les propositions sont retenues** :

| # | Point | Décision |
|---|---|---|
| G3-1 | États sous AA | Q-A7 survol des boutons 1 et 2 `#6742ff` ; Q-A8 survol de Delete `#c41e1e` ; Q-A9 texte des boutons 3 et 6 survolés (clair) `#515eae` ; Q-A10 en sombre, textes violets `#9277ff`, gris `#8690c7` et `#8c92b3` |
| G3-2 | Marge | Violet 01 `#7757fa` (4,64:1) |
| G3-3 | Focus | Champs : bordure active `#9277ff` ; boutons et liens : contour 2 px décalé de 2 px (`#7757fa` clair, `#9277ff` sombre) |
| G3-4 | Espacement des lettres | Valeurs du `.fig` dans le code |
| G3-5 | Écrans comparés | 21 : liste, liste vide, facture, formulaire de création complet, suppression aux 3 largeurs en clair ; liste et facture aux 3 largeurs en sombre |
| G3-6 | Seuil visuel | 5 % par écran, recalibré en Phase 5 si besoin (écart mesuré + 1 point, accord de Koya) |
