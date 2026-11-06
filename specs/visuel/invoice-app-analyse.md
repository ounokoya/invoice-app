# Analyse — Invoice app (Phase 2, à valider : G2)

> SDL-FM 1.6.0. Mesures lues dans le fichier Figma (`design/invoice-app.fig`, hors dépôt) avec `scripts/fig/` ; aucune image de la maquette dans le dépôt (challenge premium). Schéma : `specs/visuel/invoice-app-analyse.png` (source `invoice-app-analyse.excalidraw`, canevas partagé, zone x 108 400).

## 1. Écrans

6 vues × 3 largeurs × 2 thèmes = 36 écrans, plus 18 écrans d'états (survol, actif, erreur, formulaire vide, défilement du formulaire).

| Vue | Desktop 1440 | Tablette 768 | Mobile 375 |
|---|---|---|---|
| Liste | 1440 × 800 | 768 × 1024 | 375 × 1319 |
| Liste vide | 1440 × 800 | 768 × 1024 | 375 × 667 |
| Facture | 1440 × 908 | 768 × 1024 | 375 × 1100 |
| Création, modification | tiroir, page 1440 × 1424 | tiroir, 768 × 1504 | page entière, 375 × 2149 |
| Suppression | modale sur la facture | modale | modale |

## 2. Structure (repères et composants proposés)

| Bloc | Contenu | Élément |
|---|---|---|
| Barre de l'app | logo (lien vers la liste), bouton du thème (lune / soleil), avatar décoratif ; **à gauche, 103 px de large en desktop**, **en haut en tablette (80 px) et mobile (72 px)** | `header` |
| Liste | « Invoices » ; compteur (« There are 7 total invoices », mobile « 7 invoices », filtré « There are 4 pending invoices », vide « No invoices ») ; filtre (« Filter by status », mobile « Filter ») et ses cases Draft, Pending, Paid ; « New Invoice » (mobile « New ») ; une carte-lien par facture : id, échéance, client, montant, statut, chevron | `main` > `h1`, bouton + liste de cases, liste de liens |
| Liste vide | illustration décorative, « There is nothing here », « Create an invoice by clicking the New Invoice button and get started » | `h2` + `p` |
| Facture | « Go back » ; barre de statut (« Status », badge, Edit, Delete, Mark as Paid ; en mobile, les 3 boutons dans une barre fixée en bas) ; détail : id, description, adresse de l'émetteur, Invoice Date, Payment Due, Bill To, Sent to ; lignes (desktop et tablette : tableau Item Name, QTY., Price, Total ; mobile : liste « 2 x £ 200.00 ») ; Amount Due (mobile « Grand Total ») | `main` > `h1` (id), `dl`, `table` |
| Formulaire | « New Invoice » ou « Edit #XM9141 » ; Bill From, Bill To, Invoice Date, Payment Terms, Project Description ; « Item List » (nom, Qty., Price, Total, supprimer) ; « + Add New Item » ; pied : Discard, Save as Draft, Save & Send (création) ou Cancel, Save Changes (modification) ; erreurs « can't be empty », « - All fields must be added », « - An item must be added » | `dialog` modal + `form` |
| Suppression | « Confirm Deletion », « Are you sure you want to delete invoice #XM9141? This action cannot be undone. », Cancel, Delete | `dialog` modal (rôle alertdialog) |

## 3. Mesures clés (px)

| Élément | Desktop | Tablette | Mobile |
|---|---|---|---|
| Contenu | 730 de large, centré sur la page (x 355) ; titre à y 77 | 672, x 48 | 327, x 24 |
| Carte de facture | 730 × 72, rayon 8, écart 16, ombre 0 10 10 −10 `#48549f` 10 % | 672 × 72 | 327 × 134 |
| Badge de statut | 104 × 40, rayon 6, fond de sa couleur à 6 %, point 8 px | idem | idem |
| Boutons | hauteur 48, rayon 24 ; « New Invoice » 150 (cercle blanc 32 + « + ») ; Edit 73, Delete 89, Mark as Paid 131 | idem | idem |
| Filtre ouvert | liste 192 × 128, rayon 8, ombre | idem | idem |
| Tiroir du formulaire | 719 de large depuis x 0, sous la barre (616 visibles), voile noir 50 % | 616 sous la barre du haut | page entière ; pied blanc 375 × 91 |
| Champs | hauteur 48, rayon 4, bordure 1 `#dfe3fa` ; largeurs 504, 240, 214 | | 327 |
| « + Add New Item » | 504 × 48, rayon 24, fond `#f9fafe` | | 327 |
| Modale de suppression | 480 × 249, rayon 8, centrée, voile noir 50 % | | 327 × 220 environ |
| Facture : barre de statut · détail | 730 × 88 · 730 × 631, rayon 8 ; lignes 634 × 184 `#f9fafe` ; bande du total 634 × 80 `#373b53` | | |

Typographie : `specs/reference/tokens.md` (League Spartan ; Heading L 36, M 24, S 15 ; Body 13). Tailles en plus : 18 (titres de section du formulaire), 28 et 80 (montants), 10 (en-têtes en majuscules).

## 4. Comportement

| Événement | Effet |
|---|---|
| Premier chargement | factures de `data.json`, puis gardées dans `localStorage` à chaque changement (bonus, P1) |
| Filtre | cases Draft, Pending, Paid ; aucune cochée = toutes ; le compteur dit le résultat |
| Clic sur une carte | page de la facture ; « Go back » revient à la liste (filtre gardé) |
| New Invoice | formulaire vide ; Invoice Date = aujourd'hui, Payment Terms = Net 30 Days |
| Save as Draft | champs vides permis ; id de 2 lettres majuscules et 4 chiffres, unique ; statut `draft` |
| Save & Send | tous les champs et au moins une ligne exigés ; statut `pending` |
| Payment Terms | `paymentDue` = `createdAt` + 1, 7, 14 ou 30 jours |
| Lignes | Total = Qty. × Price ; total de la facture = somme des lignes |
| Edit → Save Changes | tous les champs exigés ; un brouillon passe en `pending` |
| Edit → Cancel · New → Discard | changements abandonnés, formulaire fermé |
| Mark as Paid | statut `paid` |
| Delete | modale de confirmation ; Delete supprime et ramène à la liste ; Cancel ferme |
| Bouton du thème | clair ↔ sombre, choix gardé |

## 5. États interactifs (inventaire)

| Élément | Normal | Survol | Actif, erreur | Focus (non dessiné) |
|---|---|---|---|---|
| Bouton 1 (New Invoice) et 2 (Mark as Paid) | `#7c5dfa` | `#9277ff` | — | proposition Q-B15 |
| Bouton 3 (Edit) | clair `#f9fafe`, sombre `#252945` | clair `#dfe3fa`, sombre blanc | — | |
| Bouton 4 (Save as Draft) | `#373b53` | `#0c0e16` | — | |
| Bouton 5 (Delete) | `#ec5757` | `#ff9797` | — | |
| Bouton 6 (+ Add New Item) | `#f9fafe` | `#dfe3fa` | — | |
| Carte de facture | sans bordure | bordure 1 `#7c5dfa` | — | |
| Case du filtre | `#dfe3fa` | bordure `#7c5dfa` | cochée `#7c5dfa` + coche | |
| Champ | bordure `#dfe3fa` | bordure `#9277ff` | actif `#9277ff` ; erreur `#ec5757`, libellé rouge, « can't be empty » | |
| Liens « Go back », chevrons, poubelle | couleur 07 | `#888eb0` / `#ec5757` (poubelle) | — | |

## 6. Accessibilité

### Contrastes (audit des 12 écrans desktop principaux, `scripts/fig/audit.py`)

Le thème sombre passe partout (4,65:1 au moins). En clair, 14 couples texte / fond sont sous le seuil AA : propositions Q-A1 à Q-A6, la teinte AA la plus proche (même teinte, luminosité réduite), **thème clair seulement**.

| # | Couple de la maquette | Contraste | Proposition (clair) |
|---|---|---|---|
| Q-A1 | Textes secondaires 06 `#888eb0` (échéances, compteur, modale) sur blanc ou `#f8f8fb` | 3,02 à 3,20:1 | `#68709b` (4,54:1) |
| Q-A1 | Noms des clients `#858bb2` sur blanc | 3,31:1 | `#6870a0` (4,50:1) |
| Q-A1 | Étiquettes 07 `#7e88c3` (« Invoice Date », « # » des id, Edit) sur blanc ou `#f9fafe` | 3,24 à 3,38:1 | `#616db5` (4,54:1) |
| Q-A2 | « Paid » `#33d69f` sur sa teinte | 1,79:1 | `#1a8360` (4,51:1) |
| Q-A2 | « Pending » `#ff8f00` sur sa teinte | 2,18:1 | `#ab6000` (4,54:1) |
| Q-A3 | Texte blanc sur 01 `#7c5dfa` (New Invoice, Mark as Paid, Save & Send) ; « Bill To » `#7c5dfa` sur blanc | 4,37:1 | `#7a5afa` (4,50:1), presque identique |
| Q-A4 | Texte blanc sur 09 `#ec5757` (Delete) | 3,45:1 | `#e62525` (4,51:1) |
| Q-A5 | « Save as Draft » `#888eb0` sur `#373b53` | 3,43:1 | `#a0a5c0` (4,50:1) |
| Q-A6 | « Item List » `#777f98` (18 px) | 3,98:1 | `#6d7690` (4,52:1) |

Le champ de date désactivé de la modification (`#bfc4e1`, 1,73:1) est exempté (WCAG : composant inactif).

### Autres contrats proposés

Un seul `h1` par vue ; formulaire et suppression en `dialog` modal (focus piégé, Échap, focus rendu au bouton d'origine) ; chaque champ a son `label` et son erreur liée (`aria-describedby`, `aria-invalid`) ; filtre en bouton + cases à cocher natives ; lignes de la facture en `table` (desktop, tablette) ; avatar et illustration décoratifs ; statut lu en texte ; focus visible partout (Q-B15).

## 7. Questions (propositions)

| # | Question | Proposition |
|---|---|---|
| Q-B1 | Navigation | Adresses par ancre : `#/` (liste, `?status=pending,paid`), `#/invoice/XM9141` ; retour et rechargement gardent la vue (GitHub Pages) |
| Q-B2 | Formulaire | `dialog` modal : tiroir à gauche (desktop) ou sous la barre (tablette), page entière en mobile avec « Go back » |
| Q-B3 | Date et Payment Terms | Contrôles natifs (`input type="date"`, `select`) stylés fermés comme la maquette ; listes ouvertes natives (le README le permet) |
| Q-B4 | Filtre | Plusieurs statuts à la fois ; compteur « There are 4 pending invoices », « There are 5 pending or paid invoices », « There are 7 total invoices » |
| Q-B5 | Textes selon la largeur | Mobile : « 7 invoices », « Filter », « New », « Grand Total », actions de la facture en barre basse, comme la maquette |
| Q-B6 | Mark as Paid | Affiché pour une facture `pending` seulement |
| Q-B7 | Modifier une facture payée | Statut gardé (`paid` reste `paid`) ; seul un brouillon passe en `pending` |
| Q-B8 | Validation | Messages de la maquette ; en plus, adresse e-mail au bon format (« invalid email ») et Qty. et Price positifs |
| Q-B9 | Dates et montants | `en-GB` : « 19 Aug 2021 », « £ 1,800.90 » (espace après £, comme la maquette) |
| Q-B10 | Thème | Celui de l'appareil au premier passage, puis le choix gardé |
| Q-B11 | Liste vide filtrée | Même écran vide, compteur « No invoices » |
| Q-B12 | Incohérence de la maquette | Écran d'erreur : « There is currently 14 invoices active » ; on garde « There are N total invoices » |
| Q-B13 | Données | `localStorage` effaçable : un rechargement sans données relit `data.json` |
| Q-B14 | Montants des lignes | Price affiché avec 2 décimales ; Total calculé, non modifiable |
| Q-B15 | Focus (non dessiné) | Contour 2 px `#7c5dfa` en clair, `#9277ff` en sombre, décalé de 2 px |
