<script setup lang="ts">
import { showDashboard, showHelp, showSettings } from '#/web/modal-state.ts'
import { isDark, useMask } from '#/web/state.ts'
import { gamesCount } from '#/web/storage.ts'

const toggleDark = useToggle(isDark)
const toggleSettings = useToggle(showSettings)
const toggleDashboard = useToggle(showDashboard)

function openHelp() {
  showHelp.value = true
  useMask.value = false
}
</script>

<template>
  <nav class="border-b border-base relative">
    <div
      class="app-nav-title absolute font-serif text-2xl left-0 right-0 top-0 bottom-0 z-[-0.25rem] tracking-[2px] flex"
    >
      <AppName class="m-auto" />
    </div>
    <div class="app-nav-actions flex items-center justify-between md:max-w-md m-auto py-4 px-2">
      <div class="flex items-center">
        <button @click="openHelp()" class="icon-btn mx-2">
          <div class="i-[carbon--help]" />
        </button>
        <button v-if="gamesCount" @click="toggleDashboard()" class="icon-btn mx-2">
          <div class="i-[carbon--catalog]" />
        </button>
      </div>
      <div class="flex items-center">
        <button @click="toggleSettings()" class="icon-btn mx-2">
          <div class="i-[carbon--settings]" />
        </button>
        <button @click="toggleDark()" class="icon-btn mx-2">
          <div class="i-[carbon--sun] dark:i-[carbon--moon]" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@media (min-width: 768px) {
  .app-nav-actions {
    position: relative;
    z-index: 1;
    max-width: 48rem !important;
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .app-nav-title {
    z-index: 0 !important;
  }
}
</style>
