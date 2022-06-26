<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div v-if="offlineReady || needRefresh"
       class="pwa-toast fixed right-0 bottom-0 p-3 m-4 bg-yellow-200/75 dark:bg-slate-500 shadow-md rounded"
      role="alert"
  >
    <div class="message mb-2 dark:text-white">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available.
      </span>
    </div>
    <button class="btn rounded mr-3 !px-2 shadow bg-amber-300/75 hover:bg-amber-500/75 dark:bg-slate-600 dark:hover:bg-slate-700 dark:text-white"
            v-if="needRefresh" @click="updateServiceWorker()">
      Reload
    </button>
    <button class="btn rounded !px-2 shadow bg-yellow-300/75 hover:bg-yellow-500/75 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:text-white"
            @click="close">
      Close
    </button>
  </div>
</template>

<style>

</style>