<script>
  // Champ du formulaire (spec §3.4, ADR-0008) : libellé, message d'erreur lié, état invalide
  let { id, label, value = $bindable(), error = '', type = 'text', placeholder = undefined, readonly = false, disabled = false,
    inputmode = undefined, class: cls = '', labelClass = '', compact = false } = $props()
</script>

<div class="wrap {cls}">
  <div class="label-row {labelClass}" class:invalid={error}>
    <label for={id}>{label}</label>
    {#if error}<span class="msg" id="{id}-error">{error}</span>{/if}
  </div>
  <input class="field" class:compact {id} {type} bind:value {placeholder} {readonly} {disabled} {inputmode} tabindex={readonly ? -1 : undefined}
    aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-error` : undefined}>
</div>

<style>
  @reference "../app.css";

  .label-row { @apply mb-[0.5625rem] flex justify-between gap-2 text-body font-medium text-label; }

  .label-row.invalid { @apply text-error; }

  .msg { @apply text-tiny font-semibold text-error; }

  input[readonly] { @apply border-transparent bg-transparent px-0 text-label; }

  input[readonly]:hover { border-color: transparent; }

  input:disabled { @apply cursor-not-allowed opacity-50; }

  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    background: url("../../assets/icon-calendar.svg") center / 1rem no-repeat;
    opacity: 1;
  }
</style>
