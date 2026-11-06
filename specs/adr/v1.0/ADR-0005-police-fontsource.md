# ADR-0005 : League Spartan par Fontsource

## Statut
Accepté (2026-11-06) — même choix que les solutions précédentes ; téléchargement au verrou, avec l'accord de Koya.

## Contexte
Une seule police, League Spartan (Medium 500, Bold 700 ; SemiBold 600 pour un texte de 10 px), sur Google Fonts. Les tests visuels comparent des pixels.

## Décision
- `@fontsource/league-spartan`, fichiers latins 500, 600 et 700, importés dans `src/app.css`.

## Conséquences
- Aucun appel à un serveur de polices. Fitness function (« ADR-0005 ») : rien n'est chargé hors du domaine ; les 3 graisses se chargent.
