import { test, expect } from '@playwright/test'
import { open, main, DATA, THEME_KEY, card, cards, counter, newButton, filterButton, statusBox, themeButton, button, dialog, group, field, style, sameColor, pixel, hex, close } from './helpers.js'

// Spec §6 et §8 — S29 à S31

const hoverCheck = async (page, locator, checks, what) => {
  await locator.hover()
  for (const [prop, value] of checks) expect.soft(await sameColor(page, await style(locator, prop), value), `${what} survolé : ${prop}`).toBe(true)
}

test('S29 — survol de chaque type d\'élément (clair), puis retour à l\'état normal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 1440, 1000)
  await hoverCheck(page, newButton(page), [['backgroundColor', '#6742ff']], 'New Invoice')
  await hoverCheck(page, card(page, 'XM9141'), [['borderTopColor', '#7757fa']], 'carte')
  await page.mouse.move(1300, 700)
  expect.soft(await sameColor(page, await style(newButton(page), 'backgroundColor'), '#7757fa'), 'New Invoice quitté').toBe(true)
  await filterButton(page).click()
  const box = statusBox(page, 'Pending')
  await box.hover()
  expect.soft(await sameColor(page, await style(box, 'borderTopColor'), '#7757fa'), 'case survolée').toBe(true)
  await page.keyboard.press('Escape')

  await card(page, 'XM9141').click()
  await hoverCheck(page, button(page, 'Edit'), [['backgroundColor', '#dfe3fa'], ['color', '#515eae']], 'Edit')
  await hoverCheck(page, button(page, 'Delete'), [['backgroundColor', '#c41e1e']], 'Delete')
  await hoverCheck(page, button(page, 'Mark as Paid'), [['backgroundColor', '#6742ff']], 'Mark as Paid')
  await button(page, 'Edit').click()
  const d = dialog(page, 'Edit #XM9141')
  await hoverCheck(page, button(d, '+ Add New Item'), [['backgroundColor', '#dfe3fa'], ['color', '#515eae']], '+ Add New Item')
  await hoverCheck(page, field(group(d, 'Bill From'), 'City'), [['borderTopColor', '#9277ff']], 'champ')
  await button(d, 'Cancel').click()
})

test('S29 — survol de « Save as Draft » et des boutons en thème sombre', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 1440, 1000)
  await newButton(page).click()
  const d = dialog(page, 'New Invoice')
  await hoverCheck(page, button(d, 'Save as Draft'), [['backgroundColor', '#0c0e16']], 'Save as Draft')
  await open(page, 1440, 1000, { path: './#/invoice/XM9141' })
  await themeButton(page).click()
  await expect(page.locator('html'), 'thème choisi par le bouton').toHaveAttribute('data-theme', 'dark')
  await hoverCheck(page, button(page, 'Edit'), [['backgroundColor', '#ffffff'], ['color', '#616db5']], 'Edit sombre')
})

test('S30 — prefers-reduced-motion : aucune transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, 1440, 900, { path: './#/invoice/XM9141' })
  for (const name of ['Edit', 'Delete', 'Mark as Paid']) {
    const b = button(page, name)
    await b.hover()
    expect.soft(Math.max(...(await style(b, 'transitionDuration')).split(',').map(parseFloat)), name).toBe(0)
  }
})

// Spec §8 — S36 : le filtre au clavier, de l'ouverture au résultat
test('S36 — filtre au clavier : Entrée ouvre, Espace coche ; cartes, compteur et adresse à chaque pas ; Échap ferme', async ({ page }) => {
  await open(page, 1440, 1000)
  await filterButton(page).focus()
  await page.keyboard.press('Enter')
  await expect(statusBox(page, 'Draft')).toBeVisible()
  const ids = (statuses) => DATA.filter((inv) => statuses.includes(inv.status)).map((inv) => inv.id)
  const expectList = async (statuses, sentence) => {
    const expected = ids(statuses)
    await expect(cards(page), statuses.join(', ')).toHaveCount(expected.length)
    for (const [i, id] of expected.entries()) await expect(cards(page).nth(i)).toContainText(`#${id}`)
    await expect(counter(page)).toHaveText(sentence)
    await expect(page).toHaveURL(new RegExp(`#/\\?status=${statuses.join(',')}$`))
  }
  await page.keyboard.press('Tab')
  await expect(statusBox(page, 'Draft')).toBeFocused()
  await page.keyboard.press('Space')
  await expectList(['draft'], 'There is 1 draft invoice')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Space')
  await expectList(['draft', 'pending'], 'There are 5 draft or pending invoices')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Space')
  await expectList(['draft', 'pending', 'paid'], 'There are 7 total invoices')
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Space')
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Space')
  await expect(statusBox(page, 'Paid')).toBeChecked()
  await expectList(['paid'], 'There are 2 paid invoices')
  await page.keyboard.press('Escape')
  await expect(statusBox(page, 'Draft')).toBeHidden()
  await expect(filterButton(page)).toBeFocused()
})

// Spec §8 — S37 : le bouton du thème au clavier, dans les deux sens
test('S37 — thème au clavier : Entrée passe au sombre puis revient au clair ; fond, data-theme, nom, choix gardé', async ({ page }) => {
  await open(page, 1440, 900)
  await themeButton(page).focus()
  for (const [theme, background, next] of [['dark', '#141625', 'light'], ['light', '#f8f8fb', 'dark']]) {
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    expect(close(await pixel(page, 600, 30), hex(background)), `fond ${theme}`).toBe(true)
    await expect(themeButton(page)).toHaveAccessibleName(`Switch to ${next} theme`)
    await expect(themeButton(page), 'le focus reste sur le bouton').toBeFocused()
    expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe(theme)
  }
})

// Parcours au Tab jusqu'au dernier élément : contour visible (2 px au moins) ou bordure de champ
async function walk(page, max = 120) {
  const seen = []
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      if (el.dataset.walked) return { again: true }
      el.dataset.walked = '1'
      const s = getComputedStyle(el)
      const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2
      const field = el.matches('input, select, textarea') && s.borderTopColor !== 'rgba(0, 0, 0, 0)'
      return { name: (el.getAttribute('aria-label') || el.labels?.[0]?.textContent || el.textContent || el.tagName).trim().slice(0, 30), ok: outline || field, inDialog: !!el.closest('dialog') }
    })
    if (!info || info.again) break
    seen.push(info)
  }
  await page.evaluate(() => document.querySelectorAll('[data-walked]').forEach((el) => delete el.dataset.walked))
  return seen
}

test('S31 — liste, facture, formulaire, suppression : focus visible jusqu\'au dernier élément ; le focus reste dans le dialogue', async ({ page }) => {
  await open(page, 1440, 1000)
  const list = await walk(page)
  expect(list.length, 'liste : logo, thème, filtre, New Invoice, 7 cartes').toBeGreaterThanOrEqual(11)
  await card(page, 'XM9141').click()
  await expect(main(page), 'focus posé sur la vue (A9) avant le parcours').toBeFocused()
  const view = await walk(page)
  expect(view.length, 'facture : Go back, Edit, Delete, Mark as Paid').toBeGreaterThanOrEqual(4)
  await button(page, 'Edit').click()
  const form = await walk(page, 80)
  expect(form.length, 'formulaire : 20 champs et boutons au moins').toBeGreaterThanOrEqual(20)
  expect(form.filter((x) => !x.inDialog).map((x) => x.name), 'le focus sort du dialogue').toEqual([])
  await page.keyboard.press('Escape')
  await button(page, 'Delete').click()
  const del = await walk(page, 10)
  expect(del.filter((x) => !x.inDialog).map((x) => x.name), 'le focus sort de la suppression').toEqual([])
  const missing = [...list, ...view, ...form, ...del].filter((x) => !x.ok).map((x) => x.name)
  expect(missing, 'éléments sans focus visible').toEqual([])
})
