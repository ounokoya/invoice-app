# Références visuelles — Invoice app

> SDL-FM 1.6.0, Phase 1. Challenge premium : **les images de référence ne sont pas dans le dépôt** (règle FM : maquettes non publiées). Elles sont produites en local, dans `design/reference/` (ignoré par git), depuis `design/invoice-app.fig` téléchargé sur FM.

## Produire les références

```
bash scripts/fig/references.sh
```

| Étape | Outil |
|---|---|
| Ouvrir le `.fig` (archive) et décompresser `canvas.fig` (blocs deflate) | `references.sh` |
| Décoder le schéma kiwi et le message (9 617 nœuds) | `scripts/fig/kiwi_fig.py` |
| Écrire chaque écran en SVG : tracés précalculés par Figma (formes, contours, lettres), couleurs, opacités, ombres portées (étalement, flou, décalage), découpe des cadres, images | `scripts/fig/fig_render.py` |
| Rendre chaque SVG en PNG dans Chromium (lissage gris) | `scripts/fig/svg2png.js` |

Le texte est rendu avec les contours de lettres enregistrés par Figma : aucune police n'est nécessaire, et le rendu suit exactement la maquette.

## Écrans (55, à 1×)

design-system · desktop-create-invoice-dark-empty-state · desktop-create-invoice-dark-full-form · desktop-create-invoice-dark-hover-active-error · desktop-create-invoice-dark-with-scroll · desktop-create-invoice-empty-state · desktop-create-invoice-full-form · desktop-create-invoice-hover-active-error · desktop-create-invoice-with-scroll · desktop-delete-prompt-dark · desktop-delete-prompt · desktop-edit-invoice-dark-full-form · desktop-edit-invoice-dark-hover-active-error · desktop-edit-invoice-dark-with-scroll · desktop-edit-invoice-full-form · desktop-edit-invoice-hover-active-error · desktop-edit-invoice-with-scroll · desktop-invoices-dark-empty · desktop-invoices-dark-hover-active · desktop-invoices-dark · desktop-invoices-empty · desktop-invoices-hover-active · desktop-invoices · desktop-view-invoice-dark-hover-active · desktop-view-invoice-dark · desktop-view-invoice-hover-active · desktop-view-invoice · mobile-create-invoice-dark · mobile-create-invoice · mobile-delete-prompt-dark · mobile-delete-prompt · mobile-edit-invoice-dark · mobile-edit-invoice · mobile-invoices-dark-empty · mobile-invoices-dark · mobile-invoices-empty · mobile-invoices · mobile-view-invoice-dark · mobile-view-invoice · tablet-create-invoice-dark · tablet-create-invoice-dark-with-scroll · tablet-create-invoice · tablet-create-invoice-with-scroll · tablet-delete-prompt-dark · tablet-delete-prompt · tablet-edit-invoice-dark · tablet-edit-invoice-dark-with-scroll · tablet-edit-invoice · tablet-edit-invoice-with-scroll · tablet-invoices-dark-empty · tablet-invoices-dark · tablet-invoices-empty · tablet-invoices · tablet-view-invoice-dark · tablet-view-invoice

Desktop 1440 px de large (800 à 1 475 px de haut), tablette 768, mobile 375 ; chaque vue en clair et en sombre (`-dark`).
