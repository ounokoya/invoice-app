import { test, expect } from '@playwright/test'
import { open, DATA, byId, cards, card, title, main, button, dialog, alert, group, field, goBack, counter, fillForm, terms, money } from './helpers.js'

// Spec §2, §3.3 à §3.5 et §8 — S20 à S24 : modifier, payer, supprimer

async function editXM(page) {
  await open(page, 1440, 1000, { path: './#/invoice/XM9141' })
  await button(page, 'Edit').click()
  const d = dialog(page, 'Edit #XM9141')
  await expect(d).toBeVisible()
  return d
}

test('S20 — « Edit » : dialogue rempli avec toutes les valeurs de la facture', async ({ page }) => {
  const d = await editXM(page)
  const inv = byId('XM9141')
  for (const [name, key] of [['Street Address', 'street'], ['City', 'city'], ['Post Code', 'postCode'], ['Country', 'country']]) {
    await expect(field(group(d, 'Bill From'), name)).toHaveValue(inv.senderAddress[key])
    await expect(field(group(d, 'Bill To'), name)).toHaveValue(inv.clientAddress[key])
  }
  await expect(field(group(d, 'Bill To'), "Client's Name")).toHaveValue(inv.clientName)
  await expect(field(group(d, 'Bill To'), "Client's Email")).toHaveValue(inv.clientEmail)
  await expect(field(d, 'Invoice Date')).toHaveValue(inv.createdAt)
  await expect(field(d, 'Invoice Date')).not.toBeEditable()
  expect(await field(d, 'Payment Terms').evaluate((s) => s.selectedOptions[0].textContent.trim())).toBe(terms(inv.paymentTerms))
  await expect(field(d, 'Project Description')).toHaveValue(inv.description)
  for (const [i, item] of inv.items.entries()) {
    const row = group(group(d, 'Item List'), `Item ${i + 1}`)
    await expect(field(row, 'Item Name')).toHaveValue(item.name)
    await expect(field(row, 'Qty.')).toHaveValue(String(item.quantity))
    await expect(field(row, 'Price')).toHaveValue(item.price.toFixed(2))
    await expect(field(row, 'Total')).toHaveValue(item.total.toFixed(2))
  }
})

test('S21 — « Save Changes » : la facture et sa carte suivent ; champ vidé refusé ; « Cancel » ne change rien', async ({ page }) => {
  const d = await editXM(page)
  await field(group(d, 'Bill To'), "Client's Name").fill('Alex Green')
  await field(group(group(d, 'Item List'), 'Item 1'), 'Price').fill('160')
  await button(d, 'Save Changes').click()
  await expect(d).toBeHidden()
  await expect(main(page)).toContainText('Alex Green')
  await expect(main(page)).toContainText(money(160))
  await expect(main(page)).toContainText(money(560))
  await goBack(page).click()
  await expect(card(page, 'XM9141')).toContainText('Alex Green')
  await expect(card(page, 'XM9141')).toContainText(money(560))

  await card(page, 'XM9141').click()
  await button(page, 'Edit').click()
  await field(group(d, 'Bill To'), "Client's Name").fill('')
  await button(d, 'Save Changes').click()
  await expect(d).toBeVisible()
  await expect(d.getByText("can't be empty")).toHaveCount(1)
  await button(d, 'Cancel').click()
  await expect(d).toBeHidden()
  await expect(main(page)).toContainText('Alex Green')
})

test('S22 — le brouillon FV2353 complété puis enregistré passe en pending', async ({ page }) => {
  await open(page, 1440, 1000, { path: './#/invoice/FV2353' })
  await button(page, 'Edit').click()
  const d = dialog(page, 'Edit #FV2353')
  await fillForm(d, { ...byId('FV2353'), clientEmail: 'anita@mail.com', clientAddress: { street: '1 Main St', city: 'Leeds', postCode: 'LS1 1AA', country: 'United Kingdom' } }, { date: false })
  await button(d, 'Save Changes').click()
  await expect(d).toBeHidden()
  await expect(main(page)).toContainText('Pending')
  await expect(button(page, 'Mark as Paid')).toBeVisible()
})

test('S23 — « Mark as Paid » : badge Paid, bouton absent, carte Paid', async ({ page }) => {
  await open(page, 1440, 1000, { path: './#/invoice/XM9141' })
  await button(page, 'Mark as Paid').click()
  await expect(main(page)).toContainText('Paid')
  await expect(button(page, 'Mark as Paid')).toHaveCount(0)
  await goBack(page).click()
  await expect(card(page, 'XM9141')).toContainText('Paid')
})

test('S24 — « Delete » : confirmation avec l\'id ; Cancel garde ; Delete retire, compteur à 6', async ({ page }) => {
  await open(page, 1440, 1000, { path: './#/invoice/XM9141' })
  await button(page, 'Delete').click()
  await expect(alert(page)).toContainText('Are you sure you want to delete invoice #XM9141? This action cannot be undone.')
  await button(alert(page), 'Cancel').click()
  await expect(alert(page)).toBeHidden()
  await expect(title(page, '#XM9141')).toBeVisible()
  await expect(button(page, 'Delete')).toBeFocused()
  await button(page, 'Delete').click()
  await page.keyboard.press('Escape')
  await expect(alert(page)).toBeHidden()
  await expect(button(page, 'Delete')).toBeFocused()
  await button(page, 'Delete').click()
  await button(alert(page), 'Delete').click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(cards(page)).toHaveCount(DATA.length - 1)
  await expect(card(page, 'XM9141')).toHaveCount(0)
  await expect(counter(page)).toHaveText('There are 6 total invoices')
})
