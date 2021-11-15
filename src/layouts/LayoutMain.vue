<template>
  <div class="basement" @click="activeBurger = false">
    <teleport to="#aside" :disabled="isMobile()">
      <navigator-mobile v-if="isMobile()" />
      <NavigatorDesktop v-else />
    </teleport>
    <router-view v-bind="$attrs" :categories="categories" :scrolling-progress="scrollingProgress"
                 :window-heights="windowHeights"></router-view>
  </div>
</template>

<script setup>
import {onBeforeUnmount, provide, ref} from "vue";
import {isMobile} from "../utils/helpers";
import {loadCategories} from "@/utils/loadData";
import useScroll from "../composables/useScroll";
import {updateBookMark} from "../utils/uploadData";
import NavigatorDesktop from "../components/sidebar/NavigatorDesktop";
import NavigatorMobile from "../components/sidebar/NavigatorMobile";

const activeBurger = ref(false)
const categories = ref([])
const {
  scrollingProgress,
  windowHeights,
  throttleScroll
} = useScroll()

async function saveScrollingBook(id) {
  const formData = {bookId: id, bookmark: scrollingProgress.value.progress}
  const result = await updateBookMark(formData)
  if (!result) {
    console.log({'saveScrollingBook': result})
  }
}

async function getCategories() {
  if (categories.value && categories.value.length === 0 && sessionStorage.getItem('lib-token')) {
    categories.value = await loadCategories()
  }
}

getCategories();
window.addEventListener('scroll', throttleScroll, {passive: true})
document.getElementById('aside').classList.replace('hide', 'show')
onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttleScroll, {passive: true})
  document.getElementById('aside').classList.replace('show', 'hide')


})

provide('saveScrollingBook', saveScrollingBook)
</script>

<style lang="scss">
.basement {
}

@media only screen and (min-width: 893px) {
  #header {
    display: none;
  }
}

@media only screen and (max-width: 892px) {
}

@media only screen and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (max-width: 892px) and (orientation: portrait) {

}
</style>