<script setup lang="ts">
import {  defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { isSmallDevice } from '../../utils/helper';

const BookTable = defineAsyncComponent(() =>
  import('./BookTable.vue')
)
const BookList = defineAsyncComponent(() =>
  import('./BookList.vue')
)

const smallDedice = ref(isSmallDevice());

function updateDeviceSize() {
    smallDedice.value = isSmallDevice();
}

document.title = 'Books';

onMounted(() => {
    window.addEventListener('resize', updateDeviceSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceSize);
  });
</script>


<template>
  <component :is="smallDedice ? BookList : BookTable" />
</template>