# ADR-0006 : Navigation par ancre

## Statut
Accepté (2026-11-06) — G2 (Q-B1).

## Contexte
GitHub Pages sert des fichiers statiques : une adresse par chemin (`/invoice/XM9141`) répondrait 404 au rechargement. Le filtre doit survivre au retour et au rechargement.

## Décision
- Adresses `#/` (liste, `?status=pending,paid` dans l'ancre) et `#/invoice/<id>` ; un petit routeur lit `location.hash` et écoute `hashchange`.
- Le filtre réécrit l'adresse sans nouvelle entrée d'historique (`history.replaceState`) ; ouvrir une facture en ajoute une.
- Titre du document par vue (§3.5 de la spec).

## Conséquences
- Vérifié par S8 (adresse du filtre, rechargement) et S10, S11 (adresse de la facture, retour, id inconnu).
