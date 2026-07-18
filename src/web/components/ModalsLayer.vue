<script setup lang="ts">
import {
  showCheatSheet,
  showDashboard,
  showFailed,
  showHelp,
  showHint,
  showSettings,
  showShareDialog,
  showVariants,
} from '#/web/modal-state.ts'
import { t } from '#/web/i18n.ts'
</script>

<template>
  <Modal v-model="showCheatSheet" :label="t('cheatsheet')">
    <CheatSheet />
  </Modal>
  <Modal v-model="showSettings" :label="t('settings')">
    <Settings my6 />
  </Modal>
  <Modal v-model="showHint" :label="t('hint')">
    <Hint />
  </Modal>
  <Modal v-model="showFailed" :label="t('view-answer')">
    <FailedPage />
  </Modal>
  <Modal v-model="showDashboard" :label="t('dashboard')">
    <Dashboard />
  </Modal>
  <Modal v-model="showShareDialog" :label="t('share')">
    <ShareDialog />
  </Modal>
  <Modal v-model="showHelp" :label="t('rule')">
    <WelcomePage />
  </Modal>
  <Modal v-model="showVariants" :label="t('other-variants')">
    <VariantLinks />
  </Modal>
</template>
