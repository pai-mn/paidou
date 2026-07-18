<script setup lang="ts">
import { showShareDialog } from '#/web/modal-state.ts'
import { t } from '#/web/i18n.ts'

const shareType = ref<'text' | 'image' | null>()

watch(showShareDialog, (v) => {
  if (!v) shareType.value = null
})
</script>

<template>
  <div class="flex flex-col p-6 items-center relative">
    <div class="absolute top-4 right-4 flex">
      <button @click="showShareDialog = false" class="icon-btn">
        <div class="i-[carbon--close]" />
      </button>
    </div>
    <div v-if="shareType" class="absolute top-4 left-4 flex">
      <button @click="shareType = null" class="icon-btn">
        <div class="i-[carbon--arrow-left]" />
      </button>
    </div>

    <p class="text-xl font-serif mb-4">
      <b>{{
        shareType === 'text' ? t('share-with-text') : shareType === 'image' ? t('download-as-image') : t('share')
      }}</b>
    </p>
    <template v-if="!shareType">
      <div>
        {{ t('select-share-method') }}
      </div>
      <div class="grid grid-cols-2 gap-2 my-4">
        <button
          @click="shareType = 'text'"
          class="flex flex-col items-center justify-center border border-base p-4 opacity-80 hover:opacity-100 hover:bg-subtle w-[7.5rem] h-[7.5rem]"
        >
          <div class="i-[ep--tickets] text-10 opacity-70 mb-1" />
          <div>{{ t('share-with-text') }}</div>
        </button>
        <button
          @click="shareType = 'image'"
          class="flex flex-col items-center justify-center border border-base p-4 opacity-80 hover:opacity-100 hover:bg-subtle w-[7.5rem] h-[7.5rem]"
        >
          <div class="i-[ep--picture] text-10 opacity-70 mb-1" />
          <div>{{ t('download-as-image') }}</div>
        </button>
      </div>
    </template>
    <template v-if="shareType === 'text'">
      <ShareText />
    </template>
    <template v-if="shareType === 'image'">
      <ShareImage />
    </template>
  </div>
</template>
