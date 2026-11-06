import { test, expect } from '@playwright/test'
import { open, DATA, cards, card, counter, filterBy, main, day, money, label } from './helpers.js'

// Spec §2, §3.2 et §8 — S7 à S9

test('S7 — premier chargement : les 7 factures de data.json, dans l\'ordre, avec leurs valeurs', async ({ page }) => {
  await open(page, 1440)
  await expect(cards(page)).toHaveCount(DATA.length)
  for (const [i, inv] of DATA.entries()) {
    const c = cards(page).nth(i)
    await expect(c, inv.id).toContainText(`#${inv.id}`)
    await expect(c, inv.id).toContainText(`Due ${day(inv.paymentDue)}`)
    if (inv.clientName) await expect(c, inv.id).toContainText(inv.clientName)
    await expect(c, inv.id).toContainText(money(inv.total))
    await expect(c, inv.id).toContainText(label(inv.status))
  }
  await expect(counter(page)).toHaveText('There are 7 total invoices')
})

// Les 7 combinaisons de statuts ; les trois cochés = aucun
const COMBOS = [['Draft'], ['Pending'], ['Paid'], ['Draft', 'Pending'], ['Draft', 'Paid'], ['Pending', 'Paid'], ['Draft', 'Pending', 'Paid']]
const sentence = (statuses, n) => {
  if (statuses.length === 3) return `There are ${n} total invoices`
  const words = statuses.map((s) => s.toLowerCase()).join(' or ')
  return n === 1 ? `There is 1 ${words} invoice` : `There are ${n} ${words} invoices`
}

test('S8 — chaque combinaison du filtre : cartes, compteur, adresse ; rechargement', async ({ page }) => {
  await open(page, 1440)
  for (const combo of COMBOS) {
    await filterBy(page, combo)
    const expected = DATA.filter((inv) => combo.includes(label(inv.status))).map((inv) => inv.id)
    await expect(cards(page), combo.join(', ')).toHaveCount(expected.length)
    for (const [i, id] of expected.entries()) await expect(cards(page).nth(i)).toContainText(`#${id}`)
    await expect(counter(page), combo.join(', ')).toHaveText(sentence(combo, expected.length))
  }
  await filterBy(page, ['Pending', 'Paid'])
  await expect(page).toHaveURL(/#\/\?status=pending,paid$/)
  await page.reload()
  await expect(cards(page)).toHaveCount(DATA.filter((inv) => inv.status !== 'draft').length)
  await expect(counter(page)).toHaveText('There are 6 pending or paid invoices')
  await filterBy(page, [])
  await expect(cards(page)).toHaveCount(DATA.length)
})

test('S9 — aucune facture, ou un filtre sans résultat : l\'écran vide et « No invoices »', async ({ page }) => {
  await open(page, 1440, 800, { invoices: [] })
  await expect(cards(page)).toHaveCount(0)
  await expect(main(page).getByRole('heading', { level: 2, name: 'There is nothing here' })).toBeVisible()
  await expect(main(page).getByText('Create an invoice by clicking the New Invoice button and get started')).toBeVisible()
  await expect(counter(page)).toHaveText('No invoices')

  await open(page, 1440, 800, { invoices: DATA.filter((inv) => inv.status === 'paid') })
  await filterBy(page, ['Draft'])
  await expect(main(page).getByRole('heading', { level: 2, name: 'There is nothing here' })).toBeVisible()
  await expect(counter(page)).toHaveText('No invoices')
  await expect(card(page, 'RT3080')).toHaveCount(0)
})
