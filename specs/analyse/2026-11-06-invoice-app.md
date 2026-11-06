# 2026-11-06 — Rapport d'exécution : Invoice app

> SDL-FM 1.6.0, Phases 7 et 8. Tests sur le build de production (`vite build` + `vite preview`) ; parcours réel dans le navigateur intégré (`http://localhost:4261/invoice-app/`), à 320, 375, 768 et 1440 px, en clair et en sombre.

## 1. Tests automatiques (Phase 7)

`npm test` : **95 réussis sur 95** (1,2 min), dont le test de garde des écarts E1 et E2 ajouté après le parcours réel.

| Groupe | Scénarios | Résultat |
|---|---|---|
| Mise en page | S1 à S6 : positions du `.fig` à 1 px près (2 px pour les textes) à 1440, 768 et 375 ; tiroir, modale ; 320 à 1440 sans défilement horizontal ; garde E1 et E2 (fenêtre de 900 px : le dialogue ne défile pas, ombre du pied) | ✅ 13 / 13 |
| Liste et filtre | S7 à S9 : ordre de `data.json`, chaque combinaison du filtre, compteur, adresse, écran vide | ✅ 3 / 3 |
| Facture | S10 à S12 : chaque facture champ par champ, « Go back » avec le filtre, id inconnu, Mark as Paid | ✅ 3 / 3 |
| Formulaire | S13 à S19 : vide, erreurs de chaque champ, création complète, brouillon, e-mail et quantité, lignes, Discard et Échap | ✅ 7 / 7 |
| Modifier, payer, supprimer | S20 à S24 | ✅ 5 / 5 |
| Persistance et thème | S25 à S28 | ✅ 5 / 5 |
| Survol, mouvements, clavier | S29 à S31 : survol de chaque type d'élément (clair et sombre), `prefers-reduced-motion`, focus visible jusqu'au dernier élément et piégé dans les dialogues | ✅ 4 / 4 |
| Accessibilité | S32 : axe-core sur 4 vues × 3 largeurs × 2 thèmes ; A2 : repères et dialogues nommés | ✅ 25 / 25 |
| HTML, JS, règles FM | S33 : W3C Nu et html-validate (HTML servi et 4 vues rendues), ESLint, longueurs en `rem`, propriétés logiques, `aria-label` | ✅ 6 / 6 |
| Fitness | ADR-0004 (couleurs seulement dans les tokens), ADR-0005 (rien hors du domaine, League Spartan 500, 600, 700), ADR-0011 (aucun fichier de maquette suivi) | ✅ 3 / 3 |
| Visuel | S34 : 21 écrans comparés aux références AA rendues depuis le `.fig` | ✅ 21 / 21 |

### Comparaison visuelle (seuil 5 %)

| Écran | Desktop | Tablette | Mobile |
|---|---|---|---|
| Liste claire / sombre | 1,48 % / 1,55 % | 2,12 % / 2,22 % | 2,98 % / 3,12 % |
| Liste vide | 0,41 % | 0,57 % | 1,83 % |
| Facture claire / sombre | 0,75 % / 0,79 % | 1,19 % / 1,27 % | 2,24 % / 2,46 % |
| Formulaire de création | 1,02 % | 1,73 % | 2,43 % |
| Suppression | 0,53 % | 0,98 % | 1,88 % |

Le reste des écarts : lissage des lettres (contours de Figma contre rendu de Chromium).

## 2. Premier passage des tests sur le code

15 échecs sur 94 au premier passage, tous corrigés :

| # | Échec | Cause | Correction |
|---|---|---|---|
| T1 | Barre de statut et 1er champ du formulaire mobile 9 px trop bas (S3, S4) | « Go back » en `inline-flex` : la hauteur de ligne du parent ajoutait 9 px | `flex w-fit` |
| T2 | Boutons 2 à 4 px trop étroits (S1, S2, S3) | Chromium rend le texte un peu plus étroit que Figma | largeurs minimales de la maquette : Delete 89, Mark as Paid 131, New Invoice 150 |
| T3 | Liste mobile 4 px trop bas (S2) | bouton du filtre de 48 px au lieu de 44 | `h-11 md:h-12` |
| T4 | Détail en tablette 3 px trop court (S3) | la maquette met 50 px entre « Bill To » et les lignes en tablette, 47 en desktop | deux valeurs |
| T5 | Texte de l'écran vide introuvable (S9) | le `<br>` collait « the » et « New » dans le texte lu | espace avant le `<br>` |
| T6 | Écran vide mobile à 7,1 % (S34) | illustration réduite à 193 × 160 en mobile ; titre à 42 px dessous ; tablette et desktop recalés de 2 à 5 px | valeurs du `.fig` |
| T7 | « Back to invoices » d'un id inconnu gardait le filtre (S11) | lien vers la liste filtrée | lien vers `#/` ; « Go back » seulement avec une facture |
| T8 | Voile des dialogues en couleur écrite en dur (ADR-0004) | `rgb(0 0 0 / 0.5)` dans deux composants | token `--color-scrim` (`@theme inline`, écrit dans la règle `::backdrop`) |
| T9 | ESLint : `$state` inconnu dans les `.svelte.js` (S33) | globales des runes | réglage ESLint |
| T10 | html-validate sur les vues rendues (S33) | le DOM sérialisé écrit toujours `attr=""` et garde l'espace d'après `</body>` ; `role="presentation"` sur le filtre | réglage du test pour le DOM sérialisé (le HTML servi reste au réglage strict) ; Échap écouté sur la fenêtre, plus de rôle |
| T11 | Survol de Edit en sombre (S29) | l'aide `open()` : une adresse qui ne change que par l'ancre ne recharge pas la page, le thème préparé n'était pas lu | rechargement dans l'aide quand l'adresse a une ancre |

## 3. Parcours réel (Phase 8)

| Étape | 320 px | 375 px | 768 px | 1440 px |
|---|---|---|---|---|
| Premier chargement | — | — | — | ✅ thème de l'appareil (sombre), 7 factures |
| Liste, facture | ✅ sans débordement | ✅ barre d'actions en bas | ✅ (tests) | ✅ |
| Formulaire de modification | ✅ sans débordement | ✅ ombre au-dessus du pied, barre fine à 8 px du bord | ✅ (tests) | ✅ après correctifs E1 et E2 |
| Clavier | — | — | — | ✅ contour de 2 px sur les cartes |
| Thème | — | — | — | ✅ bascule, choix gardé au rechargement |

## 4. Écarts relevés et suites

| # | Écart | Suite |
|---|---|---|
| E1 | Deux barres de défilement dans le tiroir : les libellés `sr-only` des lignes (position absolue) prenaient le `<dialog>` fixe comme bloc de référence et le faisaient défiler — **invisible aux tests**, dont la fenêtre montrait tout le formulaire | Corrigé : `relative` sur la zone qui défile, `overflow-hidden` sur le dialogue ; test de garde (rouge sur l'ancien tiroir : 274 px de débordement) |
| E2 | Les écrans « With Scroll » de la maquette ont une ombre au-dessus du pied (200 px vers 50 % de noir en desktop et tablette, 64 px vers 10 % en mobile) et une barre de défilement fine (8 px, à 32 px du bord, 8 px en mobile) ; mes références ne les montraient pas : `fig_render.py` remplace un dégradé par sa première couleur, transparente ici | Ajoutés : ombre visible tant qu'il reste du formulaire sous le pied (toujours en mobile, comme la maquette), barre fine dans une gouttière gardée ; Firefox garde une barre native fine |
| — | Dans le panneau du navigateur intégré, l'ombre n'apparaît qu'à la prochaine image dessinée : la page y tourne en arrière-plan et `ResizeObserver` attend un rendu | Sans effet sur un navigateur affiché ; vérifié au défilement et dans les tests |
| — | La date du formulaire suit le format du navigateur (`06/11/2026` en français) | Accepté : contrôle natif (Q-B3, ADR-0008) |

## 5. En ligne (Phase 12)

Dépôt public [ounokoya/invoice-app](https://github.com/ounokoya/invoice-app) (`main` et `v1.0.0`), site publié par `npm run deploy` sur la branche `gh-pages` ; Pages activé par GitHub sur `gh-pages` dès le premier push (accord de Koya).

`BASE_URL=https://ounokoya.github.io/invoice-app/ npx playwright test --workers=2` : **95 réussis sur 95** (1,5 min), tests visuels compris (références présentes sur le poste).

## 6. Verdict

Les 34 critères de la spec, les 21 écrans et les fitness functions passent ; le parcours réel a trouvé deux écarts, corrigés. v1.0.0 publiée, 95 / 95 en ligne ; soumission sur FM avec l'accord de Koya.
