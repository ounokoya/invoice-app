<script>
  import AppBar from './components/AppBar.svelte'
  import InvoiceList from './components/InvoiceList.svelte'
  import InvoiceView from './components/InvoiceView.svelte'
  import { route } from './lib/router.svelte.js'

  $effect(() => {
    document.title = route.view === 'invoice' ? `Invoice #${route.id} | Invoice app` : 'Frontend Mentor | Invoice app'
  })
</script>

<AppBar />
<main>
  {#if route.view === 'invoice'}
    <InvoiceView id={route.id} />
  {:else}
    <InvoiceList />
  {/if}
</main>
