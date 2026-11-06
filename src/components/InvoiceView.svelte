<script>
  // Facture (spec §3.3) : retour, barre de statut et actions, détail, lignes, total
  import StatusBadge from './StatusBadge.svelte'
  import DeleteDialog from './DeleteDialog.svelte'
  import InvoiceForm from './InvoiceForm.svelte'
  import arrow from '../../assets/icon-arrow-left.svg'
  import { find, markPaid, remove } from '../lib/invoices.svelte.js'
  import { listHash, go } from '../lib/router.svelte.js'
  import { formatDate, formatMoney } from '../lib/format.js'
  import { screen } from '../lib/media.svelte.js'

  let { id } = $props()
  const invoice = $derived(find(id))
  let deleter = $state()
  let form = $state()
  let editButton = $state()

  function confirmDelete() {
    remove(id)
    go(listHash())
  }
</script>

<div class="view">
  {#if invoice}
    <a class="back" href={listHash()}><img src={arrow} alt="" width="7" height="10">Go back</a>

    <div class="status-bar">
      <span class="status-label">Status</span>
      <StatusBadge status={invoice.status} />
      <div class="actions">
        <button class="btn-light" type="button" bind:this={editButton} onclick={() => form.open(invoice)}>Edit</button>
        <button class="btn-danger delete" type="button" onclick={() => deleter.open()}>Delete</button>
        {#if invoice.status === 'pending'}
          <button class="btn-primary paid" type="button" onclick={() => markPaid(id)}>Mark as Paid</button>
        {/if}
      </div>
    </div>

    <article class="detail">
      <div class="top">
        <div>
          <h1 class="id"><span class="text-hash">#</span>{invoice.id}</h1>
          <p class="description">{invoice.description}</p>
        </div>
        <address class="sender">
          {invoice.senderAddress.street}<br>{invoice.senderAddress.city}<br>{invoice.senderAddress.postCode}<br>{invoice.senderAddress.country}
        </address>
      </div>

      <div class="facts">
        <div class="dates">
          <p class="label">Invoice Date</p>
          <p class="value">{formatDate(invoice.createdAt)}</p>
          <p class="label due">Payment Due</p>
          <p class="value">{formatDate(invoice.paymentDue)}</p>
        </div>
        <div class="bill-to">
          <p class="label">Bill To</p>
          <p class="value">{invoice.clientName}</p>
          <address class="client-address">
            {invoice.clientAddress.street}<br>{invoice.clientAddress.city}<br>{invoice.clientAddress.postCode}<br>{invoice.clientAddress.country}
          </address>
        </div>
        <div class="sent-to">
          <p class="label">Sent to</p>
          <p class="value">{invoice.clientEmail}</p>
        </div>
      </div>

      <div class="items">
        {#if screen.wide}
          <table>
            <thead>
              <tr><th scope="col" class="name">Item Name</th><th scope="col" class="qty">QTY.</th><th scope="col" class="num">Price</th><th scope="col" class="num">Total</th></tr>
            </thead>
            <tbody>
              {#each invoice.items as item, i (i)}
                <tr><td class="name">{item.name}</td><td class="qty">{item.quantity}</td><td class="num price">{formatMoney(item.price)}</td><td class="num">{formatMoney(item.total)}</td></tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <ul class="lines">
            {#each invoice.items as item, i (i)}
              <li>
                <span class="line-name">{item.name}</span>
                <span class="line-qty">{item.quantity} x {formatMoney(item.price)}</span>
                <span class="line-total">{formatMoney(item.total)}</span>
              </li>
            {/each}
          </ul>
        {/if}
        <div class="band">
          <span class="band-label">{screen.wide ? 'Amount Due' : 'Grand Total'}</span>
          <span class="band-total">{formatMoney(invoice.total)}</span>
        </div>
      </div>
    </article>

    <DeleteDialog bind:this={deleter} {id} onconfirm={confirmDelete} />
    <InvoiceForm bind:this={form} returnFocus={() => editButton} />
  {:else}
    <h1 class="missing">Invoice not found</h1>
    <a class="btn-light mt-6" href="#/">Back to invoices</a>
  {/if}
</div>

<style>
  @reference "../app.css";

  .view {
    @apply mx-auto w-full max-w-[20.4375rem] pt-[6.5625rem] pb-[9.125rem] md:max-w-[43rem] md:pt-[8.0625rem] md:pb-16 lg:max-w-[45.625rem] lg:pt-[4.0625rem];
  }

  .back {
    @apply flex w-fit items-center gap-6 text-heading-s font-bold text-ink hover:text-label md:gap-[1.3125rem];
  }

  .status-bar {
    @apply mt-[1.9375rem] flex h-[5.6875rem] items-center rounded-card bg-surface px-6 shadow-card md:h-[5.5rem] md:px-8;
  }

  .status-label { @apply me-auto text-body font-medium text-client md:me-5; }

  .actions {
    @apply fixed inset-x-0 bottom-0 z-10 flex h-[5.6875rem] items-center justify-end gap-2 bg-surface px-6 md:static md:ms-auto md:h-auto md:bg-transparent md:px-0;
  }

  .delete { @apply min-w-[5.5625rem]; }

  .paid { @apply flex-1 md:flex-none md:min-w-[8.1875rem]; }

  .detail {
    @apply mt-4 rounded-card bg-surface p-6 pt-[1.5625rem] shadow-card md:mt-6 md:p-8 md:pt-[2.0625rem] lg:p-12 lg:pt-[3.0625rem];
  }

  .top { @apply flex flex-col gap-[1.875rem] md:flex-row md:justify-between md:gap-0; }

  .id { @apply text-heading-s font-bold text-ink md:mt-px md:text-heading-s-tall; }

  .description { @apply mt-1 text-body font-medium text-label md:mt-[0.4375rem]; }

  .sender, .client-address { @apply text-body-tall font-medium not-italic text-label; }

  .sender { @apply md:text-end; }

  .facts { @apply mt-[2.125rem] grid grid-cols-[8.6875rem_1fr] gap-y-[2.1875rem] md:mt-6 md:grid-cols-[12.25rem_12.6875rem_1fr]; }

  .label { @apply text-body font-medium text-label; }

  .value { @apply mt-[0.8125rem] text-value font-bold text-ink; }

  .due { @apply mt-[1.9375rem]; }

  .client-address { @apply mt-[0.4375rem]; }

  .sent-to { @apply col-span-2 md:col-span-1; }

  .items { @apply mt-[2.375rem] overflow-hidden rounded-card bg-surface-2 md:mt-[3.125rem] lg:mt-[2.9375rem]; }

  table { @apply w-full table-fixed border-collapse; }

  th { @apply pt-[2.0625rem] pb-8 text-body-tall font-medium text-label; }

  td { @apply pb-8 text-heading-s font-bold; }

  tbody tr:last-child td { @apply pb-[2.4375rem]; }

  .name { @apply ps-8 text-start text-ink; }

  th.name { @apply text-label; }

  .qty { @apply w-[3.25rem] text-center text-label; }

  .num { @apply w-[6.75rem] text-end text-ink; }

  .num:last-child { @apply w-[10.5625rem] pe-8; }

  th.num { @apply text-label; }

  .price { @apply text-label; }

  td.qty { @apply text-label; }

  .lines { @apply flex flex-col gap-6 px-6 pt-[1.5625rem] pb-[1.4375rem]; }

  .lines li { @apply grid grid-cols-[1fr_auto] items-center; }

  .line-name { @apply text-heading-s font-bold text-ink; }

  .line-qty { @apply col-start-1 mt-2 text-heading-s font-bold text-label; }

  .line-total { @apply col-start-2 row-span-2 row-start-1 text-heading-s font-bold text-ink; }

  .band { @apply flex h-20 items-center justify-between bg-band px-6 md:px-8; }

  .band-label { @apply text-body-tall font-medium text-white; }

  .band-total { @apply text-heading-m font-bold text-white md:text-[1.5rem]; }

  .missing { @apply mt-8 text-heading-m font-bold text-ink; }
</style>
