<template>
  <router-view></router-view>
  <teleport to="body">
    <refresh-popup v-if="updateAvailable" :sw-reg="registration" @refresh-sw="refreshApp"/>
    <the-toaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>

</template>

<script>
import {defineAsyncComponent, provide, ref} from "vue";
import RefreshPopup from "./components/RefreshPopup";

export default {
  components: {
    RefreshPopup,
    TheToaster: defineAsyncComponent(() => import('./components/TheToaster.vue'))
  },
  setup() {
    const toastMessage = ref('')
    const toastType = ref('')
    const registration = ref(null);
    const updateAvailable = ref(false);
    const swUpdate = function (event) {
      updateAvailable.value = true
      registration.value = event.detail
    }
    const refreshApp = function () {
      updateAvailable.value = false;
      if (!registration.value || !registration.value.waiting) return null;
      registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
    }
    const printToast = function (message, type) {
      toastMessage.value = message
      toastType.value = type
      setTimeout(() => {
        toastMessage.value = ''
        toastType.value = ''
      }, 5000)
    }

    document.addEventListener('swUpdated', swUpdate, {once: true})

    provide('printToast', printToast)
    return {toastMessage, toastType, registration, updateAvailable, swUpdate, refreshApp, printToast}
  },
}
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
