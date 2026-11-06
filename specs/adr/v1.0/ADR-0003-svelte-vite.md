# ADR-0003 : Svelte 5 et Vite, une application d'une page sans SvelteKit

## Statut
Accepté (2026-11-06) — choix de Koya en Pré-dev 1 (P2).

## Contexte
Une app à état (liste filtrée, formulaires, dialogues, persistance), servie en fichiers statiques par GitHub Pages. Les solutions précédentes sont en JavaScript sans cadriciel ; le portfolio présente LaunchKit (SvelteKit).

## Options
| Option | Pour | Contre |
|---|---|---|
| **Svelte 5 (runes) + Vite, sans SvelteKit (choisie)** | Composants et réactivité pour les formulaires et la liste ; build statique simple ; pas de serveur | Une dépendance d'exécution |
| SvelteKit (adaptateur statique) | Routage fourni | Trop lourd pour 3 vues ; routage par chemins mal servi par GitHub Pages |
| JavaScript sans cadriciel | Comme les solutions précédentes | Beaucoup de code DOM pour les formulaires et l'état |

## Décision
- `svelte` 5 et `@sveltejs/vite-plugin-svelte` ; `index.html` monte `src/App.svelte`.
- Composants : `AppBar`, `InvoiceList`, `InvoiceCard`, `StatusBadge`, `StatusFilter`, `InvoiceView`, `InvoiceForm`, `ItemRows`, `DeleteDialog`.
- Fichiers en anglais (SDL-FM 1.6.0).

## Conséquences
- Le HTML servi n'est qu'une coquille : les tests valident aussi le document rendu de chaque vue (S33).
