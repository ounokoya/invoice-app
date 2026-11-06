# ADR-0011 : Publication sur GitHub Pages sous /invoice-app/

## Statut
Accepté (2026-11-06) — publication avec l'accord de Koya au moment de la faire (Phases 11 et 12).

## Décision
- Dépôt public `ounokoya/invoice-app` ; `base: '/invoice-app/'` ; `scripts/deploy-gh-pages.sh` (celui des solutions) publie `dist/` sur `gh-pages`.
- Le `.gitignore` de FM (`*.fig`…) et `/design/` empêchent l'envoi des maquettes.

## Conséquences
- Fitness function (« ADR-0011 ») : aucun fichier de maquette suivi par git (`*.fig`, `design/`).
