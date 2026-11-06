import { test, expect } from '@playwright/test'
import { open, DATA, KEY, THEME_KEY, cards, card, title, main, button, dialog, group, field, goBack, newButton, themeButton, pixel, hex, close, style, sameColor } from './helpers.js'

// Spec §2, §4, §6 et §8 — S25 à S28 : persistance et thème

test('S25 — création, modification, paiement, suppression : retrouvés après rechargement', async ({ page }) => {
  await open(page, 1440, 1000)
  await newButton(page).click()
  const d = dialog(page, 'New Invoice')
  await field(group(d, 'Bill To'), "Client's Name").fill('Ada Lovelace')
  await button(d, 'Save as Draft').click()
  await card(page, 'XM9141').click()
  await button(page, 'Edit').click()
  await field(group(dialog(page, 'Edit #XM9141'), 'Bill To'), "Client's Name").fill('Alex Green')
  await button(dialog(page, 'Edit #XM9141'), 'Save Changes').click()
  await goBack(page).click()
  await card(page, 'RT2080').click()
  await button(page, 'Mark as Paid').click()
  await goBack(page).click()
  await card(page, 'TY9141').click()
  await button(page, 'Delete').click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click()

  await page.reload()
  await expect(cards(page)).toHaveCount(DATA.length) // +1 créée, −1 supprimée
  await expect(main(page).getByText('Ada Lovelace')).toBeVisible()
  await expect(card(page, 'XM9141')).toContainText('Alex Green')
  await expect(card(page, 'RT2080')).toContainText('Paid')
  await expect(card(page, 'TY9141')).toHaveCount(0)
})

test('S26 — navigateur vidé : les 7 factures de data.json', async ({ page }) => {
  await open(page, 1440, 900, { invoices: [] })
  await expect(cards(page)).toHaveCount(0)
  await page.evaluate((key) => localStorage.removeItem(key), KEY)
  await page.reload()
  await expect(cards(page)).toHaveCount(DATA.length)

  // Données gardées sans la forme de D1 : data.json est relu (rapport regénéré, N1)
  const { items, ...withoutItems } = DATA[0]
  for (const saved of [[null], [withoutItems], [{ ...DATA[0], status: 'sent' }]]) {
    await open(page, 1440, 900, { invoices: saved })
    await expect(cards(page), JSON.stringify(saved).slice(0, 40)).toHaveCount(DATA.length)
  }
  expect(items.length).toBeGreaterThan(0)
})

test('S27 — thème de l\'appareil au premier passage, puis le choix gardé', async ({ page }) => {
  await open(page, 1440, 800, { theme: 'dark' })
  expect(close(await pixel(page, 600, 30), hex('#141625')), 'fond sombre').toBe(true)
  await expect(themeButton(page)).toHaveAccessibleName('Switch to light theme')
  await themeButton(page).click()
  expect(close(await pixel(page, 600, 30), hex('#f8f8fb')), 'fond clair').toBe(true)
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('light')
  await page.reload()
  expect(close(await pixel(page, 600, 30), hex('#f8f8fb')), 'fond clair gardé').toBe(true)
  await expect(themeButton(page)).toHaveAccessibleName('Switch to dark theme')
  await themeButton(page).click()
  expect(close(await pixel(page, 600, 30), hex('#141625')), 'retour au sombre').toBe(true)
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('dark')
  await page.reload()
  expect(close(await pixel(page, 600, 30), hex('#141625')), 'sombre gardé').toBe(true)
  await expect(themeButton(page)).toHaveAccessibleName('Switch to light theme')
})

const THEMES = {
  light: { page: '#f8f8fb', card: '#ffffff', bar: '#373b53', ink: '#0c0e16', paid: '#1a8360', pending: '#ab6000', draft: '#373b53', primary: '#7757fa' },
  dark: { page: '#141625', card: '#1e2139', bar: '#1e2139', ink: '#ffffff', paid: '#33d69f', pending: '#ff8f00', draft: '#dfe3fa', primary: '#7757fa' },
}

for (const [theme, c] of Object.entries(THEMES)) {
  test(`S28 — thème ${theme} : fonds, textes, badges`, async ({ page }) => {
    await open(page, 1440, 800, { storedTheme: theme })
    expect.soft(close(await pixel(page, 600, 30), hex(c.page)), 'fond de page').toBe(true)
    expect.soft(close(await pixel(page, 50, 400), hex(c.bar)), 'barre').toBe(true)
    expect.soft(close(await pixel(page, 370, 210), hex(c.card)), 'carte').toBe(true)
    expect.soft(await sameColor(page, await style(title(page, 'Invoices'), 'color'), c.ink), 'titre').toBe(true)
    expect.soft(await sameColor(page, await style(newButton(page), 'backgroundColor'), c.primary), 'New Invoice').toBe(true)
    for (const [id, status] of [['RT3080', 'paid'], ['XM9141', 'pending'], ['FV2353', 'draft']]) {
      const badge = card(page, id).getByText(status[0].toUpperCase() + status.slice(1), { exact: true })
      expect.soft(await sameColor(page, await style(badge, 'color'), c[status]), `badge ${status}`).toBe(true)
    }
  })
}
