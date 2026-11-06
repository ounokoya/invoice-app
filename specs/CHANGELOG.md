# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

## [1.0.1] — 2026-11-06

Suite du rapport IA FM (8,8 / 10, `specs/analyse/2026-11-06-rapport-ia.md`), avec l'accord de Koya.

### Fixed
- Changement de vue : le focus va au contenu (au retour à la liste, à la carte de la facture quittée) et le titre de la vue est annoncé (A9, S35 ; R4).
- La suppression rend le focus à « Delete » à sa fermeture, par Cancel ou Échap (A10, S24 ; R5).
- Les messages du bas du formulaire sont annoncés (`role="alert"`, S14 ; R6).
- Écran vide : plus de `<br>` forcé ; largeur du bloc calée par mesure, mêmes lignes que la maquette (R8).

### Changed
- Un seul point de rupture : le token `--breakpoint-md`, lu par le CSS (`md:`, `@variant md`) et par `media.svelte.js` (R9).
- S27 vérifie le thème dans les deux sens (R3) ; 96 tests.
- README : lien du dépôt et table des tests par parcours (R10 ; R1 et R2 étaient des faux positifs).

### Removed
- `invoice.html` du starter (R7).

## [1.0.0] — 2026-11-06

Première version (SDL-FM 1.6.0, premier challenge Guru avec le fichier Figma).

### Added
- Liste des factures : compteur, filtre par statut (cases natives, choix dans l'adresse), écran vide, texte court sous 768 px (spec §3.2).
- Page d'une facture : statut, actions (barre fixée en bas sous 768 px), détail, lignes en tableau dès 768 px, total ; « Invoice not found » pour un id inconnu (spec §3.3).
- Formulaire de création et de modification en `dialog` modal : tiroir à gauche (desktop), sous la barre (tablette), page entière (mobile) ; validation sur mesure (« can't be empty », « invalid email », « must be positive »), brouillons, ombre au-dessus du pied et barre de défilement fine des écrans « With Scroll » (spec §3.4, ADR-0008).
- Confirmation de suppression en `dialog` d'alerte ; « Mark as Paid » pour les factures `pending` (spec §3.5).
- Thème clair et sombre : thème de l'appareil au premier passage, puis le choix gardé (ADR-0004).
- Persistance dans le `localStorage` ; `data.json` relu quand le navigateur est vidé (ADR-0007).
- Navigation par ancre : la vue et le filtre retrouvés au rechargement et au retour (ADR-0006).
- Teintes AA en thème clair (14 couples texte / fond relevés ; G2, G3) ; contour de focus de 2 px.
- 95 tests Playwright : 94 écrits avant le code (34 critères de la spec, 21 écrans comparés aux références du `.fig` (0,41 à 3,12 %), axe-core, W3C Nu, html-validate, ESLint, fitness functions des ADR-0004, 0005 et 0011), et la garde des écarts du parcours réel.
- README avec une capture par état décrit ; rapport d'exécution `specs/analyse/2026-11-06-invoice-app.md`.
