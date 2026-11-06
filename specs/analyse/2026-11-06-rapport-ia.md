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

## v1.0.1 en local (2026-11-06, accord de Koya : « Oui, corrige »)

| # | Fait | Test |
|---|---|---|
| R3 | S27 : second clic, retour au sombre, gardé au rechargement | S27 (vert d'emblée : garde) |
| R4 | Focus sur `main` (`tabindex="-1"`, sans contour) ou sur la carte quittée ; région `role="status"` avec le titre de la vue ; rien au premier chargement | S35 (rouge avant) |
| R5 | `onclose` de la suppression : focus rendu à « Delete » | S24 étendu à Échap (vert d'emblée : le `<dialog>` natif le faisait déjà) |
| R6 | `role="alert"` sur les messages du bas | S14 (rouge avant) |
| R7 | `invoice.html` retiré | — |
| R8 | `<br>` retiré ; bloc de 192 px (2e ligne desktop : 187,6 px ; « New » remonterait vers 198 px) | S9, S34 (écrans vides : 0,49 à 2,16 %, inchangés) |
| R9 | `@theme static { --breakpoint-md }` ; `@variant md` dans les composants ; `media.svelte.js` lit le token | S1 à S6, S34 |
| R10 | Ligne « Repository » ; table « parcours → scénarios → fichier » (pour R1 et R2) | — |

Parcours réel au clavier (1440 px) : Entrée sur une carte → focus sur le contenu, « Invoice #RT3080 » annoncé ; Tab → « Go back » ; Entrée → focus sur la carte RT3080, « Invoices » annoncé. Le contour du `main` focalisé entourait toute la page : retiré (élément ni interactif ni dans l'ordre du Tab). **96 / 96**. Publication puis « Regenerate report » : chacun avec l'accord de Koya.
