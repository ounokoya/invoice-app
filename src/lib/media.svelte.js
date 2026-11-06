// Largeur de la fenêtre : textes courts sous 768 px (spec §3.2, Q-B5)

const query = matchMedia('(min-width: 48rem)')
export const screen = $state({ wide: query.matches })
query.addEventListener('change', (event) => { screen.wide = event.matches })
