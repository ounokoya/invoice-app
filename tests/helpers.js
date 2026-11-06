import { readFileSync } from 'node:fs'
import { expect } from '@playwright/test'
import { PNG } from 'pngjs'

// Les tests ne s'appuient que sur la spec (specs/specifications/invoice-app.md) : rôles et noms accessibles (§7),
// contenu (§3), règles (§2), comportement (§6), clés de sauvegarde (D2, §6) ; jamais sur des classes.

export const DATA = JSON.parse(readFileSync(new URL('../data.json', import.meta.url), 'utf8'))
export const KEY = 'invoice-app/invoices'
export const THEME_KEY = 'invoice-app/theme'
export const byId = (id) => DATA.find((invoice) => invoice.id === id)

// Formats de la §2 (en-GB)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const day = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}` }
export const money = (n) => `£ ${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const label = (status) => status[0].toUpperCase() + status.slice(1)
export const terms = (n) => `Net ${n} ${n === 1 ? 'Day' : 'Days'}`
export const isoPlus = (iso, days) => { const [y, m, d] = iso.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d + days)); return t.toISOString().slice(0, 10) }

// Ouvre l'app ; fresh : navigateur vidé de ses données ; invoices : factures déjà gardées (clé D2)
export async function open(page, width, height = 900, { path = './', theme = 'light', fresh = true, invoices, storedTheme } = {}) {
  await page.setViewportSize({ width, height })
  await page.emulateMedia({ colorScheme: theme })
  if (fresh || invoices || storedTheme) {
    await page.goto('./')
    await page.evaluate(([key, list, themeKey, t]) => {
      localStorage.clear()
      if (list) localStorage.setItem(key, JSON.stringify(list))
      if (t) localStorage.setItem(themeKey, t)
    }, [KEY, invoices ?? null, THEME_KEY, storedTheme ?? null])
  }
  await page.goto(path)
  if ((invoices || storedTheme) && path.includes('#')) await page.reload()
  await page.evaluate(() => document.fonts.ready)
}

export const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), KEY)

export const banner = (page) => page.getByRole('banner')
export const main = (page) => page.getByRole('main')
export const title = (page, name) => page.getByRole('heading', { level: 1, name, exact: true })
export const cards = (page) => main(page).getByRole('link', { name: /^#[A-Z]{2}\d{4}\b/ })
export const card = (page, id) => main(page).getByRole('link', { name: new RegExp(`^#${id}\\b`) })
export const newButton = (page) => page.getByRole('button', { name: 'New Invoice', exact: true })
export const filterButton = (page) => page.getByRole('button', { name: 'Filter by status', exact: true })
export const statusBox = (page, name) => page.getByRole('checkbox', { name, exact: true })
export const counter = (page) => main(page).getByText(/^(There (are|is) .* invoices?|No invoices|\d+ invoices?)$/)
export const themeButton = (page) => page.getByRole('button', { name: /^Switch to (dark|light) theme$/ })
export const button = (scope, name) => scope.getByRole('button', { name, exact: true })
export const dialog = (page, name) => page.getByRole('dialog', { name, exact: true })
export const alert = (page) => page.getByRole('alertdialog', { name: 'Confirm Deletion', exact: true })
export const group = (scope, name) => scope.getByRole('group', { name, exact: true })
export const field = (scope, name) => scope.getByLabel(name, { exact: true })
export const goBack = (page) => page.getByRole('link', { name: 'Go back', exact: true })

// Coche exactement les statuts donnés dans le filtre
export async function filterBy(page, statuses) {
  if (!(await statusBox(page, 'Draft').isVisible())) await filterButton(page).click()
  for (const s of ['Draft', 'Pending', 'Paid']) await statusBox(page, s).setChecked(statuses.includes(s))
}

// Remplit le formulaire avec une facture (au format de D1)
export async function fillForm(d, inv, { date = true } = {}) {
  const from = group(d, 'Bill From'); const to = group(d, 'Bill To')
  for (const [name, key] of [['Street Address', 'street'], ['City', 'city'], ['Post Code', 'postCode'], ['Country', 'country']]) {
    await field(from, name).fill(inv.senderAddress[key])
    await field(to, name).fill(inv.clientAddress[key])
  }
  await field(to, "Client's Name").fill(inv.clientName)
  await field(to, "Client's Email").fill(inv.clientEmail)
  if (date) await field(d, 'Invoice Date').fill(inv.createdAt)
  await field(d, 'Payment Terms').selectOption({ label: terms(inv.paymentTerms) })
  await field(d, 'Project Description').fill(inv.description)
  const list = group(d, 'Item List')
  for (const [i, item] of inv.items.entries()) {
    if (!(await group(list, `Item ${i + 1}`).count())) await button(d, '+ Add New Item').click()
    const row = group(list, `Item ${i + 1}`)
    await field(row, 'Item Name').fill(item.name)
    await field(row, 'Qty.').fill(String(item.quantity))
    await field(row, 'Price').fill(String(item.price))
  }
}

// Boîte dans la page, arrondie au pixel
export const pageBox = (locator) => locator.evaluate((el) => {
  const b = el.getBoundingClientRect()
  return { x: Math.round(b.x + scrollX), y: Math.round(b.y + scrollY), width: Math.round(b.width), height: Math.round(b.height) }
})
// Boîte du plus proche ancêtre au fond non transparent (cartes, barres, tiroir)
export const surfaceBox = (locator) => locator.evaluate((el) => {
  let n = el.parentElement
  while (n && getComputedStyle(n).backgroundColor === 'rgba(0, 0, 0, 0)') n = n.parentElement
  const b = n.getBoundingClientRect()
  return { x: Math.round(b.x + scrollX), y: Math.round(b.y + scrollY), width: Math.round(b.width), height: Math.round(b.height) }
})
export function near(actual, expected, what, tol = 1) {
  for (const [k, v] of Object.entries(expected)) expect.soft(Math.abs(actual[k] - v), `${what} ${k} : ${actual[k]} au lieu de ${v}`).toBeLessThanOrEqual(tol)
}

export const style = (locator, prop) => locator.evaluate((el, p) => getComputedStyle(el)[p], prop)
export const paint = (page, value) => page.evaluate((v) => {
  const c = document.createElement('canvas'); c.width = c.height = 1; const g = c.getContext('2d')
  g.fillStyle = v; g.fillRect(0, 0, 1, 1); return [...g.getImageData(0, 0, 1, 1).data]
}, value)
export const sameColor = async (page, a, b) => JSON.stringify(await paint(page, a)) === JSON.stringify(await paint(page, b))
export async function pixel(page, x, y) {
  const shot = PNG.sync.read(await page.screenshot({ clip: { x, y, width: 1, height: 1 } }))
  return [shot.data[0], shot.data[1], shot.data[2]]
}
export const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
export const close = (a, b, tol = 3) => a.every((v, i) => Math.abs(v - b[i]) <= tol)

// Part des pixels dont un canal diffère de plus de 40 (mesure du SDL-FM)
export function diffRatio(screenshot, file) {
  const actual = PNG.sync.read(screenshot); const expected = PNG.sync.read(readFileSync(file))
  if (actual.width !== expected.width || actual.height !== expected.height) throw new Error(`capture ${actual.width}×${actual.height} ≠ référence ${expected.width}×${expected.height}`)
  let different = 0
  for (let i = 0; i < actual.data.length; i += 4) {
    const delta = Math.max(Math.abs(actual.data[i] - expected.data[i]), Math.abs(actual.data[i + 1] - expected.data[i + 1]), Math.abs(actual.data[i + 2] - expected.data[i + 2]))
    if (delta > 40) different++
  }
  return different / (actual.width * actual.height)
}
