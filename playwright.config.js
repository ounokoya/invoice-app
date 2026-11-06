import { defineConfig, devices } from '@playwright/test'

// Tests dérivés de la spec — ADR-0002 commun
// BASE_URL=https://ounokoya.github.io/invoice-app/ npm test : vérifie le site en ligne (sans les tests visuels : références hors dépôt)
const LOCAL = 'http://localhost:4260/invoice-app/'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || LOCAL,
    ...devices['Desktop Chrome'],
    launchOptions: { args: ['--disable-lcd-text'] },
  },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --port 4260 --strictPort',
    url: LOCAL,
    reuseExistingServer: !process.env.CI,
  },
})
