# 2026-11-06 — Rapport IA FM : Invoice app (v1.0.0)

> Étape F (Pro). Soumission du 2026-11-06 avec l'accord de Koya (« Oui, soumets ») ; le rapport IA est généré dès la soumission, sans autre action. Rapport : https://www.frontendmentor.io/solutions/invoice-app-with-svelte-5-tailwind-v4-native-dialogs-and-playwright-8rZnNp_EUI/report — seul l'auteur le voit. Tri fait en relisant les tests et le code avant chaque verdict (M41).

## Notes

| Partie | Note |
|---|---|
| **Global** | **8,8 / 10** (Exceptional) |
| Code Quality | 8,9 : Best Practices 9,1 · File Organization 9,6 · Architecture 9,3 · Testing **6,2** |
| Design & UX | 7,7 : Accessibility **7,7** |
| Documentation | 9,7 : README 9,8 · Commits 9,6 |

Profil FM juste après la soumission : 375 points (« 375 / 400 » vers le niveau 4), « updates with every AI code review » ; les points du Guru n'y étaient pas encore.

## Remarques triées

| # | Partie | Remarque FM | Verdict | Proposition |
|---|---|---|---|---|
| R1 | Testing (« needs attention ») | Le filtre est seulement ouvert et survolé ; aucun statut choisi, aucun résultat vérifié | **Faux positif** : S8 (`list.spec.js`) passe par chaque combinaison du filtre (cartes, ordre, compteur, adresse, rechargement), S9 par un filtre sans résultat, S11 garde le filtre au retour | Aucun test à ajouter ; une table « workflow → test » dans le README pour qu'un relecteur trouve ces tests |
| R2 | Testing (« needs attention ») | Edit, Delete et Mark as Paid seulement ouverts, jamais menés au bout | **Faux positif** : S21 enregistre une modification (facture et carte), S22 fait passer un brouillon en `pending`, S23 paie une facture, S24 supprime après confirmation (compteur à 6), S25 retrouve tout après rechargement (`edit.spec.js`, `persistence.spec.js`) | Même table dans le README |
| R3 | Testing (« needs attention ») | Le bouton du thème n'est jamais cliqué, ni dans les deux sens | **En partie** : S27 (`persistence.spec.js`) clique le bouton (sombre → clair), vérifie le fond, le stockage et le choix gardé au rechargement ; le retour vers le sombre n'est pas vérifié | S27 : second clic, retour au sombre vérifié |
| R4 | Accessibility (« needs attention ») | Changement de vue sans déplacement du focus ni annonce | Juste | Focus sur le `h1` de la nouvelle vue (pas au premier chargement) ; au retour à la liste, focus sur la carte de la facture quittée ; tests |
| R5 | Accessibility (« needs attention ») | La suppression ne rend pas le focus au bouton qui l'a ouverte | **En partie** : le `<dialog>` natif rend déjà le focus (S24 vérifie que « Delete » a le focus après Cancel), mais rien ne le garantit dans le code | `onclose` qui rend le focus au bouton, comme le formulaire |
| R6 | Accessibility (« needs attention ») | Les messages du bas du formulaire ne sont pas annoncés | Juste | `role="alert"` sur ces messages ; le focus reste sur le premier champ en erreur ; test |
| R7 | Best Practices (« needs attention »), File Organization | `invoice.html` du starter (textes et commentaires « Add … ») reste à la racine | Juste | Retirer `invoice.html` |
| R8 | Best Practices (suggestion) | `<br>` forcé dans le texte de l'écran vide | Juste | Retirer le `<br>` ; largeur du bloc calée par mesure dans Chromium pour garder les deux lignes de la maquette (règle 1.3.0) |
| R9 | Architecture (suggestion) | Le point de rupture `48rem` est écrit dans le JS et dans le CSS | Juste, mineur | Une seule source : le token `--breakpoint-md` de `@theme`, lu par `media.svelte.js` ; `@variant md` au lieu des `@media (width >= 48rem)` écrits à la main |
| R10 | README (suggestion) | Pas de lien direct vers le dépôt dans « Links » | Juste | Ligne « Repository » dans « Links » |

Deux faux positifs (R1, R2) : comme pour REST Countries, le relecteur ne lit qu'une partie des tests (il cite `form.spec.js`, `interactions.spec.js`, `layout.spec.js` et S25). Testing 6,2 vient surtout d'eux ; la table « workflow → test » du README vise à les rendre visibles.

## Proposition : v1.0.1

R3 à R10 corrigés, un commit par remarque, tests ajoutés pour R3, R4, R5 et R6 (rouges avant le correctif) ; README : table des tests et lien du dépôt ; publication puis « Regenerate report », chacun avec l'accord de Koya.
