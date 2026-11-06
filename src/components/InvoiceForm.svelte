<script>
  // Formulaire de création et de modification (spec §3.4, ADR-0008) : tiroir en desktop et tablette, page en mobile
  import { tick } from 'svelte'
  import AppBar from './AppBar.svelte'
  import Field from './Field.svelte'
  import arrowLeft from '../../assets/icon-arrow-left.svg'
  import trash from '../../assets/icon-delete.svg'
  import { emptyInvoice, emptyItem, validate, lineTotal } from '../lib/rules.js'
  import { create, update } from '../lib/invoices.svelte.js'
  import { formatAmount } from '../lib/format.js'

  let { returnFocus = () => null } = $props()
  let dialog = $state()
  let scroller = $state()
  let editing = $state(null)
  let draft = $state(emptyInvoice())
  let errors = $state({})
  let messages = $state([])
  const p = $derived(editing ? 'edit' : 'new')
  const TERMS = [1, 7, 14, 30]

  const toDraft = (inv) => ({
    createdAt: inv.createdAt, paymentTerms: inv.paymentTerms, description: inv.description, clientName: inv.clientName, clientEmail: inv.clientEmail,
    senderAddress: { ...inv.senderAddress }, clientAddress: { ...inv.clientAddress },
    items: inv.items.map((item) => ({ name: item.name, quantity: String(item.quantity), price: Number(item.price).toFixed(2) })),
  })

  export function open(invoice) {
    editing = invoice?.id ?? null
    draft = invoice ? toDraft(invoice) : emptyInvoice()
    errors = {}
    messages = []
    dialog.showModal()
    scroller.scrollTop = 0
  }

  const close = () => dialog.close()

  async function submit(kind) {
    if (kind === 'draft') {
      create(draft, 'draft')
      close()
      return
    }
    const result = validate(draft)
    errors = result.errors
    messages = result.messages
    if (!result.ok) {
      await tick()
      dialog.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    if (editing) update(editing, draft)
    else create(draft, 'pending')
    close()
  }

  function removeItem(i) {
    draft.items.splice(i, 1)
  }
</script>

<dialog class="drawer" aria-labelledby="{p}-title" bind:this={dialog} onclose={() => returnFocus()?.focus()}>
  <AppBar decorative />
  <div class="scroller" bind:this={scroller}>
    <form novalidate onsubmit={(event) => { event.preventDefault(); submit('send') }}>
      <button class="back" type="button" onclick={close}><img src={arrowLeft} alt="" width="7" height="10">Go back</button>
      <h2 id="{p}-title" class="title">{#if editing}Edit <span class="text-hash">#</span>{editing}{:else}New Invoice{/if}</h2>

      <fieldset class="group">
        <legend class="legend">Bill From</legend>
        <div class="grid-address">
          <Field id="{p}-from-street" label="Street Address" class="full" bind:value={draft.senderAddress.street} error={errors['senderAddress.street']} />
          <Field id="{p}-from-city" label="City" bind:value={draft.senderAddress.city} error={errors['senderAddress.city']} />
          <Field id="{p}-from-post" label="Post Code" bind:value={draft.senderAddress.postCode} error={errors['senderAddress.postCode']} />
          <Field id="{p}-from-country" label="Country" class="country" bind:value={draft.senderAddress.country} error={errors['senderAddress.country']} />
        </div>
      </fieldset>

      <fieldset class="group">
        <legend class="legend">Bill To</legend>
        <div class="grid-address">
          <Field id="{p}-client-name" label="Client's Name" class="full" bind:value={draft.clientName} error={errors.clientName} />
          <Field id="{p}-client-email" label="Client's Email" class="full" type="email" placeholder="e.g. email@example.com" bind:value={draft.clientEmail} error={errors.clientEmail} />
          <Field id="{p}-to-street" label="Street Address" class="full" bind:value={draft.clientAddress.street} error={errors['clientAddress.street']} />
          <Field id="{p}-to-city" label="City" bind:value={draft.clientAddress.city} error={errors['clientAddress.city']} />
          <Field id="{p}-to-post" label="Post Code" bind:value={draft.clientAddress.postCode} error={errors['clientAddress.postCode']} />
          <Field id="{p}-to-country" label="Country" class="country" bind:value={draft.clientAddress.country} error={errors['clientAddress.country']} />
        </div>
      </fieldset>

      <div class="grid-terms">
        <Field id="{p}-date" label="Invoice Date" type="date" disabled={!!editing} bind:value={draft.createdAt} error={errors.createdAt} />
        <div>
          <div class="select-label"><label for="{p}-terms">Payment Terms</label></div>
          <select id="{p}-terms" class="field select" bind:value={draft.paymentTerms}>
            {#each TERMS as t (t)}<option value={t}>Net {t} {t === 1 ? 'Day' : 'Days'}</option>{/each}
          </select>
        </div>
        <Field id="{p}-description" label="Project Description" class="full" placeholder="e.g. Graphic Design Service" bind:value={draft.description} error={errors.description} />
      </div>

      <fieldset class="items">
        <legend class="items-title">Item List</legend>
        {#each draft.items as item, i (item)}
          <fieldset class="item" class:first={i === 0}>
            <legend class="sr-only">Item {i + 1}</legend>
            <Field id="{p}-item-{i}-name" label="Item Name" class="name" labelClass="row-label" bind:value={item.name} error={errors[`items.${i}.name`]} />
            <Field id="{p}-item-{i}-qty" label="Qty." class="qty" labelClass="row-label" inputmode="numeric" bind:value={item.quantity} error={errors[`items.${i}.quantity`]} />
            <Field id="{p}-item-{i}-price" label="Price" class="price" labelClass="row-label" inputmode="decimal" bind:value={item.price} error={errors[`items.${i}.price`]} />
            <Field id="{p}-item-{i}-total" label="Total" class="total" labelClass="row-label" readonly value={formatAmount(lineTotal(item))} />
            <button class="trash" type="button" aria-label="Delete item {i + 1}" onclick={() => removeItem(i)}><img src={trash} alt="" width="13" height="16"></button>
          </fieldset>
        {/each}
        <button class="btn-add" type="button" onclick={() => draft.items.push(emptyItem())}>+ Add New Item</button>
      </fieldset>

      {#if messages.length}
        <div class="messages">{#each messages as m (m)}<p>{m}</p>{/each}</div>
      {/if}

      <div class="footer" class:editing>
        {#if editing}
          <button class="btn-light" type="button" onclick={close}>Cancel</button>
          <button class="btn-primary" type="submit">Save Changes</button>
        {:else}
          <button class="btn-light discard" type="button" onclick={close}>Discard</button>
          <button class="btn-dark draft" type="button" onclick={() => submit('draft')}>Save as Draft</button>
          <button class="btn-primary send" type="submit">Save &amp; Send</button>
        {/if}
      </div>
    </form>
  </div>
</dialog>

<style>
  @reference "../app.css";

  .drawer {
    @apply fixed start-0 top-18 m-0 h-[calc(100dvh-4.5rem)] max-h-none w-full max-w-none bg-surface p-0 md:top-20 md:h-[calc(100dvh-5rem)] md:w-[38.5rem] md:rounded-e-bar lg:top-0 lg:h-dvh lg:w-[44.9375rem];
  }

  .drawer::backdrop { @apply bg-scrim; }

  .scroller { @apply h-full overflow-y-auto; }

  form { @apply px-6 pt-[2.0625rem] md:ps-14 md:pe-14 md:pt-[3.6875rem] lg:ps-[9.9375rem]; }

  .back { @apply flex w-fit cursor-pointer items-center gap-6 text-heading-s font-bold text-ink md:hidden; }

  .title { @apply mt-[1.625rem] text-heading-m font-bold text-ink md:mt-0; }

  .group { @apply mt-[1.375rem] md:mt-[2.875rem]; }

  .group + .group { @apply mt-[2.5625rem] md:mt-[3.0625rem]; }

  .legend { @apply mb-6 text-heading-s font-bold text-heading-violet; }

  .grid-address { @apply grid grid-cols-2 gap-x-[1.4375rem] gap-y-[1.5625rem] md:grid-cols-3 md:gap-x-6; }

  .grid-address :global(.full), .grid-address :global(.country) { @apply col-span-2 md:col-span-3; }

  .grid-address :global(.country) { @apply md:col-span-1; }

  .grid-terms { @apply mt-[2.5625rem] grid gap-y-[1.5625rem] md:mt-[3.0625rem] md:grid-cols-2 md:gap-x-6; }

  .grid-terms :global(.full) { @apply md:col-span-2; }

  .select-label { @apply mb-[0.5625rem] text-body font-medium text-label; }

  .select {
    @apply cursor-pointer appearance-none pe-12;
    background: var(--field) url("../../assets/icon-arrow-down.svg") right 1rem center no-repeat;
  }

  .items { @apply mt-[4.3125rem] md:mt-[2.1875rem]; }

  .items-title { @apply mb-[1.375rem] text-item-title font-bold text-item-heading md:mb-[0.875rem]; }

  .item { @apply grid grid-cols-[4rem_6.25rem_1fr_auto] items-end gap-x-4 gap-y-[1.5625rem]; }

  .item + .item { @apply mt-[3.0625rem] md:mt-[1.125rem]; }

  .item :global(.name) { @apply col-span-4 md:col-span-1; }

  .item :global(.row-label) { @apply mb-[0.9375rem]; }

  .item :global(.qty .field) { @apply px-0 text-center md:px-0; }

  @media (width >= 48rem) {
    .item { @apply grid-cols-[13.375rem_2.875rem_6.25rem_1fr_auto]; }
    .item:not(.first) :global(.row-label) { @apply sr-only; }
  }

  .trash { @apply mb-4 grid size-4 cursor-pointer place-items-center opacity-100 hover:opacity-70; }

  .btn-add {
    @apply btn mt-12 w-full bg-btn3 text-btn3-text hover:bg-btn6-hover hover:text-btn3-text-hover md:mt-[1.125rem];
  }

  .messages { @apply mt-8 text-tiny font-semibold text-error; }

  .footer {
    @apply sticky bottom-0 -mx-6 mt-[5.5rem] flex h-[5.6875rem] items-center gap-[0.4375rem] bg-surface px-6 md:mx-0 md:mt-[2.4375rem] md:h-auto md:gap-2 md:px-0 md:pb-8;
  }

  .footer.editing { @apply justify-end; }

  .footer .discard { @apply px-[1.125rem] md:me-auto md:px-6; }

  .footer .draft { @apply ms-auto px-[0.9375rem] md:ms-0 md:px-6; }

  .footer .send { @apply px-[0.9375rem] md:px-6; }
</style>
