<script setup lang="ts">
import confetti from 'canvas-confetti'
import { isPassed } from '#/web/state.ts'

function congrats() {
  const styles = getComputedStyle(document.documentElement)
  const defaults = {
    colors: Array.from({ length: 5 }, (_, index) => styles.getPropertyValue(`--c-confetti-${index + 1}`).trim()),
    shapes: ['square'],
    ticks: 500,
  } as confetti.Options
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 100,
    origin: { y: 0 },
  })
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
    })
  }, 250)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
    })
  }, 400)
}

watch(
  isPassed,
  (v) => {
    if (v) setTimeout(congrats, 300)
  },
  { flush: 'post' },
)
</script>

<template>
  <div />
</template>
