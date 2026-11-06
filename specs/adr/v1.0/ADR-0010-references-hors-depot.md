# ADR-0010 : Maquettes premium hors dépôt ; références produites depuis le `.fig`

## Statut
Accepté (2026-11-06) — règle de FM (README du starter) ; G1, G3 (G3-5, G3-6).

## Décision
- `design/` (ignoré par git) contient le `.fig`, l'aperçu et les rendus ; `scripts/fig/` (dans le dépôt, sans donnée de maquette) les produit : `references.sh`, `fig_render.py --aa`.
- Les tests visuels (S34) lisent `design/reference-aa/` et sont **sautés** quand les références manquent (site en ligne, autre poste).

## Conséquences
- Un relecteur voit la méthode et les outils, jamais les maquettes.
