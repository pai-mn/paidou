<script setup lang="ts">
import { showHelp, showVariants } from '#/web/modal-state.ts'
import { useMask } from '#/web/state.ts'
import { initialized, inputMode } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'

function start() {
  showHelp.value = false
  useMask.value = false
  initialized.value = true
}

function variantButton() {
  showVariants.value = true
}

const final = computed(() => ({ py: 'uo', zy: 'ㄨㄛ', sp: 'o' })[inputMode.value])
</script>

<template>
  <div class="px-5 py-10 flex flex-col gap-2 items-center relative">
    <div class="absolute top-4 right-4 flex gap-3">
      <button v-if="initialized" @click="start()" class="icon-btn">
        <div class="i-[carbon--close]" />
      </button>
    </div>

    <AppName class="h-[2.5rem]" />
    <div class="mt-[-0.25rem] opacity-50 text-sm">
      {{ t('description') }}
    </div>

    <div class="h-px w-10 border-b border-base m-4" />

    <p class="text-xl font-serif mb-4">
      <b>{{ t('rule') }}</b>
    </p>

    <p>
      {{ t('intro-1') }} <b class="text-ok">{{ t('intro-2') }}</b
      >。
    </p>
    <p>{{ t('intro-3') }}</p>
    <div class="h-px w-10 border-b border-base m-4" />

    <WordBlocks :word="t('example-1')" :revealed="true" answer=" 门  " class="my-2" />
    <p>
      {{ t('intro-4') }} <b class="text-ok">{{ t('intro-5') }}</b> {{ t('intro-6') }}
    </p>

    <WordBlocks :word="t('example-2')" :revealed="true" answer="一一一水" class="my-2" />
    <p>
      {{ t('intro-7') }} <b class="text-mis">{{ t('intro-8') }}</b> {{ t('intro-9') }}
    </p>

    <WordBlocks :word="t('example-3')" :revealed="true" answer="桥它拖 " class="my-2" />
    <p class="max-w-[32.5rem]">
      {{ t('intro-10') }} <b>{{ t('intro-11') }}</b> {{ t('intro-12') }} {{ t('intro-13') }}
      <b class="opacity-50">{{ t('intro-14') }}</b> {{ t('intro-15') }} <b class="opacity-50">{{ t('intro-14') }}</b>
      {{ t('intro-16') }} {{ t('intro-17') }} <b class="text-mis">{{ final }}</b> {{ t('intro-19') }}
    </p>

    <WordBlocks :word="t('example-4')" :revealed="true" answer="武运昌隆" class="my-2" />
    <p>{{ t('intro-20') }}</p>

    <div class="h-px w-10 border-b border-base m-4" />

    <button @click="start()" class="btn px-4 py-2">
      <span class="tracking-[1px] pl-1">{{ t('start') }}</span>
    </button>
    <div class="opacity-50">
      {{ t('update-tip') }}
    </div>

    <div class="h-px w-10 border-b border-base m-4" />

    <Settings :lite="true" />

    <div class="h-px w-10 border-b border-base m-4" />

    <div class="h-px w-10 border-b border-base m-4" />
    <button @click="variantButton()" class="text-primary opacity-80 hover:opacity-100">
      {{ t('other-variants') }}
    </button>
    <div>
      <span class="opacity-40">inspired by </span
      ><a href="https://www.powerlanguage.co.uk/wordle/" target="_blank" class="opacity-50 hover:opacity-80">Wordle</a>
      <span class="opacity-40">, made by Inès</span>
    </div>
    <a
      href="https://github.com/pai-mn/paidou"
      target="_blank"
      class="flex items-center justify-center gap-1 opacity-50 hover:opacity-80"
    >
      <div class="i-[carbon--logo-github]" />
      Source Code
    </a>
  </div>
</template>
