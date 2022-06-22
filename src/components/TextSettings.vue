<template>
<div class="fixed left-0 bottom-0 w-full text-white bg-slate-500 dark:bg-neutral-800 p-4">
  <header class="flex flex-row justify-between">
    <h2>Text Settings</h2>
    <button class="close-btn" type="reset" @click="closeModal">
      <IconClose class="icon" />
    </button>
  </header>
  <p>Current Progress: {{scrollingProgress.progress}}</p>
  <progress class="w-full h-4" :value="scrollingProgress.progress" max="100" id="progressbar" @click="scrollByClick"/>
  <p>{{scrollingProgress.currentPage}}/{{scrollingProgress.countPages}}</p>
</div>
</template>

<script setup>
import IconClose from "@/components/icons/IconClose.vue"
const emit = defineEmits(['hide-modal', 'scroll-by-click'])
const props = defineProps({
  book: Object,
  scrollingProgress: {
    type: Object,
    default() {
      return {
        progress: 0,
        countPages: 0,
        clientHeight: 0,
        currentPage: 0,
      }
    }
  },
})
function closeModal() {
  emit('hide-modal')
}
function scrollByClick(e) {
  emit('scroll-by-click', e)
}
</script>

<style lang="scss">
.text-settings {
  padding: 1rem;
  .text-settings-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .progress {
    width: 100%;
    height: 1rem;
    max-height: 100%;
    background: var(--surface);
  }

  .progress-value {
    position: absolute;
    left: 50%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .progress::-webkit-progress-value {
  }
}
</style>