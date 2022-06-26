<template>
  <main
    class="layout bg-white h-full lg:dark:bg-slate-900 sm:dark:bg-neutral-900 text-slate-900 dark:text-white"
    @click="activeBurger = false">
    <HeaderMobile v-if="isMobile()" :categories="categories" />
    <Sidebar
      v-else
      :categories="categories"
      @search-input="searchInputHandler" />
    <router-view
      class="overflow-y-auto bg-inherit text-inherit
      lg:w-[calc(100%_-_10rem)] lg:left-40 lg:absolute lg:left-[10rem]"
      v-bind="$attrs"
      :categories="categories"
      :scrolling-progress="scrollingProgress"
      :window-heights="windowHeights"
    />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, provide, ref, watch } from "vue";
import { isMobile } from "../utils/helpers";
import { loadCategories } from "../utils/loadData";
import useScroll from "../composables/useScroll";
import { updateBookMark } from "../utils/uploadData";
import { CategoryExtended } from "../interfaces/category";
import { BookScrolling } from "../interfaces/book";
import HeaderMobile from "../components/HeaderMobile.vue";
import Sidebar from "../components/sidebars/Sidebar.vue";

const activeBurger = ref(false);
const categories = ref<CategoryExtended[]>([]);
const { scrollingProgress, windowHeights, throttleScroll } = useScroll();

function searchInputHandler(event: string) {
  console.log("searchInputHandler", event);
}

async function saveScrollingBook(id: number): Promise<void> {
  const formData: BookScrolling = {
    bookId: id,
    bookmark: scrollingProgress.value.progress,
  };
  const result = await updateBookMark(formData);
  if (!result) {
    console.log({ saveScrollingBook: result });
  }
}

async function getCategories() {
  if (
    categories.value &&
    categories.value.length === 0 &&
    sessionStorage.getItem("lib-token")
  ) {
    categories.value = await loadCategories();
  }
}

window.addEventListener("scroll", throttleScroll, { passive: true });
onBeforeUnmount(() => {
  // @ts-expect-error
  window.removeEventListener("scroll", throttleScroll, { passive: true });
});

provide("saveScrollingBook", saveScrollingBook);
getCategories();
</script>
