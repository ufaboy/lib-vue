<template>
  <router-view></router-view>
  <teleport to="body">
    <RefreshPopup v-if="updateAvailable" :sw-reg="registration" @refresh-sw="refreshApp"/>
    <TheToaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>

</template>

<script setup>
import {provide, ref} from "vue";
import RefreshPopup from "./components/RefreshPopup";
import TheToaster from "./components/TheToaster";

const toastMessage = ref('')
const toastType = ref('')
const registration = ref(null);
const updateAvailable = ref(false);
function swUpdate(event) {
  updateAvailable.value = true
  registration.value = event.detail
}
function refreshApp() {
  updateAvailable.value = false;
  if (!registration.value || !registration.value.waiting) return null;
  registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
}
function printToast(message, type) {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 5000)
}

document.addEventListener('swUpdated', swUpdate, {once: true})

provide('printToast', printToast)
</script>
<style>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>
