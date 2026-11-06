<script>
  // Barre de l'app (spec §3.1) : logo, bouton du thème, avatar ; à gauche dès 1024 px, en haut en dessous.
  // decorative : copie visuelle affichée au-dessus du formulaire ouvert (ADR-0008), ni lue ni atteignable.
  import logo from '../../assets/logo.svg'
  import moon from '../../assets/icon-moon.svg'
  import sun from '../../assets/icon-sun.svg'
  import avatar from '../../assets/image-avatar.jpg'
  import { theme, toggleTheme } from '../lib/theme.svelte.js'
  import { listHash } from '../lib/router.svelte.js'

  let { decorative = false } = $props()
  const next = $derived(theme.value === 'dark' ? 'light' : 'dark')
</script>

{#snippet content()}
  <a class="logo" href={listHash()} aria-label="Invoices" tabindex={decorative ? -1 : undefined}>
    <img class="logo-mark" src={logo} alt="" width="28" height="26">
  </a>
  <div class="tools">
    <button class="theme" type="button" aria-label="Switch to {next} theme" onclick={toggleTheme} tabindex={decorative ? -1 : undefined}>
      <img src={theme.value === 'dark' ? sun : moon} alt="" width="20" height="20">
    </button>
    <span class="divider"></span>
    <img class="avatar" src={avatar} alt="" width="40" height="40">
  </div>
{/snippet}

{#if decorative}
  <div class="bar" aria-hidden="true" inert>{@render content()}</div>
{:else}
  <header class="bar">{@render content()}</header>
{/if}

<style>
  @reference "../app.css";

  .bar {
    @apply fixed inset-x-0 top-0 z-20 flex h-18 items-center justify-between bg-bar md:h-20 lg:inset-x-auto lg:start-0 lg:h-dvh lg:w-[6.4375rem] lg:flex-col lg:rounded-e-bar;
  }

  .logo {
    @apply relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-e-bar bg-violet md:size-20 lg:size-[6.4375rem];
  }

  .logo::after {
    content: "";
    @apply absolute inset-x-0 bottom-0 top-1/2 rounded-ss-bar bg-violet-light;
  }

  .logo-mark {
    @apply relative z-10 h-[1.625rem] w-7 md:h-[1.8125rem] md:w-[1.9375rem] lg:h-[2.356rem] lg:w-10;
  }

  .tools {
    @apply flex h-full items-center lg:h-auto lg:w-full lg:flex-col;
  }

  .theme {
    @apply grid size-10 cursor-pointer place-items-center rounded-full opacity-100 hover:opacity-70;
  }

  .divider {
    @apply ms-3.5 me-6 h-full w-px bg-divider md:ms-[1.375rem] md:me-8 lg:mx-0 lg:mt-[1.375rem] lg:mb-6 lg:h-px lg:w-full;
  }

  .avatar {
    @apply me-6 size-8 rounded-full md:me-8 lg:me-0 lg:mb-6 lg:size-10;
  }
</style>
