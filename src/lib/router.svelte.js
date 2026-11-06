// Navigation par ancre (ADR-0006) : #/ (filtre dans ?status=) et #/invoice/<id>

const STATUSES = ['draft', 'pending', 'paid']

function parse() {
  const [path, query = ''] = location.hash.replace(/^#/, '').split('?')
  const status = new URLSearchParams(query).get('status')
  const filter = status ? STATUSES.filter((s) => status.split(',').includes(s)) : []
  const match = path.match(/^\/invoice\/([A-Z]{2}\d{4})$/i)
  return match ? { view: 'invoice', id: match[1].toUpperCase(), filter } : { view: 'list', filter }
}

export const route = $state(parse())
let listFilter = route.filter

addEventListener('hashchange', () => {
  Object.assign(route, parse())
  if (route.view === 'list') listFilter = route.filter
})

export const listHash = (filter = listFilter) => (filter.length ? `#/?status=${filter.join(',')}` : '#/')

// Le filtre réécrit l'adresse sans nouvelle entrée d'historique
export function setFilter(filter) {
  const ordered = STATUSES.filter((s) => filter.includes(s))
  history.replaceState(null, '', listHash(ordered))
  route.filter = ordered
  listFilter = ordered
}

export const go = (hash) => { location.hash = hash }
