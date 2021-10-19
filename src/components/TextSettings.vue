<template>
<div class="text-settings">
  <header class="header">
    <h2>Text Settings</h2>
    <button class="close-btn" type="reset" @click="closeModal">
      <IconClose class="icon" />
    </button>
  </header>
  <p>Current Progress: {{scrollingProgress.progress}}</p>
  <progress class="progress" :value="scrollingProgress.progress" max="100" id="progressbar" @click="scrollByClick"/>
  <p>{{scrollingProgress.currentPage}}/{{scrollingProgress.countPages}}</p>
</div>
</template>

<script setup>
import IconClose from "@/components/icons/IconClose"
// eslint-disable-next-line no-undef
const emit = defineEmits(['hide-modal', 'scroll-by-click'])
// eslint-disable-next-line no-undef,no-unused-vars
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

<style scoped lang="scss">
.text-settings {
  padding: 1rem;
  .header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
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