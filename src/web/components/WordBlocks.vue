<script setup lang="ts">
import { parseWord, parsedAnswer, testAnswer, answer as todayAnswer } from '#/web/state.ts'
import { WORD_LENGTH } from '#/shared/game-constants.ts'

const props = withDefaults(
  defineProps<{
    word: string
    revealed?: boolean
    answer?: string
    animate?: boolean
    active?: boolean
  }>(),
  {
    animate: true,
  },
)

const result = computed(() => {
  if (props.revealed) {
    return testAnswer(parseWord(props.word), props.answer ? parseWord(props.answer) : parsedAnswer.value)
  }
  return []
})
const displayedWord = computed(() => {
  const characters = Array.from(props.word)
  return characters
    .concat(Array(Math.max(0, WORD_LENGTH - characters.length)).fill(' '))
    .slice(0, WORD_LENGTH)
    .join('')
})

const flip = ref(false)

watchEffect(() => {
  if (props.revealed) {
    setTimeout(() => {
      flip.value = true
    }, Math.random() * 300)
  }
})
</script>

<template>
  <div class="word-row flex">
    <div
      v-for="(c, i) in parseWord(displayedWord, answer || todayAnswer.word)"
      :key="i"
      :class="[flip ? 'revealed' : '']"
      class="tile"
    >
      <template v-if="animate">
        <CharBlock
          :char="c"
          :active="active"
          :style="{ transitionDelay: `${i * (300 + Math.random() * 50)}ms` }"
          class="front"
        />
        <CharBlock
          :char="c"
          :answer="result[i]"
          :style="{
            transitionDelay: `${i * (300 + Math.random() * 50)}ms`,
            animationDelay: `${i * (100 + Math.random() * 50)}ms`,
          }"
          class="back"
        />
      </template>
      <template v-else>
        <CharBlock :char="c" :answer="result[i]" :active="active" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.word-row {
  gap: var(--game-tile-gap);
  width: var(--game-board-width);
  margin-block: calc(var(--game-tile-gap) / 2);
}

.tile {
  user-select: none;
  position: relative;
  width: var(--game-tile-size);
  height: var(--game-tile-size);
  flex: none;
}
.tile .front,
.tile .back {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .back {
  transform: rotateY(180deg);
}
.tile.revealed .front {
  transform: rotateY(180deg);
}
.tile.revealed .back {
  transform: rotateY(0deg);
}
</style>
