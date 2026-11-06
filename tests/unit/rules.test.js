import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { newId, lineTotal, invoiceTotal, validate, normalizeDate, addDays, today, toInvoice, emptyInvoice, isInvoice, normalizeInvoice, TERMS } from '../../src/lib/rules.js'

// Spec §8 — U1 à U6 : règles de gestion (§2) sans navigateur

const DATA = JSON.parse(readFileSync(new URL('../../data.json', import.meta.url), 'utf8'))
const byId = (id) => DATA.find((invoice) => invoice.id === id)

// Brouillon du formulaire (textes) depuis une facture de data.json
const draftOf = (inv) => ({
  createdAt: normalizeDate(inv.createdAt), paymentTerms: inv.paymentTerms, description: inv.description, clientName: inv.clientName, clientEmail: inv.clientEmail,
  senderAddress: { ...inv.senderAddress }, clientAddress: { ...inv.clientAddress },
  items: inv.items.map((item) => ({ name: item.name, quantity: String(item.quantity), price: String(item.price) })),
})

test('U1 — newId : 2 lettres et 4 chiffres, jamais un id déjà pris (D3)', (t) => {
  for (let i = 0; i < 200; i++) assert.match(newId([]), /^[A-Z]{2}\d{4}$/)
  // 1er tirage AA0000 (pris), 2e tirage BB5000
  const draws = [0, 0, 0, 0.04, 0.04, 0.5]
  t.mock.method(Math, 'random', () => draws.shift())
  assert.equal(newId(['AA0000']), 'BB5000')
})

test('U2 — totaux de ligne et de facture arrondis au centime (D5)', () => {
  assert.equal(lineTotal({ quantity: 3, price: 0.1 }), 0.3)
  assert.equal(lineTotal({ quantity: '2', price: '200' }), 400)
  assert.equal(lineTotal({ quantity: '', price: '5' }), 0)
  assert.equal(invoiceTotal([{ quantity: 1, price: 0.1 }, { quantity: 2, price: 0.1 }]), 0.3)
  for (const inv of DATA) assert.equal(invoiceTotal(inv.items), inv.total, inv.id)
})

test('U3 — validate : chaque message de la §3.4, les deux messages du bas ; une facture complète est valide (D6, D7)', () => {
  const empty = validate(emptyInvoice())
  const required = ['senderAddress.street', 'senderAddress.city', 'senderAddress.postCode', 'senderAddress.country', 'clientName', 'clientEmail',
    'clientAddress.street', 'clientAddress.city', 'clientAddress.postCode', 'clientAddress.country', 'description', 'items.0.name', 'items.0.quantity', 'items.0.price']
  for (const key of required) assert.equal(empty.errors[key], "can't be empty", key)
  assert.deepEqual(empty.messages, ['- All fields must be added', '- An item must be added'])
  assert.equal(empty.ok, false)

  const full = validate(draftOf(byId('XM9141')))
  assert.deepEqual(full, { errors: {}, messages: [], ok: true })

  const wrong = validate({ ...draftOf(byId('XM9141')), clientEmail: 'alex@', items: [{ name: 'Banner', quantity: '0', price: '-3' }] })
  assert.equal(wrong.errors.clientEmail, 'invalid email')
  assert.equal(wrong.errors['items.0.quantity'], 'must be positive')
  assert.equal(wrong.errors['items.0.price'], 'must be positive')
  assert.deepEqual(wrong.messages, ['- An item must be added'])

  const noItem = validate({ ...draftOf(byId('XM9141')), items: [] })
  assert.deepEqual(noItem.messages, ['- An item must be added'])
})

test('U4 — normalizeDate lit « 2021-10-7 » ; addDays passe les fins de mois et d\'année (D10, D4)', () => {
  assert.equal(normalizeDate('2021-10-7'), '2021-10-07')
  assert.equal(normalizeDate('2021-08-21'), '2021-08-21')
  assert.equal(addDays('2021-08-21', 30), '2021-09-20')
  assert.equal(addDays('2021-12-31', 1), '2022-01-01')
  assert.equal(addDays('2021-02-28', 1), '2021-03-01')
  assert.equal(addDays('2024-02-28', 1), '2024-02-29')
  for (const inv of DATA) assert.equal(addDays(normalizeDate(inv.createdAt), inv.paymentTerms), normalizeDate(inv.paymentDue), inv.id)
  assert.deepEqual(TERMS, [1, 7, 14, 30])
})

test('U5 — toInvoice : textes nettoyés, date du jour si vide, montants négatifs à 0, échéance et totaux (S16)', () => {
  const draft = { ...draftOf(byId('XM9141')), createdAt: '', clientName: '  Grace Hopper ', paymentTerms: '7',
    items: [{ name: ' Banner ', quantity: '-2', price: '156' }, { name: 'Email', quantity: '2', price: '200' }] }
  const inv = toInvoice(draft, { id: 'AB1234', status: 'draft' })
  assert.equal(inv.createdAt, today())
  assert.equal(inv.paymentDue, addDays(today(), 7))
  assert.equal(inv.paymentTerms, 7)
  assert.equal(inv.clientName, 'Grace Hopper')
  assert.deepEqual(inv.items, [{ name: 'Banner', quantity: 0, price: 156, total: 0 }, { name: 'Email', quantity: 2, price: 200, total: 400 }])
  assert.equal(inv.total, 400)
  assert.equal(inv.status, 'draft')
  assert.equal(isInvoice(inv), true, 'une facture enregistrée par l\'app est relue au chargement')
})

test('U6 — isInvoice accepte data.json et refuse chaque défaut ; normalizeInvoice corrige dates et totaux (D2)', () => {
  for (const inv of DATA) assert.equal(isInvoice(inv), true, inv.id)
  const base = byId('RT3080')
  const line = base.items[0]
  const { items, ...withoutItems } = base
  const broken = {
    null: null, 'sans lignes': withoutItems, 'statut inconnu': { ...base, status: 'sent' }, 'terme 5': { ...base, paymentTerms: 5 },
    'mois 13': { ...base, createdAt: '2021-13-01' }, '30 février': { ...base, paymentDue: '2021-02-30' }, 'date 18/08/2021': { ...base, createdAt: '18/08/2021' },
    'quantité négative': { ...base, items: [{ ...line, quantity: -1 }] }, 'total négatif': { ...base, total: -1 },
    'adresse sans pays': { ...base, clientAddress: { street: 'a', city: 'b', postCode: 'c' } }, 'id mal formé': { ...base, id: 'rt3080' },
  }
  for (const [what, inv] of Object.entries(broken)) assert.equal(isInvoice(inv), false, what)
  assert.equal(isInvoice({ ...base, items: [] }), true, 'un brouillon peut n\'avoir aucune ligne')
  assert.ok(items.length > 0)

  assert.equal(normalizeInvoice(byId('AA1449')).createdAt, '2021-10-07')
  const fixed = normalizeInvoice({ ...base, items: [{ ...line, total: 1 }], total: 1 })
  assert.equal(fixed.items[0].total, line.quantity * line.price)
  assert.equal(fixed.total, base.total)
})
