<script setup lang="ts">
import { showShareDialog } from '#/web/modal-state.ts'
import { t } from '#/web/i18n.ts'

function open() {
  showShareDialog.value = true
}
</script>

<template>
  <button
    @click="open()"
    class="btn flex flex-wrap gap-x-2 items-center justify-center whitespace-nowrap text-lg font-serif px-3 py-1"
  >
    <div class="i-[carbon--share] text-[var(--c-text)]" />
    {{ t('share') }}
  </button>
</template>
