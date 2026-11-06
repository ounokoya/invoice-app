<script>
  // Confirmation de suppression (spec §3.5, ADR-0008) : dialogue modal d'alerte
  let { id, onconfirm } = $props()
  let dialog = $state()

  export function open() {
    dialog.showModal()
  }
</script>

<dialog class="alert" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-text" bind:this={dialog}>
  <h2 id="delete-title" class="title">Confirm Deletion</h2>
  <p id="delete-text" class="text">Are you sure you want to delete invoice #{id}? This action cannot be undone.</p>
  <div class="actions">
    <button class="btn-light" type="button" onclick={() => dialog.close()}>Cancel</button>
    <button class="btn-danger" type="button" onclick={() => { dialog.close(); onconfirm() }}>Delete</button>
  </div>
</dialog>

<style>
  @reference "../app.css";

  .alert {
    @apply m-auto w-[20.4375rem] rounded-card bg-surface px-8 pt-[2.125rem] pb-8 md:w-[30rem] md:px-12 md:pt-[3.1875rem] md:pb-12;
  }

  .alert::backdrop { @apply bg-scrim; }

  .title { @apply text-heading-m font-bold text-ink; }

  .text { @apply mt-2 text-body-wide font-medium text-muted md:mt-3; }

  .actions { @apply mt-[1.375rem] flex justify-end gap-2 md:mt-[0.875rem]; }
</style>
