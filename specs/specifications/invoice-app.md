# Spec — Invoice app (v1.0.0)

> SDL-FM 1.6.0 Phase 4. Sources : analyse validée (G2) `specs/visuel/invoice-app-analyse.md`, maquette validée (G3) `specs/visuel/penpot/maquette.md`, tokens `specs/reference/tokens.md`, README du starter (comportements attendus), décisions dans `specs/brainstorming/2026-11-06-invoice-app.md`.
> Cette spec dit **quoi** et **pourquoi**, jamais **comment**.

## 1. Objectif

Une application de factures : les voir, les filtrer par statut, les créer (brouillon ou envoyée), les modifier, les marquer payées, les supprimer, en thème clair ou sombre, à toutes les largeurs. Les données de `data.json` servent au premier chargement ; ensuite, chaque changement est gardé dans le navigateur et retrouvé après rechargement (P1).

## 2. Données et règles de gestion

| # | Règle | Origine |
|---|---|---|
| D1 | Une facture : `id`, `createdAt`, `paymentDue`, `description`, `paymentTerms` (1, 7, 14 ou 30), `clientName`, `clientEmail`, `status` (`draft`, `pending`, `paid`), `senderAddress` et `clientAddress` (`street`, `city`, `postCode`, `country`), `items` (`name`, `quantity`, `price`, `total`), `total` | `data.json` |
| D2 | Premier chargement (rien dans le navigateur) : les 7 factures de `data.json`, dans leur ordre ; ensuite, les factures gardées (clé `invoice-app/invoices` du `localStorage`, tableau JSON au format de D1), la plus récente créée en dernier | P1, Q-B13 |
| D3 | `id` d'une nouvelle facture : 2 lettres majuscules puis 4 chiffres, différent des `id` existants | README |
| D4 | `paymentDue` = `createdAt` + `paymentTerms` jours | README |
| D5 | `total` d'une ligne = `quantity` × `price` ; `total` de la facture = somme des lignes | README, Q-B14 |
| D6 | « Save as Draft » : champs vides permis, statut `draft` ; « Save & Send » : tous les champs et au moins une ligne, statut `pending` | README |
| D7 | « Save Changes » : tous les champs et au moins une ligne ; un `draft` devient `pending` ; `pending` et `paid` gardent leur statut | README, Q-B7 |
| D8 | « Mark as Paid » (factures `pending` seulement) : statut `paid` | README, Q-B6 |
| D9 | Suppression : après confirmation seulement | README |
| D10 | Une date mal écrite dans les données (`2021-10-7`) est lue comme `2021-10-07` | `data.json` |

Formats (Q-B9, `en-GB`) : dates « 19 Aug 2021 » ; montants « £ 1,800.90 » (espace après £, 2 décimales, séparateur des milliers).

## 3. Écrans et contenu

### 3.1 Barre de l'app (toutes les vues)

Logo (lien « Invoices » vers la liste), bouton du thème (nom « Switch to dark theme » ou « Switch to light theme »), avatar décoratif. À gauche, 103 px de large et toute la hauteur dès 1024 px ; en haut au-dessous (80 px de haut en tablette, 72 en mobile).

### 3.2 Liste (`#/`)

| Élément | Contenu |
|---|---|
| Titre | « Invoices » (`h1`) |
| Compteur | « There are 7 total invoices » ; filtré : « There are 4 pending invoices », « There are 5 pending or paid invoices », « There is 1 draft invoice » ; les trois statuts cochés : comme aucun ; aucune facture : « No invoices » ; sous 768 px : « 7 invoices », « 1 invoice » (Q-B4, Q-B5, Q-B11) |
| Filtre | bouton « Filter by status » (« Filter » sous 768 px), qui ouvre trois cases « Draft », « Pending », « Paid » ; aucune cochée = toutes ; le filtre est écrit dans l'adresse (`#/?status=pending,paid`) |
| Nouvelle facture | bouton « New Invoice » (« New » sous 768 px, nom accessible « New Invoice » partout) |
| Factures | une carte-lien par facture ; son nom accessible est son texte visible, qui commence par « #XM9141 » : « #XM9141 Due 20 Sep 2021 Alex Grim £ 556.00 Pending » (chevron décoratif) |
| Liste vide | illustration décorative ; « There is nothing here » (`h2`) ; « Create an invoice by clicking the New Invoice button and get started » (« New » sous 768 px) |

### 3.3 Facture (`#/invoice/XM9141`)

« Go back » (lien vers la liste, filtre gardé) ; barre de statut : « Status », badge, boutons « Edit », « Delete » et, pour `pending`, « Mark as Paid » (sous 768 px, ces boutons sont dans une barre fixée en bas) ; détail : « #XM9141 » (`h1`), description, adresse de l'émetteur, « Invoice Date », « Payment Due », « Bill To » (client et adresse), « Sent to » (e-mail) ; lignes : tableau « Item Name », « QTY. », « Price », « Total » dès 768 px, liste « 2 x £ 200.00 » en dessous ; « Amount Due » (« Grand Total » sous 768 px) et le total. Un `id` inconnu : « Invoice not found » et un lien vers la liste.

### 3.4 Formulaire (dialogue modal)

| Élément | Contenu |
|---|---|
| Titre | « New Invoice » ou « Edit #XM9141 » (`h2`, nom du dialogue) |
| Bill From | groupe « Bill From » : Street Address, City, Post Code, Country |
| Bill To | groupe « Bill To » : Client's Name, Client's Email (aide « e.g. email@example.com »), Street Address, City, Post Code, Country |
| Facture | Invoice Date (date ; non modifiable en modification), Payment Terms (« Net 1 Day », « Net 7 Days », « Net 14 Days », « Net 30 Days » ; 30 par défaut), Project Description (aide « e.g. Graphic Design Service ») |
| Item List | groupe « Item List » ; chaque ligne est un groupe « Item 1 », « Item 2 »… : Item Name, Qty., Price, Total (calculé, non modifiable), bouton « Delete item 1 » ; « + Add New Item » |
| Pied | création : « Discard », « Save as Draft », « Save & Send » ; modification : « Cancel », « Save Changes » |
| Erreurs | sous chaque champ vide : « can't be empty » ; e-mail mal écrit : « invalid email » ; Qty. ou Price nul ou négatif : « must be positive » ; en bas : « - All fields must be added », « - An item must be added » (Q-B8) |

Desktop : tiroir à gauche, 719 px de large depuis le bord (616 visibles à droite de la barre), voile noir à 50 % sur le reste. Tablette : tiroir de 616 px sous la barre du haut. Mobile : page entière sous la barre, avec « Go back » en haut et le pied en bas.

### 3.5 Suppression (dialogue modal d'alerte)

« Confirm Deletion » (`h2`), « Are you sure you want to delete invoice #XM9141? This action cannot be undone. », « Cancel », « Delete ».

La page a pour titre « Frontend Mentor | Invoice app » (liste) et « Invoice #XM9141 | Invoice app » (facture), la langue `en`, l'icône du starter.

## 4. Tokens

Couleurs, typographie et mesures : `specs/reference/tokens.md`, bibliothèque Penpot, teintes AA validées (G2 Q-A1 à Q-A6, G3-1, G3-2 ; `scripts/fig/aa.py`). Principaux rôles :

| Rôle | Clair | Sombre |
|---|---|---|
| Fond de page | `#f8f8fb` | `#141625` |
| Cartes, formulaire, dialogue | `#ffffff` | `#1e2139` |
| Champs | `#ffffff`, bordure `#dfe3fa` | `#1e2139`, bordure `#252945` |
| Barre | `#373b53` | `#1e2139` |
| Texte principal | `#0c0e16` | `#ffffff` |
| Texte secondaire | `#68709b` (Q-A1) | `#dfe3fa` · `#888eb0` |
| Étiquettes | `#616db5` (Q-A1) | `#dfe3fa` |
| Violet (boutons 1 et 2) · survol | `#7757fa` · `#6742ff` | idem |
| Rouge (Delete) · survol | `#e62525` · `#c41e1e` | idem |
| Paid · Pending · Draft (texte et point ; fond de la même couleur à 6 %) | `#1a8360` · `#ab6000` · `#373b53` | `#33d69f` · `#ff8f00` · `#dfe3fa` |

League Spartan (Bold 700, Medium 500) : titres 36/36 (24/24 sous 768 px), 24/24 ; textes 15/15 et 15/24 Bold, 13/15 et 13/18 Medium, espacements −1,125 à −0,1 px (tokens).

## 5. Mise en page

| Largeur | Disposition |
|---|---|
| < 768 px | barre en haut (72 px) ; contenu à 24 px des bords ; cartes sur 2 lignes (327 × 134) ; formulaire en page ; actions de la facture en barre basse |
| 768 à 1023 px | barre en haut (80 px) ; contenu à 48 px des bords (liste) et 40 px (facture) ; tiroir de 616 px |
| ≥ 1024 px | barre à gauche (103 px) ; contenu de 730 px au plus, centré sur la page |

Positions de la maquette (px, coin haut gauche ; à 1 px près, 2 px pour les largeurs issues du texte) :

| Élément | 1440 × 800 | 768 × 1024 | 375 × 667 |
|---|---|---|---|
| Titre « Invoices » | (355, 78) | (48, 142) | (24, 108) |
| Bouton New Invoice | (935, 77) 150 × 48 | (570, 141) 150 × 48 | « New » : (261, 104) 90 × 44 |
| 1ʳᵉ carte · 7ᵉ carte | (355, 196) · (355, 724), 730 × 72 | (48, 251) · (48, 779), 672 × 72 | (24, 180) · (24, 1080), 327 × 134 |
| Facture : barre de statut · détail | (355, 111) 730 × 88 · (355, 223) 730 × 631 | (40, 175) 688 × 88 · (40, 287) 688 × 602 | (24, 151) 327 × 91 · (24, 258) 327 × 695 |
| Facture : Edit · Delete · Mark as Paid | (744, 131) 73 · (825, 131) 89 · (922, 131) 131 | (387, 195) · (468, 195) · (565, 195) | barre basse : (24, 1030) · (105, 1030) · (202, 1030) 149 |
| Tiroir · 1er champ | (0, 0) 719 × hauteur de page · (159, 200) 504 × 48 | (0, 80) 616 · (56, 280) 504 × 48 | page · (24, 263) 327 × 48 |
| Modale de suppression | (480, 388) 480 × 249, centrée | (144, 388) 480 × 249 | 327 × 220, centrée |

## 6. États et interactions

| Élément | Normal | Survol | Focus clavier |
|---|---|---|---|
| Boutons 1 et 2 | violet | `#6742ff` | contour 2 px, décalé de 2 px (`#7757fa` clair, `#9277ff` sombre) |
| Bouton 3 (Edit, Cancel, Discard) | clair `#f9fafe` · sombre `#252945` | clair `#dfe3fa` (texte `#515eae`) · sombre blanc (texte `#616db5`) | idem |
| Bouton 4 (Save as Draft) | `#373b53` | clair `#0c0e16` · sombre `#1e2139` | idem |
| Bouton 5 (Delete) | `#e62525` | `#c41e1e` | idem |
| Bouton 6 (+ Add New Item) | clair `#f9fafe` · sombre `#252945` | clair `#dfe3fa` (texte `#515eae`) · sombre `#1e2139` | idem |
| Carte de facture | sans bordure | bordure 1 px violette | contour 2 px |
| Case du filtre | `#dfe3fa` | bordure violette | cochée : violette avec coche |
| Champ | bordure `#dfe3fa` | bordure `#9277ff` | bordure `#9277ff` |
| Champ en erreur | libellé, bordure et message `#e62525` (clair) · `#ec5757` (sombre) | | |

| Événement | Effet |
|---|---|
| Ouvrir le formulaire ou la suppression | le dialogue prend le focus ; Tab reste dedans ; Échap ferme (comme Cancel ou Discard) ; le focus revient au bouton d'origine |
| Retour du navigateur, rechargement | la vue et le filtre de l'adresse sont retrouvés (Q-B1) |
| Bouton du thème | clair ↔ sombre ; au premier passage, le thème de l'appareil ; le choix est gardé (clé `invoice-app/theme`, `light` ou `dark` ; Q-B10) |

Les changements de couleur peuvent être progressifs ; aucune transition si `prefers-reduced-motion: reduce`.

## 7. Accessibilité

### Contrats

| # | Contrat |
|---|---|
| A1 | Un seul `h1` par vue (« Invoices », « #XM9141 ») ; `h2` pour la liste vide et les dialogues |
| A2 | Repères : un `header` (barre), un `main` ; dialogues en `dialog` modal nommés par leur titre ; la suppression est un dialogue d'alerte |
| A3 | Chaque champ a son `label` ; son erreur lui est liée (`aria-invalid`, description) ; le premier champ en erreur reçoit le focus après un envoi refusé |
| A4 | Lignes de la facture en tableau dès 768 px (en-têtes de colonnes) |
| A5 | Statut lu en texte ; avatar, illustration, chevrons et points décoratifs |
| A6 | Contraste AA (4,5:1, 3:1 pour les grands textes et les bordures de champ) dans les deux thèmes, survol compris |
| A7 | Focus visible sur chaque élément interactif ; ordre clavier = ordre de lecture |
| A8 | Pas de transition si `prefers-reduced-motion: reduce` |

### Noms accessibles utilisés par les tests

| Élément | Rôle | Nom |
|---|---|---|
| Barre | banner | — ; lien « Invoices » ; bouton « Switch to dark theme » / « Switch to light theme » |
| Liste | heading (1) | « Invoices » |
| Filtre | button | « Filter by status » (cases : checkbox « Draft », « Pending », « Paid ») |
| Nouvelle facture | button | « New Invoice » |
| Cartes | link | son texte : « #RT3080 Due 19 Aug 2021 Jensen Huang £ 1,800.90 Paid » … |
| Facture | heading (1) | « #XM9141 » ; link « Go back » ; buttons « Edit », « Delete », « Mark as Paid » ; table |
| Formulaire | dialog | « New Invoice » / « Edit #XM9141 » ; groups « Bill From », « Bill To », « Item List », « Item 1 »… ; textbox par libellé dans son groupe (§3.4) ; combobox « Payment Terms » ; buttons du pied ; « + Add New Item » ; « Delete item 1 » |
| Suppression | alertdialog | « Confirm Deletion » ; buttons « Cancel », « Delete » |

## 8. Critères d'acceptation

```
Mise en page (positions de la §5)
S1  Given 1440 × 800, la liste   Then barre à gauche de 103 px, titre, New Invoice, 1re et 7e cartes à leurs positions
S2  Given 768 × 1024 · 375 × 667, la liste   Then barre en haut (80 · 72 px), titre et cartes à leurs positions ; « Filter », « New », « 7 invoices » sous 768
S3  Given la facture XM9141 à 1440, 768, 375   Then barre de statut, détail et boutons à leurs positions ; barre basse sous 768
S4  Given le formulaire à 1440, 768, 375   Then tiroir (719 depuis 0 · 616 sous la barre · page) et 1er champ à leurs positions ; voile à 50 %
S5  Given la suppression à 1440, 768, 375   Then modale à sa position, centrée
S6  Given 320, 375, 767, 768, 1023, 1024, 1440 px, chaque vue   Then pas de défilement horizontal

Liste et filtre (parcours complets)
S7  Given le premier chargement   Then les 7 cartes dans l'ordre de data.json, chacune avec #id, « Due » et la date, client, montant, statut
                                   (contenu comparé à data.json, formats de la §2), « There are 7 total invoices »
S8  Given la liste   When je coche chaque combinaison de statuts (7)   Then les cartes et le compteur de chaque combinaison ;
                     When je décoche tout   Then les 7 ; l'adresse suit le filtre et un rechargement le garde
S9  Given aucune facture (toutes supprimées) ou un filtre sans résultat   Then l'écran vide et « No invoices »

Facture
S10 Given chaque facture de data.json   When j'ouvre sa carte   Then l'adresse #/invoice/<id>, le titre du document, tous les champs
                                        de la §3.3 et chaque ligne (nom, quantité, prix, total) comparés à data.json
S11 Given une facture   When je clique « Go back »   Then la liste, avec le filtre d'avant ; Given #/invoice/ZZ0000   Then « Invoice not found »
S12 Given une facture pending   Then « Mark as Paid » ; Given paid ou draft   Then pas de « Mark as Paid »

Créer
S13 Given « New Invoice »   Then dialogue « New Invoice », champs vides sauf Invoice Date (aujourd'hui) et Payment Terms (Net 30 Days), une ligne vide
S14 Given le formulaire vide   When « Save & Send »   Then chaque champ « can't be empty », les deux messages du bas, focus sur le 1er champ, rien n'est créé
S15 Given le formulaire rempli (2 lignes, Net 7 Days)   When « Save & Send »   Then une 8e facture pending : id au format D3, unique,
                                   paymentDue = createdAt + 7 jours, totaux des lignes et de la facture (D5), tous les champs gardés
S16 Given le formulaire avec seulement Client's Name   When « Save as Draft »   Then une facture draft, sans erreur
S17 Given un e-mail « alex@ » · une Qty. à 0   When « Save & Send »   Then « invalid email » · « must be positive »
S18 Given le formulaire   When je change Qty. ou Price   Then le Total de la ligne se met à jour ; « + Add New Item » ajoute une ligne ;
                          « Delete item 1 » la retire
S19 Given le formulaire modifié   When « Discard » ou Échap   Then rien n'est créé, le focus revient à « New Invoice »

Modifier, payer, supprimer
S20 Given la facture XM9141   When « Edit »   Then dialogue « Edit #XM9141 » rempli avec toutes ses valeurs (comparées à data.json)
S21 Given Edit   When je change le client et une ligne puis « Save Changes »   Then la facture affichée et la carte de la liste suivent ;
                 When je vide un champ   Then « can't be empty » et rien n'est gardé ; When « Cancel »   Then aucun changement
S22 Given le brouillon FV2353   When je le complète puis « Save Changes »   Then statut pending
S23 Given XM9141 pending   When « Mark as Paid »   Then badge Paid, bouton absent, carte de la liste Paid
S24 Given une facture   When « Delete »   Then dialogue d'alerte « Confirm Deletion » avec son id ; When « Cancel »   Then elle reste ;
                        When « Delete »   Then la liste sans elle, compteur à 6

Persistance et thème
S25 Given une création, une modification, un paiement, une suppression   When je recharge   Then chaque changement est retrouvé
S26 Given le navigateur vidé de ses données   When je recharge   Then les 7 factures de data.json
S27 Given l'appareil en thème sombre, premier passage   Then le thème sombre ; When je clique le bouton du thème   Then le clair,
                                                         gardé au rechargement
S28 Given chaque thème   Then fonds, textes et badges de la §4

Interactions et accessibilité
S29 Given chaque type de bouton, la carte, la case, le champ   When survol   Then l'état de la §6 ; When je le quitte   Then l'état normal
S30 Given prefers-reduced-motion: reduce   Then aucune transition
S31 Given la liste, la facture, le formulaire, la suppression   When je parcours au Tab jusqu'au dernier élément   Then chaque élément
                                                                    focalisé a un contour visible ; dans un dialogue, le focus reste dedans
S32 Given la liste, la facture, le formulaire en erreur, la suppression, à 375, 768 et 1440, dans les deux thèmes   Then axe-core :
                                                                    aucune violation sérieuse ou critique
S33 Given le HTML servi   Then validateur W3C Nu et html-validate (réglage FM) sans erreur ; Given le JavaScript du dépôt   Then eslint sans erreur
    (et les gardes des règles FM déjà vues : longueurs en rem, aria-label, CSS logique)

Visuel (G3-5, G3-6 : 5 %, références corrigées hors dépôt ; tests sautés sans design/)
S34 Given les 21 écrans de G3-5   Then chaque capture vs design/reference-aa/<écran>.png ≤ 5,0 %
```
