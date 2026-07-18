<script setup lang="ts">
import { pinyinFinals, pinyinInitials } from '#/shared/tools/pinyin/constants.ts'
import { getShuangpinConstants } from '#/shared/tools/shuangpin/constants.ts'
import { zhuyinSymbols } from '#/shared/tools/zhuyin/constants.ts'
import { inputMode, spMode } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'
import { showCheatSheet } from '#/web/modal-state.ts'
import { getSymbolState } from '#/web/state.ts'

function getSymbolClass(symbol: string, key?: '_1' | '_2') {
  const state = getSymbolState(symbol, key)
  if (!state) return ''
  return {
    exact: 'text-ok',
    misplaced: 'text-mis',
    none: 'opacity-30',
  }[state]
}

function close() {
  showCheatSheet.value = false
}

const modeText = computed(
  () =>
    ({
      py: t('pinyin'),
      sp: t('shuangpin'),
      zy: t('zhuyin'),
    })[inputMode.value],
)

const spConstants = computed(() => getShuangpinConstants(spMode.value))
</script>

<template>
  <div class="p-8 pt-4 flex flex-col items-center justify-center relative">
    <div class="absolute top-4 right-4 flex gap-3">
      <button @click="close()" class="icon-btn">
        <div class="i-[carbon--close]" />
      </button>
    </div>

    <p class="text-xl font-serif mb-8">
      <b>{{ modeText }}{{ t('cheatsheet') }}</b>
    </p>
    <!-- Zhuyin -->
    <div v-if="inputMode === 'zy'" class="grid grid-cols-6 items-center justify-center">
      <div v-for="s of zhuyinSymbols" :key="s" :class="getSymbolClass(s)" class="text-2xl font-serif w-12 h-12">
        {{ s }}
      </div>
    </div>
    <!-- Shuangpin -->
    <div v-else-if="inputMode === 'sp'" class="grid grid-cols-[1fr_1fr] gap-x-10 gap-y-4 font-mono font-light">
      <div class="text-center">
        {{ t('initials') }}
      </div>
      <div class="text-center">
        {{ t('finals') }}
      </div>
      <div class="grid grid-cols-4 gap-4 h-min">
        <div v-for="s of spConstants.initials" :key="s" :class="getSymbolClass(s, '_1')">
          {{ s }}
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 h-min">
        <div v-for="s of spConstants.finals" :key="s" :class="getSymbolClass(s, '_2')">
          {{ s }}
        </div>
      </div>
    </div>
    <!-- Pinyin -->
    <div v-else class="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-4 font-mono font-light">
      <div class="text-center">
        {{ t('initials') }}
      </div>
      <div class="text-center">
        {{ t('finals') }}
      </div>
      <div class="grid grid-cols-2 gap-3 h-min">
        <div v-for="s of pinyinInitials" :key="s" :class="getSymbolClass(s)">
          {{ s }}
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 h-min">
        <div v-for="s of pinyinFinals" :key="s" :class="getSymbolClass(s)">
          {{ s.replace('v', 'ü') }}
        </div>
      </div>
    </div>
  </div>
</template>
