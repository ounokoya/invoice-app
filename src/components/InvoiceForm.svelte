<script>
  // Formulaire de création et de modification (spec §3.4, ADR-0008) : tiroir en desktop et tablette, page en mobile
  import { tick } from 'svelte'
  import AppBar from './AppBar.svelte'
  import Field from './Field.svelte'
  import arrowLeft from '../../assets/icon-arrow-left.svg'
  import trash from '../../assets/icon-delete.svg'
  import { emptyInvoice, emptyItem, validate, lineTotal, TERMS } from '../lib/rules.js'
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

  // Ombre au-dessus du pied tant qu'il reste du formulaire en dessous (écrans « With Scroll » de la maquette)
  let more = $state(false)
  const measure = () => { more = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 1 }
  $effect(() => {
    const observer = new ResizeObserver(measure)
    observer.observe(scroller)
    observer.observe(scroller.firstElementChild)
    return () => observer.disconnect()
  })

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
  <div class="scroller" bind:this={scroller} onscroll={measure}>
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
        <div class="messages" role="alert">{#each messages as m (m)}<p>{m}</p>{/each}</div>
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
  <div class="shade" class:more></div>
</dialog>

<style>
  @reference "../app.css";

  .drawer {
    @apply fixed start-0 top-18 m-0 h-[calc(100dvh-4.5rem)] max-h-none w-full max-w-none overflow-hidden bg-surface p-0 md:top-20 md:h-[calc(100dvh-5rem)] md:w-[38.5rem] md:rounded-e-bar lg:top-0 lg:h-dvh lg:w-[44.9375rem];
  }

  .drawer::backdrop { @apply bg-scrim; }

  /* bloc de référence des libellés sr-only : ils défilent avec le formulaire.
     Barre de la maquette : pouce de 8 px arrondi, à 8 px du bord (32 px dès 768 px), dans une gouttière gardée ;
     --pe est la marge de droite du formulaire, réduite de la largeur de la gouttière */
  .scroller {
    @apply relative h-full overflow-y-auto;
    --pe: calc(var(--spacing) * 6);
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: var(--field-border) transparent;
  }

  @variant md {
    .scroller { --pe: calc(var(--spacing) * 14); }
  }

  @supports selector(::-webkit-scrollbar) {
    .scroller {
      --pe: calc(var(--spacing) * 2);
      scrollbar-width: auto;
      scrollbar-color: auto;
    }

    .scroller::-webkit-scrollbar { @apply w-4 md:w-10; }

    .scroller::-webkit-scrollbar-thumb {
      border-inline-end: calc(var(--spacing) * 2) solid transparent;
      border-radius: 0.25rem 0.75rem 0.75rem 0.25rem / 0.25rem;
      background-clip: padding-box;
      background-color: var(--field-border);
    }

    @variant md {
      .scroller { --pe: calc(var(--spacing) * 4); }

      .scroller::-webkit-scrollbar-thumb {
        border-inline-end-width: calc(var(--spacing) * 8);
        border-radius: 0.25rem 2.25rem 2.25rem 0.25rem / 0.25rem;
      }
    }
  }

  form { @apply ps-6 pe-(--pe) pt-[2.0625rem] md:ps-14 md:pt-[3.6875rem] lg:ps-[9.9375rem]; }

  .shade {
    @apply pointer-events-none absolute inset-x-0 bottom-[5.6875rem] h-16 md:bottom-[6.9375rem] md:h-[8.8125rem] md:opacity-0;
    background-image: linear-gradient(transparent, var(--color-shade));
  }

  @variant md {
    .shade { background-image: linear-gradient(transparent, var(--color-shade-strong)); }
    .shade.more { @apply opacity-100; }
  }

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

  @variant md {
    .item { @apply grid-cols-[13.375rem_2.875rem_6.25rem_1fr_auto]; }
    .item:not(.first) :global(.row-label) { @apply sr-only; }
  }

  .trash { @apply mb-4 grid size-4 cursor-pointer place-items-center opacity-100 hover:opacity-70; }

  .btn-add {
    @apply btn mt-12 w-full bg-btn3 text-btn3-text hover:bg-btn6-hover hover:text-btn3-text-hover md:mt-[1.125rem];
  }

  .messages { @apply mt-8 text-tiny font-semibold text-error; }

  .footer {
    @apply sticky bottom-0 -ms-6 -me-(--pe) mt-[5.5rem] flex h-[5.6875rem] items-center gap-[0.4375rem] bg-surface ps-6 pe-(--pe) md:mx-0 md:mt-2 md:h-auto md:gap-2 md:px-0 md:pt-[1.9375rem] md:pb-8;
  }

  .footer.editing { @apply justify-end; }

  .footer .discard { @apply px-[1.125rem] md:me-auto md:px-6; }

  .footer .draft { @apply ms-auto px-[0.9375rem] md:ms-0 md:px-6; }

  .footer .send { @apply px-[0.9375rem] md:px-6; }
</style>
