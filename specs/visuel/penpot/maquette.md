# Maquette — Invoice app (Phase 3, à valider : G3)

> SDL-FM 1.6.0 : avec Pro, les mesures sont lues dans le fichier Figma ; Penpot garde la bibliothèque, les composants, les écrans clés et la gate G3. Fichier Penpot **« invoice-app »** (créé par Koya), page « Invoice app ». Analyse validée (G2) : `specs/visuel/invoice-app-analyse.md`.

## Contenu du fichier Penpot

| Élément | Contenu |
|---|---|
| Bibliothèque | 26 couleurs (dossier « Invoice ») : les 12 de la maquette, la barre `#373b53`, les statuts, le fond du bouton 3, et les **teintes AA** ; 6 typographies League Spartan (Heading L, M, S, S variante, Body, Body variante) |
| Composants | Planche « Composants (états, teintes AA) » : boutons 1 à 6 en normal, survol et focus, en clair et en sombre ; badges Paid, Pending, Draft ; champ normal, actif, erreur ; case du filtre normale, survolée, cochée. Export : `composants.png` (dans ce dossier) |
| Écrans clés | 6 calques « Écran clé · … (AA) » : liste (clair et sombre), facture, formulaire complet, suppression, liste mobile ; ce sont les rendus du `.fig` avec les teintes AA (`design/reference-aa/`, hors dépôt) |

Les écrans ne sont pas redessinés dans Penpot : le `.fig` donne déjà chaque mesure, et son rendu (contours de lettres compris) est plus fidèle qu'un redessin.

## Références visuelles des tests

`design/reference-aa/` (54 écrans, hors dépôt) : rendu du `.fig` avec les teintes AA (`scripts/fig/fig_render.py --aa`, règles dans `scripts/fig/aa.py`). Audit après correction (`scripts/fig/audit.py --aa`) : **plus aucun texte réel sous AA** ; restent des cas hors champ (champ de date désactivé, exempté ; éléments sous le voile du tiroir ; jours du calendrier, natif selon Q-B3 ; valeurs fantômes et un « Bill From » à 20 % d'opacité de la maquette).

## Points à valider (G3)

| # | Point | Proposition |
|---|---|---|
| G3-1 | États sous AA trouvés en auditant aussi les écrans d'états (G2 n'avait vu que les écrans principaux) | **Q-A7** survol des boutons 1 et 2 : `#6742ff` (plus foncé, au lieu de `#9277ff` plus clair, 3,32:1 sous le blanc) ; **Q-A8** survol de Delete : `#c41e1e` (au lieu de `#ff9797`, 2,08:1) ; **Q-A9** texte des boutons 3 et 6 survolés en clair : `#515eae` ; **Q-A10** en sombre : textes violets `#9277ff` (couleur 02), gris `#8690c7` et `#8c92b3` sur `#252945` |
| G3-2 | Marge de contraste | Violet 01 : `#7757fa` (4,64:1) au lieu de `#7a5afa` (4,50:1 tout juste) |
| G3-3 | Focus | Champs : la bordure active de la maquette (`#9277ff`) ; boutons et liens : contour 2 px décalé de 2 px, `#7757fa` en clair, `#9277ff` en sombre (Q-B15) |
| G3-4 | Espacement des lettres | Penpot refuse un espacement négatif sur un texte : la planche l'ignore ; le code applique les valeurs du `.fig` (−0,25 px, −0,1 px…) |
| G3-5 | Écrans comparés aux références | Desktop, tablette et mobile : liste, liste vide, facture, formulaire de création complet, suppression, en clair ; liste et facture en sombre aux 3 largeurs ; 21 écrans |
| G3-6 | Seuil visuel | 5 % par écran, recalibré en Phase 5 si le texte rendu par la police diffère des contours de lettres du `.fig` (méthode : écart mesuré + 1 point, avec ton accord) |
