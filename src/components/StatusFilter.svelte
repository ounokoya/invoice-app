<script>
  // Filtre par statut (spec §3.2, Q-B4) : bouton qui ouvre trois cases ; le choix va dans l'adresse
  import arrow from '../../assets/icon-arrow-down.svg'
  import { route, setFilter } from '../lib/router.svelte.js'
  import { screen } from '../lib/media.svelte.js'

  const STATUSES = ['draft', 'pending', 'paid']
  let open = $state(false)
  let root = $state()

  function toggle(status, checked) {
    setFilter(checked ? [...route.filter, status] : route.filter.filter((s) => s !== status))
  }

  function onWindowClick(event) {
    if (open && !root.contains(event.target)) open = false
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && open) {
      open = false
      root.querySelector('button').focus()
    }
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<div class="filter" bind:this={root}>
  <button class="toggle" type="button" aria-label="Filter by status" aria-expanded={open} aria-controls="status-filter" onclick={() => (open = !open)}>
    {screen.wide ? 'Filter by status' : 'Filter'}
    <img class="chevron" class:open src={arrow} alt="" width="11" height="7">
  </button>
  {#if open}
    <div class="menu" id="status-filter">
      {#each STATUSES as status (status)}
        <label class="option">
          <input type="checkbox" checked={route.filter.includes(status)} onchange={(event) => toggle(status, event.currentTarget.checked)}>
          {status[0].toUpperCase() + status.slice(1)}
        </label>
      {/each}
    </div>
  {/if}
</div>

<style>
  @reference "../app.css";

  .filter { @apply relative; }

  .toggle {
    @apply flex h-11 cursor-pointer items-center gap-3 md:h-12 text-heading-s font-bold text-ink;
  }

  .chevron { transition: rotate 150ms; }
  .chevron.open { rotate: 180deg; }

  .menu {
    @apply absolute start-1/2 top-[calc(100%+0.4375rem)] z-10 flex w-48 -translate-x-1/2 flex-col gap-4 rounded-card bg-surface p-6 shadow-menu dark:bg-night-2;
  }

  .option {
    @apply flex cursor-pointer items-center gap-[0.8125rem] text-heading-s font-bold text-ink;
  }

  input {
    @apply size-4 cursor-pointer appearance-none rounded-[0.125rem] border border-transparent bg-lavender dark:bg-night;
    background-position: center;
    background-repeat: no-repeat;
    transition-property: border-color, background-color;
    transition-duration: 150ms;
  }

  input:hover { border-color: var(--color-violet); }

  input:checked {
    background-color: var(--color-violet);
    background-image: url("../../assets/icon-check.svg");
  }

  input:focus-visible {
    outline: 0.125rem solid var(--focus);
    outline-offset: 0.125rem;
  }
</style>
