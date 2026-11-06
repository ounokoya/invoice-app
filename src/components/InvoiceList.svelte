<script>
  // Liste (spec §3.2) : titre, compteur, filtre, nouvelle facture, cartes ou écran vide
  import InvoiceCard from './InvoiceCard.svelte'
  import StatusFilter from './StatusFilter.svelte'
  import InvoiceForm from './InvoiceForm.svelte'
  import empty from '../../assets/illustration-empty.svg'
  import plus from '../../assets/icon-plus.svg'
  import { store } from '../lib/invoices.svelte.js'
  import { route } from '../lib/router.svelte.js'
  import { screen } from '../lib/media.svelte.js'

  const shown = $derived(route.filter.length ? store.invoices.filter((invoice) => route.filter.includes(invoice.status)) : store.invoices)

  // « There are 7 total invoices », « There are 4 pending invoices », « There is 1 draft invoice », « 7 invoices » (Q-B4, Q-B5, Q-B11)
  const counter = $derived.by(() => {
    const n = shown.length
    if (n === 0) return 'No invoices'
    if (!screen.wide) return `${n} ${n === 1 ? 'invoice' : 'invoices'}`
    const filtered = route.filter.length && route.filter.length < 3
    const words = filtered ? route.filter.join(' or ') : 'total'
    return n === 1 ? `There is 1 ${words} invoice` : `There are ${n} ${words} invoices`
  })

  let form = $state()
  let opener = $state()
</script>

<div class="list">
  <div class="head">
    <div>
      <h1 class="title">Invoices</h1>
      <p class="counter">{counter}</p>
    </div>
    <div class="actions">
      <StatusFilter />
      <button class="btn-primary new" type="button" aria-label="New Invoice" bind:this={opener} onclick={() => form.open()}>
        <span class="plus"><img src={plus} alt="" width="11" height="11"></span>
        {screen.wide ? 'New Invoice' : 'New'}
      </button>
    </div>
  </div>

  {#if shown.length}
    <ul class="cards">
      {#each shown as invoice (invoice.id)}
        <li><InvoiceCard {invoice} /></li>
      {/each}
    </ul>
  {:else}
    <div class="empty">
      <img class="illustration" src={empty} alt="" width="242" height="200">
      <h2 class="empty-title">There is nothing here</h2>
      <p class="empty-text">Create an invoice by clicking the <strong>{screen.wide ? 'New Invoice' : 'New'}</strong> button and get started</p>
    </div>
  {/if}
</div>

<InvoiceForm bind:this={form} returnFocus={() => opener} />

<style>
  @reference "../app.css";

  .list {
    @apply mx-auto w-full max-w-[20.4375rem] pt-[6.5rem] pb-16 md:max-w-[42rem] md:pt-[8.8125rem] lg:max-w-[45.625rem] lg:pt-[4.8125rem];
  }

  .head { @apply flex items-start justify-between; }

  .title { @apply mt-1 text-heading-mobile font-bold text-ink md:mt-px md:text-heading-l; }

  .counter { @apply mt-[0.1875rem] text-body font-medium text-muted md:mt-1.5; }

  .actions { @apply flex items-center gap-4 md:gap-10; }

  .new { @apply h-11 gap-2 ps-1.5 pe-[0.9375rem] md:h-12 md:min-w-[9.375rem] md:gap-4 md:ps-2 md:pe-[1.0625rem]; }

  .plus { @apply grid size-8 place-items-center rounded-full bg-white; }

  .cards { @apply mt-8 flex flex-col gap-4 md:mt-[3.4375rem] lg:mt-16; }

  .empty { @apply mt-[6.375rem] flex flex-col items-center text-center md:mt-[13.0625rem] lg:mt-[8.75rem]; }

  .illustration { @apply h-auto w-[12.0625rem] md:w-[15.125rem]; }

  .empty-title { @apply mt-[2.625rem] text-heading-mobile font-bold text-ink md:mt-[4.125rem]; }

  /* 192 px : « New » (ou « New Invoice ») commence la 2e ligne, comme la maquette, sans <br> (largeurs mesurées dans Chromium) */
  .empty-text { @apply mt-[1.4375rem] w-48 text-body font-medium text-muted; }

  .empty-text strong { @apply font-bold; }
</style>
