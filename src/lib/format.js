// Formats de la spec (§2, en-GB ; ADR-0009)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const amount = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// « 19 Aug 2021 » depuis « 2021-08-19 » (date civile, sans fuseau)
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`
}

// « £ 1,800.90 »
export const formatMoney = (n) => `£ ${amount.format(Number(n) || 0)}`

// « 1,800.90 » (champs du formulaire)
export const formatAmount = (n) => amount.format(Number(n) || 0).replace(/,/g, '')

export const statusLabel = (status) => status[0].toUpperCase() + status.slice(1)
