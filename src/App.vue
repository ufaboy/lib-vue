<template>
  <router-view class="" />
  <TheLoader v-if="loaderShow" />
  <teleport to="body">
    <TheToaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>
  <ReloadPrompt />
</template>
<script setup lang="ts">
import {provide, ref} from "vue";
import TheToaster from "./components/TheToaster.vue";
import {isMobile} from "./utils/helpers";
import TheLoader from "./components/TheLoader.vue";
import ReloadPrompt from "./components/ReloadPrompt.vue";

const toastMessage = ref('')
const toastType = ref('')
const loaderShow = ref(false)

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

function toggleLoader(status:boolean|undefined) {
  if (status === undefined) {
    loaderShow.value = !loaderShow.value
  } else {
    loaderShow.value = status
  }
}
provide('printToast', printToast)
provide('toggleLoader', toggleLoader)

</script>



<style lang="scss">
</style>
