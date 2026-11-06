import { test, expect } from '@playwright/test'
import { open, DATA, card, cards, title, main, button, goBack, filterBy, counter, day, money, label } from './helpers.js'

// Spec §3.3 et §8 — S10 à S12

test('S10 — chaque facture : adresse, titre du document, tous les champs et chaque ligne, comparés à data.json', async ({ page }) => {
  test.setTimeout(60_000)
  await open(page, 1440, 900)
  for (const inv of DATA) {
    await page.goto('./')
    await card(page, inv.id).click()
    await expect(page, inv.id).toHaveURL(new RegExp(`#/invoice/${inv.id}$`))
    await expect(page).toHaveTitle(`Invoice #${inv.id} | Invoice app`)
    await expect(title(page, `#${inv.id}`)).toBeVisible()
    const m = main(page)
    const texts = [inv.description, label(inv.status), 'Invoice Date', day(inv.createdAt), 'Payment Due', day(inv.paymentDue), 'Bill To', 'Sent to',
      ...Object.values(inv.senderAddress), inv.clientName, ...Object.values(inv.clientAddress), inv.clientEmail, 'Amount Due', money(inv.total)]
    for (const t of texts.filter(Boolean)) await expect.soft(m, `${inv.id} : ${t}`).toContainText(t)
    const rows = m.getByRole('table').getByRole('row')
    await expect(rows).toHaveCount(inv.items.length + 1)
    for (const [i, item] of inv.items.entries()) {
      await expect(rows.nth(i + 1).getByRole('cell')).toHaveText([item.name, String(item.quantity), money(item.price), money(item.total)])
    }
  }
})

test('S11 — « Go back » rend la liste avec son filtre ; un id inconnu : « Invoice not found »', async ({ page }) => {
  await open(page, 1440, 900)
  await filterBy(page, ['Pending'])
  await card(page, 'XM9141').click()
  await goBack(page).click()
  await expect(page).toHaveURL(/#\/\?status=pending$/)
  await expect(counter(page)).toHaveText('There are 4 pending invoices')

  await page.goto('./#/invoice/ZZ0000')
  await expect(main(page).getByRole('heading', { name: 'Invoice not found' })).toBeVisible()
  await main(page).getByRole('link', { name: /invoices/i }).first().click()
  await expect(cards(page)).toHaveCount(DATA.length)
})

test('S12 — « Mark as Paid » pour une facture pending seulement', async ({ page }) => {
  for (const [id, shown] of [['XM9141', true], ['RT3080', false], ['FV2353', false]]) {
    await open(page, 1440, 900, { path: `./#/invoice/${id}` })
    await expect(title(page, `#${id}`)).toBeVisible()
    await expect(button(page, 'Mark as Paid'), id).toHaveCount(shown ? 1 : 0)
  }
})
