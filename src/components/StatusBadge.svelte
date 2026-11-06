<script>
  // Badge de statut (spec §3.2, §4) : texte lu, point et fond décoratifs
  import { statusLabel } from '../lib/format.js'
  let { status } = $props()
</script>

<span class="badge {status}">{statusLabel(status)}</span>

<style>
  @reference "../app.css";
  .paid { @apply text-paid; }
  .pending { @apply text-pending; }
  .draft { @apply text-draft; }
</style>
