<script setup lang="ts">
import {
  colorblind,
  inputMode,
  meta,
  spMode,
  useCheckAssist,
  useNoHint,
  useNumberTone as useNumberToneRaw,
  useStrictMode,
} from '#/web/storage.ts'
import { useNumberTone } from '#/web/state.ts'
import { locale, t } from '#/web/i18n.ts'

defineProps<{
  lite?: boolean
}>()
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-center flex-wrap">
      <div class="square-btn m-2">
        <button :class="locale === 'hans' ? 'text-primary' : 'opacity-80'" @click="locale = 'hans'">简体</button>
        <div class="w-px h-4 border-r border-base" />
        <button :class="locale === 'hant' ? 'text-primary' : 'opacity-80'" @click="locale = 'hant'">繁體</button>
      </div>
      <button
        :class="colorblind ? 'text-primary' : 'opacity-80'"
        @click="colorblind = !colorblind"
        class="square-btn m-2"
      >
        {{ t('colorblind-mode') }}
        <div v-if="colorblind" square-btn-mark />
      </button>
    </div>
    <div class="flex items-center justify-center flex-wrap">
      <div class="square-btn m-2">
        <button :class="inputMode === 'py' ? 'text-primary' : 'opacity-80'" @click="inputMode = 'py'">
          {{ t('pinyin') }}
        </button>
        <div class="w-px h-4 border-r border-base" />
        <button :class="inputMode === 'zy' ? 'text-primary' : 'opacity-80'" @click="inputMode = 'zy'">
          {{ t('zhuyin') }}
        </button>
        <div class="w-px h-4 border-r border-base" />
        <button :class="inputMode === 'sp' ? 'text-primary' : 'opacity-80'" @click="inputMode = 'sp'">
          {{ t('shuangpin') }}
        </button>
      </div>
      <div :class="inputMode !== 'py' ? 'opacity-50 pointer-events-none' : ''" class="square-btn m-2">
        <button :class="!useNumberTone ? 'text-primary' : 'opacity-80'" @click="useNumberToneRaw = false">
          {{ t('tone-symbol') }}
        </button>
        <div class="w-px h-4 border-r border-base" />
        <button :class="useNumberTone ? 'text-primary' : 'opacity-80'" @click="useNumberToneRaw = true">
          {{ t('tone-number') }}
        </button>
      </div>
    </div>
    <div v-if="inputMode === 'sp'" class="flex items-center justify-center flex-wrap">
      <div class="square-btn m-2">
        <button :class="spMode === 'sougou' ? 'text-primary' : 'opacity-80'" @click="spMode = 'sougou'">
          {{ t('shuangpin-sougou') }}
        </button>
        <div class="w-px h-4 border-r border-base" />
        <button :class="spMode === 'xiaohe' ? 'text-primary' : 'opacity-80'" @click="spMode = 'xiaohe'">
          {{ t('shuangpin-xiaohe') }}
        </button>
      </div>
    </div>
    <div v-if="!lite" class="flex items-center justify-center flex-wrap">
      <button :class="useNoHint ? 'text-primary' : 'opacity-80'" @click="useNoHint = !useNoHint" class="square-btn m-2">
        {{ t('hard-mode') }}
        <div v-if="useNoHint" square-btn-mark />
      </button>
      <button
        :class="useCheckAssist ? 'text-primary' : 'opacity-80'"
        @click="useCheckAssist = !useCheckAssist"
        class="square-btn m-2"
      >
        {{ t('check-assist') }}
        <div v-if="useCheckAssist" square-btn-mark />
      </button>
      <button
        :class="[
          useStrictMode ? 'text-primary' : 'opacity-80',
          !!meta.tries?.length ? 'opacity-50 pointer-events-none' : '',
        ]"
        @click="useStrictMode = !useStrictMode"
        class="square-btn m-2"
      >
        {{ t('strict-mode') }}
        <div v-if="useStrictMode" square-btn-mark />
      </button>
    </div>
  </div>
</template>
