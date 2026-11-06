# Soumission Frontend Mentor

> SDL-FM 1.6.0 Phase 13. Textes préparés pour le formulaire « Submit solution » du challenge. La soumission est publique et faite au nom de Koya : elle n'est envoyée qu'avec son accord, au moment de l'envoi (« Oui, soumets », 2026-11-06).
>
> **Envoyée le 2026-11-06** avec l'accord de Koya, textes ci-dessous inchangés (les 5 tags existent sur FM) : https://www.frontendmentor.io/solutions/invoice-app-with-svelte-5-tailwind-v4-native-dialogs-and-playwright-8rZnNp_EUI

## Informations générales

| Champ | Valeur |
|---|---|
| Solution title (70 caractères max) | Invoice app with Svelte 5, Tailwind v4, native dialogs & Playwright (67) |
| Repository URL | https://github.com/ounokoya/invoice-app |
| Live site URL | https://ounokoya.github.io/invoice-app/ |
| Tags (5 max, hors HTML/CSS/JS) | `svelte`, `tailwind-css`, `vite`, `accessibility`, `playwright` |
| Visibilité | Public |

Rapport IA : avec Pro, généré dès la soumission (Guru : +200 points).

## What are you most proud of, and what would you do differently next time?

I'm most proud of matching the Figma file closely without guessing: I read its measurements directly, wrote 94 Playwright tests before the code (positions within 1–2 px, 21 screens compared to reference images at 0.4–3.1 %), and every one of them also passes on the live site. The form and the delete prompt are native `<dialog>` elements, so focus trapping and Escape come from the browser.

Next time, I'd scroll through every scrolling area of the design earlier. The "With Scroll" screens had a gradient above the form buttons and a slim scrollbar that my reference images missed, and a double scrollbar in the drawer only showed up in a real browser, because my test window was tall enough for the whole form.

## What challenges did you encounter, and how did you overcome them?

- **Keeping the app bar visible next to a modal drawer**: `showModal()` puts the dialog in the top layer and its backdrop covers the app bar. The drawer renders a decorative copy of the bar inside the dialog, with `aria-hidden` and `inert`, so it shows above the backdrop but screen readers and the keyboard skip it.
- **A double scrollbar**: the visually hidden labels of the item rows are absolutely positioned and took the fixed dialog as their containing block, so the dialog scrolled too. `position: relative` on the scrolling container fixed it, and a test now guards it.
- **Shared state**: one Svelte 5 `$state` store in a `.svelte.js` module, saved to `localStorage` on every change; `data.json` is read again when the browser storage is empty.
- **Contrast**: in the light theme, 14 text/background pairs of the design were under 4.5:1; I used the nearest AA shade of the same hue (for example "Pending" `#ff8f00` → `#ab6000` on its tint).
- **Design inconsistencies**: the tablet empty state and the other sizes use different texts, and one screen shows "There is currently 14 invoices active"; I kept one text and a counter that follows the filter.

## What specific areas of your project would you like help with?

1. The form uses `novalidate` and its own messages to match the design ("can't be empty" next to the label), with `aria-invalid`, `aria-describedby` and focus on the first field in error. Is that clear enough with a screen reader, or would you also announce the error summary?
2. The date and payment terms use a native `input type="date"` and `select`, styled like the design only when closed. Would you build custom pickers to match the design when open, or keep the native ones?
3. The decorative copy of the app bar inside the drawer (`aria-hidden` + `inert`): is there a cleaner way to keep part of the page visible above a modal dialog's backdrop?
