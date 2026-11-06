import { test, expect } from '@playwright/test'
import { open, DATA, byId, cards, card, newButton, dialog, group, field, button, fillForm, stored, terms, isoPlus } from './helpers.js'

// Spec §2, §3.4 et §8 — S13 à S19 : créer une facture

const REQUIRED = [['Bill From', ['Street Address', 'City', 'Post Code', 'Country']], ['Bill To', ["Client's Name", "Client's Email", 'Street Address', 'City', 'Post Code', 'Country']]]

async function openForm(page) {
  await open(page, 1440, 1000)
  await newButton(page).click()
  const d = dialog(page, 'New Invoice')
  await expect(d).toBeVisible()
  return d
}

test('S13 — formulaire vide, sauf la date du jour et Net 30 Days ; une ligne vide', async ({ page }) => {
  const d = await openForm(page)
  for (const [g, names] of REQUIRED) for (const n of names) await expect(field(group(d, g), n), `${g} · ${n}`).toHaveValue('')
  await expect(field(d, 'Project Description')).toHaveValue('')
  const today = await page.evaluate(() => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}` })
  await expect(field(d, 'Invoice Date')).toHaveValue(today)
  expect(await field(d, 'Payment Terms').evaluate((s) => s.selectedOptions[0].textContent.trim())).toBe(terms(30))
  const row = group(group(d, 'Item List'), 'Item 1')
  for (const n of ['Item Name', 'Qty.', 'Price']) await expect(field(row, n)).toHaveValue('')
})

test('S14 — « Save & Send » vide : chaque champ en erreur, les deux messages, focus sur le 1er champ, rien n\'est créé', async ({ page }) => {
  const d = await openForm(page)
  await button(d, 'Save & Send').click()
  await expect(d).toBeVisible()
  const all = [...REQUIRED.flatMap(([g, names]) => names.map((n) => field(group(d, g), n))), field(d, 'Project Description'),
    ...['Item Name', 'Qty.', 'Price'].map((n) => field(group(group(d, 'Item List'), 'Item 1'), n))]
  for (const f of all) await expect.soft(f).toHaveAttribute('aria-invalid', 'true')
  await expect(d.getByText("can't be empty")).toHaveCount(all.length)
  await expect(d.getByText('- All fields must be added')).toBeVisible()
  await expect(d.getByText('- An item must be added')).toBeVisible()
  for (const m of ['- All fields must be added', '- An item must be added']) await expect(d.getByRole('alert'), 'messages du bas annoncés').toContainText(m)
  await expect(field(group(d, 'Bill From'), 'Street Address')).toBeFocused()
  await button(d, 'Discard').click()
  await expect(cards(page)).toHaveCount(DATA.length)
})

test('S15 — « Save & Send » rempli : 8e facture pending, id D3 unique, échéance, totaux, champs gardés', async ({ page }) => {
  const d = await openForm(page)
  const inv = { ...byId('XM9141'), paymentTerms: 7, clientName: 'Grace Hopper', clientEmail: 'grace@navy.mil' }
  await fillForm(d, inv)
  await expect(field(group(group(d, 'Item List'), 'Item 2'), 'Total')).toHaveValue('400.00')
  await button(d, 'Save & Send').click()
  await expect(d).toBeHidden()
  await expect(cards(page)).toHaveCount(DATA.length + 1)
  const saved = (await stored(page)).at(-1)
  expect(saved.id).toMatch(/^[A-Z]{2}\d{4}$/)
  expect(DATA.map((x) => x.id)).not.toContain(saved.id)
  expect(saved).toMatchObject({
    status: 'pending', createdAt: inv.createdAt, paymentDue: isoPlus(inv.createdAt, 7), paymentTerms: 7, description: inv.description,
    clientName: 'Grace Hopper', clientEmail: 'grace@navy.mil', senderAddress: inv.senderAddress, clientAddress: inv.clientAddress, total: 556,
    items: [{ name: 'Banner Design', quantity: 1, price: 156, total: 156 }, { name: 'Email Design', quantity: 2, price: 200, total: 400 }],
  })
  await expect(card(page, saved.id)).toContainText('Due 28 Aug 2021')
  await expect(card(page, saved.id)).toContainText('Pending')
})

test('S16 — « Save as Draft » avec le seul nom du client : un brouillon, sans erreur', async ({ page }) => {
  const d = await openForm(page)
  await field(group(d, 'Bill To'), "Client's Name").fill('Ada Lovelace')
  await button(d, 'Save as Draft').click()
  await expect(d).toBeHidden()
  const saved = (await stored(page)).at(-1)
  expect(saved).toMatchObject({ status: 'draft', clientName: 'Ada Lovelace' })
  expect(saved.id).toMatch(/^[A-Z]{2}\d{4}$/)
  await expect(card(page, saved.id)).toContainText('Draft')
})

test('S17 — e-mail mal écrit, quantité nulle : « invalid email », « must be positive »', async ({ page }) => {
  const d = await openForm(page)
  await fillForm(d, { ...byId('XM9141'), clientEmail: 'alex@', items: [{ name: 'Banner Design', quantity: 0, price: 156 }] })
  await button(d, 'Save & Send').click()
  await expect(d.getByText('invalid email')).toBeVisible()
  await expect(d.getByText('must be positive')).toBeVisible()
  await expect(field(group(d, 'Bill To'), "Client's Email")).toHaveAttribute('aria-invalid', 'true')
  await expect(cards(page)).toHaveCount(DATA.length)
})

test('S18 — Total de ligne calculé ; ajouter et retirer une ligne', async ({ page }) => {
  const d = await openForm(page)
  const list = group(d, 'Item List')
  const row = group(list, 'Item 1')
  await field(row, 'Qty.').fill('2')
  await field(row, 'Price').fill('200')
  await expect(field(row, 'Total')).toHaveValue('400.00')
  await expect(field(row, 'Total')).not.toBeEditable()
  await field(row, 'Price').focus()
  await page.keyboard.press('Tab')
  await expect(field(row, 'Total'), 'Total lisible au clavier').toBeFocused()
  await field(row, 'Price').fill('12.5')
  await expect(field(row, 'Total')).toHaveValue('25.00')
  await button(d, '+ Add New Item').click()
  await expect(group(list, 'Item 2')).toBeVisible()
  await button(d, 'Delete item 1').click()
  await expect(group(list, 'Item 2')).toHaveCount(0)
  await expect(field(group(list, 'Item 1'), 'Qty.')).toHaveValue('')
})

test('S19 — « Discard » ou Échap : rien n\'est créé, le focus revient à « New Invoice »', async ({ page }) => {
  const d = await openForm(page)
  await field(group(d, 'Bill To'), "Client's Name").fill('Ada Lovelace')
  await button(d, 'Discard').click()
  await expect(d).toBeHidden()
  await expect(newButton(page)).toBeFocused()
  await newButton(page).click()
  await expect(field(group(d, 'Bill To'), "Client's Name")).toHaveValue('')
  await page.keyboard.press('Escape')
  await expect(d).toBeHidden()
  await expect(newButton(page)).toBeFocused()
  await expect(cards(page)).toHaveCount(DATA.length)
})
