// Largeur de la fenêtre : textes courts sous 768 px (spec §3.2, Q-B5).
// Le point de rupture vient du token --breakpoint-md de src/app.css, le même que les variantes md: du CSS.

const md = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim()
const query = matchMedia(`(min-width: ${md})`)
export const screen = $state({ wide: query.matches })
query.addEventListener('change', (event) => { screen.wide = event.matches })
