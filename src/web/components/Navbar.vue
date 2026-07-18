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
  <nav border="b base" relative>
    <div class="app-nav-title" absolute font-serif text-2xl left-0 right-0 top-0 bottom-0 z--1 tracking-2 flex>
      <AppName ma />
    </div>
    <div class="app-nav-actions" flex items-center justify-between md:max-w-md ma py4 px2>
      <div flex items-center>
        <button icon-btn mx2 @click="openHelp()">
          <div i-carbon-help />
        </button>
        <button v-if="gamesCount" icon-btn mx2 @click="toggleDashboard()">
          <div i-carbon-catalog />
        </button>
      </div>
      <div flex items-center>
        <button icon-btn mx2 @click="toggleSettings()">
          <div i-carbon-settings />
        </button>
        <button icon-btn mx2 @click="toggleDark()">
          <div i-carbon-sun dark:i-carbon-moon />
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
