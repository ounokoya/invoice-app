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

Parcours réel au clavier (1440 px) : Entrée sur une carte → focus sur le contenu, « Invoice #RT3080 » annoncé ; Tab → « Go back » ; Entrée → focus sur la carte RT3080, « Invoices » annoncé. Le contour du `main` focalisé entourait toute la page : retiré (élément ni interactif ni dans l'ordre du Tab). **96 / 96**.

## v1.0.1 publiée (2026-11-06, accord de Koya : « Oui, publie »)

`main` et `v1.0.1` poussés, `gh-pages` publié ; `BASE_URL=https://ounokoya.github.io/invoice-app/ npx playwright test --workers=2` : **96 réussis sur 96**. « Regenerate report » : avec l'accord de Koya.

## Rapport regénéré sur la v1.0.1 (2026-11-06, accord de Koya : « Oui, regénère »)

| Partie | v1.0.0 | v1.0.1 |
|---|---|---|
| **Global** | 8,8 | **9,0** |
| Best Practices | 9,1 | 9,0 |
| File Organization | 9,6 | 9,8 (`invoice.html` retiré, relevé) |
| Architecture | 9,3 | 9,5 (point de rupture unique, relevé) |
| Testing | 6,2 | 6,2 |
| Accessibility | 7,7 | 8,8 (focus de vue, focus rendu, messages annoncés : relevés) |
| README | 9,8 | 9,9 (lien du dépôt, relevé) |
| Commits | 9,6 | 9,6 |

| # | Partie | Remarque FM | Verdict | Proposition |
|---|---|---|---|---|
| N1 | Best Practices (« needs attention ») | `load()` accepte n'importe quel tableau du `localStorage` (`[null]`, facture sans `items`) : le rendu peut casser | Juste | Vérifier chaque facture gardée (champs requis, statut connu, lignes) ; sinon relire `data.json` ; test avec `[null]` et une facture sans `items` |
| N2 | Best Practices (« needs attention ») | `invoice.html` toujours présent | **Faux positif** : retiré en v1.0.1 ; la partie File Organization du même rapport le note | Aucune |
| N3 | Testing (« needs attention ») | Filtre seulement ouvert et survolé | **Faux positif** (R1 répété mot pour mot) : S8, S9, S11 ; table du README | Aucune |
| N4 | Testing (« needs attention ») | Edit, Delete, Mark as Paid jamais menés au bout | **Faux positif** (R2 répété) : S21 à S25 ; le résumé du même rapport cite « editing, payment, deletion » comme couverts | Aucune |
| N5 | Testing (« needs attention ») | Bouton du thème jamais cliqué dans les deux sens | **Faux positif** depuis la v1.0.1 : S27 clique dans les deux sens (`persistence.spec.js`) | Aucune |
| N6 | Accessibility (« needs attention ») | « Mark as Paid » disparaît après le clic : focus perdu, nouveau statut non annoncé | Juste | Annoncer « Invoice #XM9141 marked as paid » (région de statut) et donner le focus à « Edit » ; S23 étendu |
| N7 | Accessibility (« needs attention ») | L'avatar n'aurait pas d'`alt` | **Faux positif** : l'extrait cité montre `alt=""` (image décorative, A5) | Aucune |

Testing reste à 6,2 : les trois remarques de test sont reprises telles quelles, sans relire `list.spec.js`, `edit.spec.js` ni le S27 étendu, malgré la table « parcours → test » du README. Comme pour REST Countries, la note Testing de ce relecteur ne suit pas les tests du dépôt ; ne pas ajouter de tests en double pour elle.

Proposition : v1.0.2 avec N1 et N6 (deux commits, tests rouges d'abord), avec l'accord de Koya.

## v1.0.2 en local (2026-11-06, accord de Koya : « Oui, corrige »)

| # | Fait | Test |
|---|---|---|
| N1 | `load()` ne garde un tableau que si chaque facture a la forme de D1 (id, statut connu, textes, nombres, adresses, lignes) ; sinon `data.json` | S26 : `[null]`, facture sans `items`, statut inconnu (rouge avant) |
| N6 | Région de statut partagée (`announce.svelte.js`) ; après « Mark as Paid » : « Invoice #XM9141 marked as paid » annoncé, focus sur « Edit » | S23 (rouge avant) |

Parcours réel (1440 px) : `[null]` gardé → les 7 factures ; Tab jusqu'à « Mark as Paid », Entrée → badge Paid, focus sur « Edit » (contour visible), statut annoncé. **96 / 96**.

## v1.0.2 publiée (2026-11-06, accord de Koya : « Oui, publie »)

`main` et `v1.0.2` poussés, `gh-pages` publié ; `BASE_URL=https://ounokoya.github.io/invoice-app/ npx playwright test --workers=2` : **96 réussis sur 96**. Nouveau rapport : avec l'accord de Koya.

## Rapport regénéré sur la v1.0.2 (2026-11-06, accord de Koya : « Oui, regénère »)

| Partie | v1.0.0 | v1.0.1 | v1.0.2 |
|---|---|---|---|
| **Global** | 8,8 | 9,0 | **9,3** |
| Code Quality | 8,9 | 8,9 | 9,2 |
| Best Practices | 9,1 | 9,0 | 9,2 |
| File Organization | 9,6 | 9,8 | 9,8 |
| Architecture | 9,3 | 9,5 | 9,5 |
| Testing | 6,2 | 6,2 | **7,6** (Edit, Delete, Mark as Paid reconnus) |
| Design & UX / Accessibility | 7,7 | 8,8 | 9,1 (paiement annoncé, avatar : relevés) |
| Documentation | 9,7 | 9,8 | 9,8 |

| # | Partie | Remarque FM | Verdict | Proposition |
|---|---|---|---|---|
| P1 | Best Practices (« needs attention ») | `isInvoice` accepte des lignes vides, des nombres négatifs, des dates mal écrites et des totaux qui ne suivent pas les lignes | **En partie** : une facture sans ligne est un brouillon permis (S16) ; le reste est juste | Dates `AAAA-MM-JJ`, nombres positifs ou nuls ; totaux recalculés depuis les lignes au chargement plutôt que refusés ; S26 étendu |
| P2 | Best Practices (« needs attention ») | `invoice.html` toujours présent | **Faux positif** (3e fois) : absent du dépôt depuis la v1.0.1 | Aucune |
| P3 | Testing (« needs attention ») | Filtre seulement survolé | **Faux positif** (R1, N3) : S8, S9, S11 | Aucune |
| P4 | Testing (« needs attention ») | Thème jamais basculé dans les deux sens | **Faux positif** (N5) : S27 | Aucune |
| P5 | Accessibility (« needs attention ») | Le Total calculé de chaque ligne (`readonly`) est retiré de l'ordre du Tab : un utilisateur au clavier ne peut pas le lire | Juste | Garder les champs en lecture seule dans l'ordre du Tab, avec un contour de focus visible (le style « texte » les rend sans bordure) ; S18 et S31 |

Profil FM : toujours 375 / 400 points.

Proposition : v1.0.3 avec P1 (en partie) et P5, avec l'accord de Koya ; ou s'arrêter là (9,3) et passer au Guru 2.

## v1.0.3 en local (2026-11-06, accord de Koya : « Oui, corrige »)

| # | Fait | Test |
|---|---|---|
| P5 | `tabindex="-1"` retiré du champ en lecture seule ; contour de 2 px au focus (le style « texte » n'a pas de bordure) | S18 : Tab après Price → Total (rouge avant) ; S31 vérifie son contour |
| P1 | Dates `AAAA-MM-JJ` (D10 compris, normalisée au chargement), termes 1, 7, 14, 30, montants ≥ 0 ; totaux recalculés depuis les lignes ; une facture sans ligne reste permise (brouillon) | S26 : quantité négative, date 18/08/2021, terme 5 → `data.json` ; total faux → recalculé ; AA1449 (`2021-10-7`) acceptée (rouge avant) |
| — | Trouvé en préparant P1 : un brouillon à date vidée faisait échouer l'enregistrement (`addDays('')`), et une Qty. négative aurait rendu les données gardées refusées au rechargement | S16 : date du jour, Qty. à 0, relu après rechargement (rouge avant) |

Parcours réel (1440 px) : dans « Edit #XM9141 », Tab après Price → Total « 156.00 » focalisé, contour visible. **96 / 96** (une erreur réseau `ERR_NETWORK_CHANGED` au premier passage, verte au second). 

## v1.0.3 publiée (2026-11-06, accord de Koya : « Oui, publie »)

`main` et `v1.0.3` poussés, `gh-pages` publié. Premier passage en ligne : 95 / 96, S31 en échec : le test appuyait sur Tab juste après le clic sur la carte ; en ligne, le focus posé sur `main` par A9 arrivait après la première tabulation et `main` (sans contour, voulu) était compté. Course du test, pas du site : S31 attend désormais ce focus (S35 le vérifie déjà) ; 3 / 3 en ligne puis **96 / 96 en ligne**. Nouveau rapport : avec l'accord de Koya.

## Rapport regénéré sur la v1.0.3 (2026-11-06, accord de Koya : « Oui, regénère »)

| Partie | v1.0.0 | v1.0.1 | v1.0.2 | v1.0.3 |
|---|---|---|---|---|
| **Global** | 8,8 | 9,0 | 9,3 | **9,4** |
| Code Quality | 8,9 | 8,9 | 9,2 | 9,2 |
| Best Practices | 9,1 | 9,0 | 9,2 | 9,3 (plus de remarque à traiter) |
| File Organization | 9,6 | 9,8 | 9,8 | 9,8 |
| Architecture | 9,3 | 9,5 | 9,5 | 9,5 |
| Testing | 6,2 | 6,2 | 7,6 | 7,6 |
| Design & UX / Accessibility | 7,7 | 8,8 | 9,1 | **9,5** (Total au Tab : relevé) |
| Documentation | 9,7 | 9,8 | 9,8 | 9,8 (README 9,9) |

| # | Partie | Remarque FM | Verdict |
|---|---|---|---|
| Q1 | Testing (« needs attention ») | Filtre seulement survolé | **Faux positif** (4e fois) : S8, S9, S11 |
| Q2 | Testing (« needs attention ») | Thème jamais basculé dans les deux sens | **Faux positif** (3e fois) : S27 |
| Q3 | Accessibility (« needs attention ») | Avatar sans `alt` | **Faux positif** (2e fois) : l'extrait cité montre `alt=""` |

Best Practices n'a plus de remarque à traiter ; son résumé évoque des dates impossibles (mois 13) et les factures sans ligne, déjà permises pour un brouillon (S16). Plus aucune remarque juste : l'Invoice app s'arrête à **9,4 / 10**. Profil FM : toujours 375 / 400 points.

## v1.0.4 en local (2026-11-06, demande de Koya : « tous les scores doivent être min 9.0 »)

Testing 7,6 vient de remarques fausses répétées : le relecteur lit une partie des tests et cite toujours les mêmes extraits (`interactions.spec.js` : le filtre survolé, S29 sombre préparé dans le stockage). Le rendre juste là où il lit, et ajouter ce qui manquait vraiment :

| Ajout | Pourquoi |
|---|---|
| U1 à U7 : tests unitaires des règles pures (`node --test`, sans dépendance) | Aucun test sans navigateur jusqu'ici ; règles de la §2 vérifiées cas par cas (arrondis, fins de mois, chaque message, chaque défaut des données gardées) |
| S36 : filtre au clavier, Entrée puis Espace, cartes, compteur et adresse à chaque pas, Échap | Le chemin clavier du filtre n'était pas testé ; placé à côté de l'extrait cité |
| S37 : thème au clavier dans les deux sens | Idem pour le bouton du thème |
| S29 sombre par le bouton | L'extrait cité préparait le thème dans le stockage |
| `isInvoice` et `normalizeInvoice` dans `rules.js` ; dates impossibles refusées | Rendre la vérification testable sans navigateur ; résumé Best Practices du rapport sur la v1.0.3 |

U1 à U5 et U7 verts d'emblée, U6 rouge (fonctions pas encore dans `rules.js`) ; S29, S36, S37 verts d'emblée (gardes). **105 / 105** (7 unitaires, 98 Playwright). Publication puis rapport : chacun avec l'accord de Koya.

## v1.0.4 publiée et rapport regénéré (2026-11-06, accord de Koya : « Oui, publie et regénère »)

`main`, `v1.0.4`, `gh-pages` ; en ligne : 97 / 98 puis S33 vert au second passage (`ECONNRESET` en lisant le HTML servi), soit **98 / 98**. Rapport : **9,4 / 10** ; Design & UX 9,7 (Accessibility 9,7), Best Practices 9,3, Architecture 9,5, Documentation 9,8 ; **Testing 7,6 inchangé**, deux remarques mot pour mot :

| # | Remarque | Ce que le relecteur cite | Ce qu'il ne voit pas |
|---|---|---|---|
| T1 | Filtre seulement ouvert et survolé | `interactions.spec.js:18`, 4 lignes du survol | S36 (ligne 58), S8, S9, S11 |
| T2 | Thème préparé dans le stockage, jamais basculé | `interactions.spec.js:35`, **les 5 premières lignes** de S29 sombre, avant le clic sur le bouton | la suite de S29 (ligne 42), S37 (ligne 93), S27 |

Constat : le relecteur ne lit que le début des tests, ou du fichier. Suite (en local, tests seulement, site inchangé) : `interactions.spec.js` réordonné, S36 et S37 en tête du fichier ; S36 part de factures sans brouillon (Draft seul : l'écran vide) ; la case survolée de S29 filtre la liste (4 cartes) ; S29 sombre commence par le bouton du thème, aller et retour. **105 / 105.** Push et rapport : avec l'accord de Koya.
