import { test, expect } from '@playwright/test'
import { existsSync } from 'node:fs'
import { open, byId, newButton, dialog, button, fillForm, diffRatio } from './helpers.js'

// Spec §8 — S34 : les 21 écrans de G3-5 comparés aux références corrigées AA (design/reference-aa, hors dépôt : maquettes premium).
// Sans ces références (site en ligne, autre poste), les tests sont sautés.

const REF = new URL('../design/reference-aa/', import.meta.url).pathname
const MAX = 0.05
const SIZES = { desktop: 1440, tablet: 768, mobile: 375 }
const VIEWS = {
  'invoices': { h: { desktop: 800, tablet: 1024, mobile: 1319 } },
  'invoices-empty': { h: { desktop: 800, tablet: 1024, mobile: 667 }, empty: true },
  'view-invoice': { h: { desktop: 908, tablet: 1024, mobile: 1100 }, go: async (page) => page.goto('./#/invoice/XM9141') },
  'create-invoice': { h: { desktop: 1424, tablet: 1504, mobile: 2149 }, file: { desktop: 'desktop-create-invoice-full-form' }, go: async (page) => { await newButton(page).click(); await fillForm(dialog(page, 'New Invoice'), byId('XM9141')) } },
  'delete-prompt': { h: { desktop: 1024, tablet: 1024, mobile: 1100 }, go: async (page) => { await page.goto('./#/invoice/XM9141'); await button(page, 'Delete').click() } },
}
const SCREENS = []
for (const [view, v] of Object.entries(VIEWS)) for (const size of Object.keys(SIZES)) SCREENS.push({ view, size, v, theme: 'light' })
for (const view of ['invoices', 'view-invoice']) for (const size of Object.keys(SIZES)) SCREENS.push({ view, size, v: VIEWS[view], theme: 'dark' })

for (const { view, size, v, theme } of SCREENS) {
  const file = `${v.file?.[size] ?? `${size}-${view}`}${theme === 'dark' ? '-dark' : ''}.png`
  test(`S34 — ${file} (≤ ${MAX * 100} %)`, async ({ page }, testInfo) => {
    test.skip(!existsSync(REF + file), 'références de la maquette absentes (hors dépôt)')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, SIZES[size], v.h[size], { storedTheme: theme, invoices: v.empty ? [] : undefined })
    if (v.go) await v.go(page)
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))))
    await page.mouse.move(0, v.h[size] - 1)
    await page.evaluate(() => document.activeElement?.blur())
    const shot = await page.screenshot({ caret: 'hide', animations: 'disabled' })
    await testInfo.attach(file, { body: shot, contentType: 'image/png' })
    const ratio = diffRatio(shot, REF + file)
    testInfo.annotations.push({ type: 'pixels différents', description: `${(ratio * 100).toFixed(2)} %` })
    expect(ratio).toBeLessThanOrEqual(MAX)
  })
}
