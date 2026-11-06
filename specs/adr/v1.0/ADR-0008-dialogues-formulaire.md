# ADR-0008 : Formulaire et suppression en `dialog` natif ; contrôles natifs ; validation sur mesure

## Statut
Accepté (2026-11-06) — G2 (Q-B2, Q-B3, Q-B8, Q-B15).

## Contexte
Le formulaire est un tiroir (desktop, tablette) ou une page (mobile) ; la suppression est une alerte ; le focus doit rester dans le dialogue et revenir au bouton d'origine ; les messages d'erreur sont ceux de la maquette.

## Options
| Option | Pour | Contre |
|---|---|---|
| **`dialog` + `showModal()` (choisie)** | Focus piégé, Échap, couche supérieure et `::backdrop` fournis par le navigateur | Style du tiroir à écrire |
| `div` + gestion du focus à la main | Contrôle total | Code d'accessibilité à refaire et à tester |

## Décision
- `InvoiceForm` et `DeleteDialog` dans un `dialog` ouvert par `showModal()` ; voile par `::backdrop` (noir 50 %) ; à la fermeture, le focus revient au bouton qui l'a ouvert ; la suppression a `role="alertdialog"`.
- Champs : `fieldset` / `legend` (« Bill From », « Bill To », « Item List », « Item 1 »…) ; `input type="date"` et `select` natifs, stylés fermés (Q-B3).
- Validation sur mesure (`novalidate`) : messages de la spec sous chaque champ, liés par `aria-describedby`, `aria-invalid` ; le premier champ en erreur reçoit le focus.

## Conséquences
- Vérifié par S13 à S24 et S31 (focus piégé, retour du focus).
