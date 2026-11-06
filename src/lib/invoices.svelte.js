// État des factures et persistance dans le navigateur (ADR-0007, D2)

import data from '../../data.json'
import { newId, normalizeDate, toInvoice } from './rules.js'

const KEY = 'invoice-app/invoices'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved)) return saved
  } catch { /* données illisibles : on repart de data.json */ }
  return data.map((invoice) => ({ ...invoice, createdAt: normalizeDate(invoice.createdAt), paymentDue: normalizeDate(invoice.paymentDue) }))
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
