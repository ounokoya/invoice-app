// Thème : celui de l'appareil au premier passage, puis le choix gardé (ADR-0004, Q-B10)

const KEY = 'invoice-app/theme'

function initial() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* stockage indisponible */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const theme = $state({ value: initial() })
document.documentElement.dataset.theme = theme.value

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  try { localStorage.setItem(KEY, theme.value) } catch { /* stockage indisponible */ }
}
