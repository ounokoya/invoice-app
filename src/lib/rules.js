// Règles de gestion de la spec (§2) : fonctions pures (ADR-0007), testées sans navigateur (tests/unit)

export const STATUSES = ['draft', 'pending', 'paid']
export const TERMS = [1, 7, 14, 30]

// D10 : « 2021-10-7 » → « 2021-10-07 »
export function normalizeDate(value) {
  if (!value) return value
  const [y, m, d] = String(value).split('-')
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + Number(days))).toISOString().slice(0, 10)
}

export function today() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

// D3 : 2 lettres majuscules et 4 chiffres, différent des id existants
export function newId(existing) {
  const taken = new Set(existing)
  const letter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26))
  let id
  do id = letter() + letter() + String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  while (taken.has(id))
  return id
}

// D5 : total d'une ligne et de la facture, arrondis au centime
export const lineTotal = (item) => Math.round(Number(item.quantity || 0) * Number(item.price || 0) * 100) / 100
export const invoiceTotal = (items) => Math.round(items.reduce((sum, item) => sum + lineTotal(item), 0) * 100) / 100

export const emptyAddress = () => ({ street: '', city: '', postCode: '', country: '' })
export const emptyItem = () => ({ name: '', quantity: '', price: '' })

export function emptyInvoice() {
  return {
    createdAt: today(), paymentTerms: 30, description: '', clientName: '', clientEmail: '',
    senderAddress: emptyAddress(), clientAddress: emptyAddress(), items: [emptyItem()],
  }
}

// D6, D7, Q-B8 : erreurs par champ (« can't be empty », « invalid email », « must be positive ») et messages du bas
export function validate(draft) {
  const errors = {}
  const need = (key, value) => { if (String(value ?? '').trim() === '') errors[key] = "can't be empty" }
  for (const [group, address] of [['senderAddress', draft.senderAddress], ['clientAddress', draft.clientAddress]]) {
    for (const key of ['street', 'city', 'postCode', 'country']) need(`${group}.${key}`, address[key])
  }
  need('clientName', draft.clientName)
  need('clientEmail', draft.clientEmail)
  if (!errors.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.clientEmail.trim())) errors.clientEmail = 'invalid email'
  need('createdAt', draft.createdAt)
  need('description', draft.description)
  draft.items.forEach((item, i) => {
    need(`items.${i}.name`, item.name)
    for (const key of ['quantity', 'price']) {
      need(`items.${i}.${key}`, item[key])
      if (!errors[`items.${i}.${key}`] && !(Number(item[key]) > 0)) errors[`items.${i}.${key}`] = 'must be positive'
    }
  })
  const messages = []
  if (Object.values(errors).includes("can't be empty")) messages.push('- All fields must be added')
  const validItem = draft.items.some((item, i) => !['name', 'quantity', 'price'].some((k) => errors[`items.${i}.${k}`]))
  if (!validItem) messages.push('- An item must be added')
  return { errors, messages, ok: Object.keys(errors).length === 0 && messages.length === 0 }
}

// D1, D2 : forme d'une facture gardée (dates qui existent, D10 compris ; termes de TERMS ; montants positifs ou nuls ;
// un brouillon peut n'avoir aucune ligne)
const isObject = (value) => value !== null && typeof value === 'object'
const isAmount = (value) => Number.isFinite(value) && value >= 0
const isDate = (value) => {
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}
const isAddress = (address) => isObject(address) && ['street', 'city', 'postCode', 'country'].every((key) => typeof address[key] === 'string')
const isItem = (item) => isObject(item) && typeof item.name === 'string' && ['quantity', 'price', 'total'].every((key) => isAmount(item[key]))

export const isInvoice = (invoice) => isObject(invoice) && /^[A-Z]{2}\d{4}$/.test(invoice.id) && STATUSES.includes(invoice.status)
  && isDate(invoice.createdAt) && isDate(invoice.paymentDue)
  && ['description', 'clientName', 'clientEmail'].every((key) => typeof invoice[key] === 'string')
  && TERMS.includes(invoice.paymentTerms) && isAmount(invoice.total)
  && isAddress(invoice.senderAddress) && isAddress(invoice.clientAddress) && Array.isArray(invoice.items) && invoice.items.every(isItem)

// Dates lues comme D10, totaux recalculés depuis les lignes (D5)
export function normalizeInvoice(invoice) {
  const items = invoice.items.map((item) => ({ ...item, total: lineTotal(item) }))
  return { ...invoice, createdAt: normalizeDate(invoice.createdAt), paymentDue: normalizeDate(invoice.paymentDue), items, total: invoiceTotal(items) }
}

// Facture enregistrée au format de D1 depuis le brouillon du formulaire
export function toInvoice(draft, { id, status }) {
  // un brouillon peut tout laisser vide : date du jour, quantités et prix positifs ou nuls (D2, S16)
  const createdAt = draft.createdAt || today()
  const amount = (value) => Math.max(0, Number(value) || 0)
  const items = draft.items.map((item) => ({ name: item.name.trim(), quantity: amount(item.quantity), price: amount(item.price) }))
    .map((item) => ({ ...item, total: lineTotal(item) }))
  const trim = (a) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k, String(v).trim()]))
  return {
    id, createdAt, paymentDue: addDays(createdAt, draft.paymentTerms), description: draft.description.trim(),
    paymentTerms: Number(draft.paymentTerms), clientName: draft.clientName.trim(), clientEmail: draft.clientEmail.trim(), status,
    senderAddress: trim(draft.senderAddress), clientAddress: trim(draft.clientAddress), items, total: invoiceTotal(items),
  }
}
