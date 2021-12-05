<template>
  <router-view></router-view>
  <teleport to="body">
    <RefreshPopup v-if="updateAvailable" :sw-reg="registration" @refresh-sw="refreshApp"/>
    <TheToaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>
</template>
<script setup lang="ts">
import {provide, ref} from "vue";
import RefreshPopup from "./components/RefreshPopup.vue";
import TheToaster from "./components/TheToaster.vue";
import {isMobile} from "./utils/helpers";

const toastMessage = ref('')
const toastType = ref('')
const registration = ref();
const updateAvailable = ref(false);
function swUpdate(event: CustomEvent):void {
  updateAvailable.value = true
  registration.value = event.detail
}
function refreshApp() {
  updateAvailable.value = false;
  if (!registration.value || !registration.value.waiting) return null;
  registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
}
function printToast(message: string, type: string): void {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 5000)
}

document.addEventListener('swUpdated', swUpdate as EventListener, {once: true})
if (isMobile()) {
  document.documentElement.classList.add('mobile')
}
provide('printToast', printToast)

</script>



<style lang="scss">
</style>
