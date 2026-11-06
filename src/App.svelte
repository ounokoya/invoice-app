<script>
  import { tick } from 'svelte'
  import AppBar from './components/AppBar.svelte'
  import InvoiceList from './components/InvoiceList.svelte'
  import InvoiceView from './components/InvoiceView.svelte'
  import { find } from './lib/invoices.svelte.js'
  import { route } from './lib/router.svelte.js'

  let content = $state()
  let announcement = $state('')
  let shown = { view: route.view, id: route.id }

  $effect(() => {
    document.title = route.view === 'invoice' ? `Invoice #${route.id} | Invoice app` : 'Frontend Mentor | Invoice app'
  })

  // A9 : à chaque changement de vue (pas au premier chargement), le focus va au contenu,
  // ou à la carte de la facture quittée au retour à la liste ; le titre de la vue est annoncé
  $effect(() => {
    const { view, id } = route
    if (view === shown.view && (view === 'list' || id === shown.id)) return
    const left = shown.view === 'invoice' ? shown.id : null
    shown = { view, id }
    announcement = view === 'list' ? 'Invoices' : find(id) ? `Invoice #${id}` : 'Invoice not found'
    tick().then(() => {
      const card = view === 'list' && left ? content.querySelector(`a[href="#/invoice/${left}"]`) : null
      ;(card ?? content).focus()
    })
  })
</script>

<AppBar />
<main bind:this={content} tabindex="-1">
  {#if route.view === 'invoice'}
    <InvoiceView id={route.id} />
  {:else}
    <InvoiceList />
  {/if}
</main>
<p class="sr-only" role="status">{announcement}</p>
