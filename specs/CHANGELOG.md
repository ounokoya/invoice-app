# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

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
- 94 tests Playwright écrits avant le code : 34 critères de la spec, 21 écrans comparés aux références du `.fig` (0,41 à 3,12 %), axe-core, W3C Nu, html-validate, ESLint, fitness functions des ADR-0004, 0005 et 0011.
- README avec une capture par état décrit ; rapport d'exécution `specs/analyse/2026-11-06-invoice-app.md`.
