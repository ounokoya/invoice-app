# ADR-0007 : État des factures et persistance dans le navigateur

## Statut
Accepté (2026-11-06) — P1, D2, Q-B13.

## Contexte
Les factures de `data.json` au premier chargement, puis chaque changement gardé (bonus du challenge) ; pas de serveur.

## Décision
- `src/lib/invoices.svelte.js` : un état `$state` (liste des factures) et des fonctions qui le changent (`create`, `update`, `markPaid`, `remove`) ; chaque changement réécrit `localStorage['invoice-app/invoices']` (JSON au format de D1).
- Au démarrage : la clé si elle existe, sinon `data.json` importé dans le build (pas de requête), avec les dates normalisées (D10).
- Règles de gestion dans des fonctions pures testables : `newId` (D3), `paymentDue` (D4), `totals` (D5), `validate` (D6, D7, Q-B8).

## Conséquences
- Vérifié par S15, S16, S25, S26 (contenu de la clé, rechargement, navigateur vidé).
