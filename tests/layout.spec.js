import { test, expect } from '@playwright/test'
import { open, banner, title, cards, newButton, filterButton, counter, dialog, alert, field, group, button, pageBox, surfaceBox, near, pixel, close } from './helpers.js'

// Spec §5 et §8 — S1 à S6 : positions de la maquette (à 1 px près ; 2 px pour les textes)

test('S1 — 1440 × 800 : barre à gauche, titre, New Invoice, 1re et 7e cartes', async ({ page }) => {
  await open(page, 1440, 800)
  near(await pageBox(banner(page)), { x: 0, y: 0, width: 103, height: 800 }, 'barre')
  near(await pageBox(title(page, 'Invoices')), { x: 355, y: 78 }, 'titre', 2)
  near(await pageBox(newButton(page)), { x: 935, y: 77, width: 150, height: 48 }, 'New Invoice')
  near(await pageBox(cards(page).first()), { x: 355, y: 196, width: 730, height: 72 }, '1re carte')
  near(await pageBox(cards(page).nth(6)), { x: 355, y: 724, width: 730, height: 72 }, '7e carte')
})

test('S2 — 768 et 375 px : barre en haut, titre, cartes ; textes courts sous 768', async ({ page }) => {
  await open(page, 768, 1024)
  near(await pageBox(banner(page)), { x: 0, y: 0, width: 768, height: 80 }, 'barre 768')
  near(await pageBox(title(page, 'Invoices')), { x: 48, y: 142 }, 'titre 768', 2)
  near(await pageBox(newButton(page)), { x: 570, y: 141, width: 150, height: 48 }, 'New Invoice 768')
  near(await pageBox(cards(page).first()), { x: 48, y: 251, width: 672, height: 72 }, '1re carte 768')
  near(await pageBox(cards(page).nth(6)), { x: 48, y: 779, width: 672, height: 72 }, '7e carte 768')

  await open(page, 375, 667)
  near(await pageBox(banner(page)), { x: 0, y: 0, width: 375, height: 72 }, 'barre 375')
  near(await pageBox(title(page, 'Invoices')), { x: 24, y: 108 }, 'titre 375', 2)
  near(await pageBox(newButton(page)), { x: 261, y: 104, width: 90, height: 44 }, 'New 375')
  near(await pageBox(cards(page).first()), { x: 24, y: 180, width: 327, height: 134 }, '1re carte 375')
  near(await pageBox(cards(page).nth(6)), { x: 24, y: 1080, width: 327, height: 134 }, '7e carte 375')
  expect(await newButton(page).innerText()).toBe('New')
  expect(await filterButton(page).innerText()).toBe('Filter')
  await expect(counter(page)).toHaveText('7 invoices')
})

const VIEW = {
  1440: { h: 908, bar: { x: 355, y: 111, width: 730, height: 88 }, body: { x: 355, y: 223, width: 730, height: 631 }, edit: [744, 131, 73], del: [825, 131, 89], paid: [922, 131, 131] },
  768: { h: 1024, bar: { x: 40, y: 175, width: 688, height: 88 }, body: { x: 40, y: 287, width: 688, height: 602 }, edit: [387, 195, 73], del: [468, 195, 89], paid: [565, 195, 131] },
  375: { h: 1100, bar: { x: 24, y: 151, width: 327, height: 91 }, body: { x: 24, y: 258, width: 327, height: 695 }, edit: [24, 1030, 73], del: [105, 1030, 89], paid: [202, 1030, 149] },
}

for (const [w, v] of Object.entries(VIEW)) {
  test(`S3 — facture XM9141 à ${w} px : barre de statut, détail, boutons`, async ({ page }) => {
    await open(page, Number(w), v.h, { path: './#/invoice/XM9141' })
    near(await surfaceBox(page.getByText('Status', { exact: true })), v.bar, 'barre de statut')
    near(await surfaceBox(title(page, '#XM9141')), v.body, 'détail')
    for (const [name, [x, y, width]] of [['Edit', v.edit], ['Delete', v.del], ['Mark as Paid', v.paid]]) {
      near(await pageBox(button(page, name)), { x, y, width, height: 48 }, name)
    }
  })
}

const FORM = {
  1440: { h: 1424, drawer: { x: 0, y: 0, width: 719 }, first: { x: 159, y: 200, width: 504, height: 48 } },
  768: { h: 1504, drawer: { x: 0, y: 80, width: 616 }, first: { x: 56, y: 280, width: 504, height: 48 } },
  375: { h: 2149, drawer: { x: 0, width: 375 }, first: { x: 24, y: 263, width: 327, height: 48 } },
}

for (const [w, f] of Object.entries(FORM)) {
  test(`S4 — formulaire à ${w} px : tiroir et 1er champ ; voile à 50 %`, async ({ page }) => {
    await open(page, Number(w), f.h)
    await newButton(page).click()
    const d = dialog(page, 'New Invoice')
    await expect(d).toBeVisible()
    near(await pageBox(d), f.drawer, 'tiroir')
    near(await pageBox(field(group(d, 'Bill From'), 'Street Address')), f.first, '1er champ')
    if (w === '1440') expect(close(await pixel(page, 1200, 400), [124, 124, 126], 4), 'voile noir à 50 % sur #f8f8fb').toBe(true)
  })
}

// Rapport d'exécution, E1 et E2 : écarts trouvés au parcours réel, avec une fenêtre plus petite que le formulaire
test('E1, E2 — 1440 × 900 : le tiroir défile une seule fois ; ombre au-dessus du pied tant qu\'il reste du formulaire', async ({ page }) => {
  await open(page, 1440, 900)
  await newButton(page).click()
  const d = dialog(page, 'New Invoice')
  await expect(d).toBeVisible()
  expect(await d.evaluate((el) => el.scrollHeight - el.clientHeight), 'le dialogue lui-même ne défile pas').toBe(0)
  const shade = d.locator('.shade')
  await expect(shade).toHaveCSS('opacity', '1')
  await d.locator('.scroller').evaluate((el) => { el.scrollTop = el.scrollHeight })
  await expect(shade).toHaveCSS('opacity', '0')
})

for (const [w, h, box] of [[1440, 1024, { x: 480, y: 388, width: 480, height: 249 }], [768, 1024, { x: 144, y: 388, width: 480, height: 249 }], [375, 667, { x: 24, y: 224, width: 327, height: 220 }]]) {
  test(`S5 — suppression à ${w} px : modale centrée`, async ({ page }) => {
    await open(page, w, h, { path: './#/invoice/XM9141' })
    await button(page, 'Delete').click()
    near(await pageBox(alert(page)), box, 'modale')
  })
}

test('S6 — pas de défilement horizontal de 320 à 1440 px, dans chaque vue', async ({ page }) => {
  for (const width of [320, 375, 767, 768, 1023, 1024, 1440]) {
    for (const path of ['./', './#/invoice/XM9141']) {
      await open(page, width, 900, { path })
      expect.soft(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${width} px ${path}`).toBeLessThanOrEqual(0)
    }
    await open(page, width, 900)
    await newButton(page).click()
    expect.soft(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${width} px formulaire`).toBeLessThanOrEqual(0)
  }
})
