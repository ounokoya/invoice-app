// État des factures et persistance dans le navigateur (ADR-0007, D2)

import data from '../../data.json'
import { newId, normalizeDate, toInvoice, lineTotal, invoiceTotal } from './rules.js'

const KEY = 'invoice-app/invoices'
const STATUSES = ['draft', 'pending', 'paid']
const TERMS = [1, 7, 14, 30]
const DATE = /^\d{4}-\d{1,2}-\d{1,2}$/

// D1 : forme d'une facture gardée ; une seule facture sans cette forme fait relire data.json (D2, N1, P1)
const isObject = (value) => value !== null && typeof value === 'object'
const isAddress = (address) => isObject(address) && ['street', 'city', 'postCode', 'country'].every((key) => typeof address[key] === 'string')
const isAmount = (value) => Number.isFinite(value) && value >= 0
const isItem = (item) => isObject(item) && typeof item.name === 'string' && ['quantity', 'price', 'total'].every((key) => isAmount(item[key]))
const isInvoice = (invoice) => isObject(invoice) && /^[A-Z]{2}\d{4}$/.test(invoice.id) && STATUSES.includes(invoice.status)
  && ['createdAt', 'paymentDue'].every((key) => DATE.test(invoice[key]))
  && ['description', 'clientName', 'clientEmail'].every((key) => typeof invoice[key] === 'string')
  && TERMS.includes(invoice.paymentTerms) && isAmount(invoice.total)
  && isAddress(invoice.senderAddress) && isAddress(invoice.clientAddress) && Array.isArray(invoice.items) && invoice.items.every(isItem)

// Dates lues comme D10, totaux recalculés depuis les lignes (D5)
function normalize(invoice) {
  const items = invoice.items.map((item) => ({ ...item, total: lineTotal(item) }))
  return { ...invoice, createdAt: normalizeDate(invoice.createdAt), paymentDue: normalizeDate(invoice.paymentDue), items, total: invoiceTotal(items) }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved) && saved.every(isInvoice)) return saved.map(normalize)
  } catch { /* données illisibles : on repart de data.json */ }
  return data.map(normalize)
}

export const store = $state({ invoices: load() })

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(store.invoices)) } catch { /* stockage indisponible : l'app continue en mémoire */ }
}

export const find = (id) => store.invoices.find((invoice) => invoice.id === id)

export function create(draft, status) {
  const invoice = toInvoice(draft, { id: newId(store.invoices.map((i) => i.id)), status })
  store.invoices.push(invoice)
  save()
  return invoice
}

// D7 : un brouillon enregistré complet devient pending
export function update(id, draft) {
  const index = store.invoices.findIndex((invoice) => invoice.id === id)
  const current = store.invoices[index]
  store.invoices[index] = toInvoice(draft, { id, status: current.status === 'draft' ? 'pending' : current.status })
  save()
}

export function markPaid(id) {
  find(id).status = 'paid'
  save()
}

export function remove(id) {
  store.invoices = store.invoices.filter((invoice) => invoice.id !== id)
  save()
}
