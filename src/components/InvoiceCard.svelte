<script>
  // Carte-lien d'une facture (spec §3.2) : son texte est son nom accessible, il commence par « #XM9141 »
  import StatusBadge from './StatusBadge.svelte'
  import arrow from '../../assets/icon-arrow-right.svg'
  import { formatDate, formatMoney } from '../lib/format.js'
  let { invoice } = $props()
</script>

<a class="card" href="#/invoice/{invoice.id}">
  <span class="id"><span class="text-hash">#</span>{invoice.id}</span>
  <span class="due">Due {formatDate(invoice.paymentDue)}</span>
  <span class="client">{invoice.clientName}</span>
  <span class="total">{formatMoney(invoice.total)}</span>
  <span class="status"><StatusBadge status={invoice.status} /></span>
  <img class="arrow" src={arrow} alt="" width="7" height="10">
</a>

<style>
  @reference "../app.css";

  .card {
    @apply grid h-[8.375rem] grid-cols-[1fr_auto] grid-rows-[0.9375rem_1fr] rounded-card border border-transparent bg-surface px-6 pt-[1.5625rem] pb-[1.375rem] shadow-card;
    grid-template-areas: "id client" "due status" "total status";
    grid-template-rows: 0.9375rem auto auto;
    row-gap: 0;
    transition-property: border-color;
    transition-duration: 150ms;
  }

  .card:hover {
    border-color: var(--color-violet);
  }

  .id { grid-area: id; @apply text-heading-s font-bold text-ink; }
  .client { grid-area: client; @apply text-end text-body font-medium text-client; }
  .due { grid-area: due; @apply mt-6 text-body font-medium text-label; }
  .total { grid-area: total; @apply mt-[0.5625rem] text-heading-s-tall font-bold text-ink; }
  .status { grid-area: status; @apply self-end mb-1.5; }
  .arrow { @apply hidden; }

  @media (width >= 48rem) {
    .card {
      @apply flex h-[4.5rem] items-center ps-6 pe-[1.375rem] pt-0 pb-0;
    }
    .id { @apply w-[5.4375rem] shrink-0; }
    .due { @apply mt-0 w-[8.9375rem] shrink-0; }
    .client { @apply min-w-0 flex-1 text-start; }
    .total { @apply mt-0 text-end; }
    .status { @apply ms-10 mb-0 self-center; }
    .arrow { @apply ms-[1.0938rem] block; }
  }

  @media (width >= 64rem) {
    .card { @apply ps-8; }
    .id { @apply w-[6.4375rem]; }
    .due { @apply w-[9.4375rem]; }
  }
</style>
