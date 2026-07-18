<script setup lang="ts">
import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'
import { dayNoHanzi, isIOS, isMobile, useMask } from '#/web/state.ts'
import { tries } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'

const el = ref<HTMLDivElement>()
const show = ref(false)
const showDialog = ref(false)
const dataUrlUnmasked = ref('')
const dataUrlMasked = ref('')

const dataUrl = computed(() => (useMask.value ? dataUrlMasked.value : dataUrlUnmasked.value))

async function render() {
  show.value = true
  await nextTick()
  await nextTick()
  showDialog.value = true
  const p = useMask.value
  useMask.value = false
  await nextTick()
  dataUrlUnmasked.value = await toPng(el.value!)
  useMask.value = true
  await nextTick()
  dataUrlMasked.value = await toPng(el.value!)
  useMask.value = p
  show.value = false
}

onMounted(() => render())

async function download() {
  saveAs(dataUrl.value, `${t('name')} ${dayNoHanzi.value}${useMask.value ? ' 遮罩' : ''}.png`)
}
</script>

<template>
  <div v-if="isMobile" class="opacity-50 mb-4">
    {{ t('press-and-download-image') }}
  </div>
  <img v-if="dataUrl" :src="dataUrl" class="w-80 min-h-10 border border-base rounded-surface" />
  <div v-else class="w-80 border border-base rounded-surface p-4 animate-pulse">
    {{ t('rendering') }}
  </div>

  <div class="flex py-4">
    <button v-if="!isIOS" :disabled="!dataUrl" @click="download()" class="mx-2 square-btn gap-1">
      <div class="i-[carbon--download]" />
      {{ t('download') }}
    </button>

    <ToggleMask class="mx-2" />
  </div>

  <div v-if="show" class="fixed opacity-0 top-0 left-0 pointer-events-none">
    <div ref="el" class="flex flex-col items-center px-6 py-4 bg-base relative text-center">
      <AppName class="w-full" />
      <div class="w-full text-xs mt-1 mb-3 opacity-50 whitespace-nowrap">paidou.pai.mn</div>

      <WordBlocks v-for="(w, i) of tries" :key="i" :word="w" :revealed="true" :animate="false" />
      <ResultFooter :day="true" class="mt-3 w-full" />
    </div>
  </div>
</template>
