<template>
  <router-view></router-view>
  <teleport to="body">
    <TheToaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>
</template>
<script setup lang="ts">
import {provide, ref} from "vue";
import TheToaster from "./components/TheToaster.vue";
import {isMobile} from "./utils/helpers";

const toastMessage = ref('')
const toastType = ref('')


function printToast(message: string, type: string): void {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 5000)
}

if (isMobile()) {
  document.documentElement.classList.add('mobile')
}
provide('printToast', printToast)

</script>



<style lang="scss">
</style>
