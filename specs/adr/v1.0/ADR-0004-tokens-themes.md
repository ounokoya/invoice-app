# ADR-0004 : Tokens de la maquette et deux thèmes, teintes AA comprises

## Statut
Accepté (2026-11-06) — G2 (Q-A1 à Q-A6), G3 (G3-1, G3-2).

## Contexte
12 couleurs et 6 styles de texte dans le `.fig` (`specs/reference/tokens.md`) ; des teintes AA remplacent certaines couleurs en thème clair, d'autres dans les deux thèmes (`scripts/fig/aa.py`) ; le thème suit l'appareil puis le choix gardé.

## Décision
- `src/app.css` : un bloc `@theme` (couleurs fixes, police, tailles de texte en rem) et des **rôles** en propriétés personnalisées (`--color-page`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-label`, `--color-paid`…), redéfinis sous `:root[data-theme="dark"]`.
- Le thème est posé sur `<html data-theme>` avant le premier affichage (pas de flash) : choix gardé (`invoice-app/theme`) sinon `prefers-color-scheme`.
- `color-scheme` suit le thème (contrôles natifs : date, liste, barres de défilement).

## Conséquences
- Fitness function (`tests/fitness.spec.js`, « ADR-0004 ») : aucune couleur écrite en dur dans `src/` hors des valeurs de tokens de `src/app.css`.
