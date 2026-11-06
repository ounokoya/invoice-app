# ADR-0009 : Formats en-GB et identifiants

## Statut
Accepté (2026-11-06) — G2 (Q-B9), D3, D10.

## Décision
- Dates : « 19 Aug 2021 » (jour sur 2 chiffres, mois abrégé anglais, année) calculées sans fuseau (dates ISO `AAAA-MM-JJ` lues comme des dates civiles).
- Montants : « £ » + espace + `Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })`.
- Identifiant : 2 lettres A–Z et 4 chiffres tirés au hasard, retirés tant qu'ils existent déjà.

## Conséquences
- Vérifié par S7, S10, S15 (dates, montants, format et unicité de l'id).
