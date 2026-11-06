import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { open, title, newButton, dialog, button, alert } from './helpers.js'

// Spec §7 et §8 — S32 : aucune violation sérieuse ou critique ; repères (A2)

const VIEWS = {
  'liste': async (page) => { await expect(title(page, 'Invoices')).toBeVisible() },
  'facture': async (page) => { await page.goto('./#/invoice/XM9141'); await expect(title(page, '#XM9141')).toBeVisible() },
  'formulaire en erreur': async (page) => { await newButton(page).click(); await button(dialog(page, 'New Invoice'), 'Save & Send').click(); await expect(dialog(page, 'New Invoice').getByText('- All fields must be added')).toBeVisible() },
  'suppression': async (page) => { await page.goto('./#/invoice/XM9141'); await button(page, 'Delete').click(); await expect(alert(page)).toBeVisible() },
}

for (const theme of ['light', 'dark']) {
  for (const width of [375, 768, 1440]) {
    for (const [name, go] of Object.entries(VIEWS)) {
      test(`S32 — axe-core : ${name} (${theme}, ${width} px)`, async ({ page }) => {
        await open(page, width, 1000, { storedTheme: theme })
        await go(page)
        const { violations } = await new AxeBuilder({ page }).analyze()
        const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact))
        expect(serious.map((v) => `${v.id} : ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
      })
    }
  }
}

test('A2 — une barre (banner), un contenu (main) ; dialogues nommés', async ({ page }) => {
  await open(page, 1440)
  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.getByRole('main')).toHaveCount(1)
  await newButton(page).click()
  await expect(dialog(page, 'New Invoice')).toHaveCount(1)
})
