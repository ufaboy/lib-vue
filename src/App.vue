<template>
  <router-view class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" :categories="categories" />
  <teleport to="body">
    <TheToaster v-if="toastMessage" :message="toastMessage" :type="toastType"/>
  </teleport>
</template>
<script setup lang="ts">
import {provide, ref} from "vue";
import TheToaster from "./components/TheToaster.vue";
import {isMobile} from "./utils/helpers";
import {CategoryExtended} from "./interfaces/category";
import {loadCategories} from "./utils/loadData";

const toastMessage = ref('')
const toastType = ref('')
const categories = ref<CategoryExtended[]>([])

function printToast(message: string, type: string): void {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 5000)
}
async function getCategories() {
  if (categories.value && categories.value.length === 0 && sessionStorage.getItem('lib-token')) {
    categories.value = await loadCategories()
  }
}

getCategories();

if (isMobile()) {
  document.documentElement.classList.add('mobile')
}
provide('printToast', printToast)

</script>



<style lang="scss">
</style>
