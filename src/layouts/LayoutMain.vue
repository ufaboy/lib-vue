<template>
  <main
    class="layout-main min-h-screen bg-white lg:dark:bg-slate-900 md:dark:bg-neutral-900 text-slate-900 dark:text-white"
    @click="activeBurger = false"
  >
    <HeaderMobile v-if="isMobile()" :categories="categories" />
    <Sidebar
      v-else
      :categories="categories"
      @search-input="searchInputHandler"
      @load-data=""
    >
      <ul v-if="route.name === 'genre-index'">
        <li>
          <button class="sidebar-btn btn-outline" @click="createGenre">create</button>
        </li>
      </ul>
    </Sidebar>
    <router-view
      class="page overflow-x-hidden overflow-y-auto bg-white dark:bg-slate-900"
      v-bind="$attrs"
      :categories="categories"
      :scrolling-progress="scrollingProgress"
      :book="book"
      :typeBook="typeBook"
      :window-heights="windowHeights"
    />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, provide, ref, watch } from "vue";
import { isMobile } from "../utils/helpers";
import { loadCategories } from "../utils/loadData";
import useScroll from "../composables/useScroll";
import useGenres from "../composables/useGenres";
import { updateBookMark } from "../utils/uploadData";
import { CategoryExtended } from "../interfaces/category";
import { BookScrolling } from "../interfaces/book";
import HeaderMobile from "../components/HeaderMobile.vue";
import Sidebar from "../components/Sidebar.vue";
import useBook from "../composables/useBook";
import { useRoute } from "vue-router";

const route = useRoute();
const activeBurger = ref(false);
const categories = ref<CategoryExtended[]>([]);
const { rawText, book, typeBook, downloadBook } = useBook();
const { createGenre } = useGenres();
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

getCategories();
watch(route, (newValue, oldValue) => {
  if (newValue.name === "book-view") {
    console.log("watch downloadBook", {
      newValue: newValue.params.id,
      oldValue: oldValue.params.id,
    });
    downloadBook(+route.params.id);
  }
});
if (route.name === "book-view") {
  downloadBook(+route.params.id);
}

window.addEventListener("scroll", throttleScroll, { passive: true });
onBeforeUnmount(() => {
  // @ts-expect-error
  window.removeEventListener("scroll", throttleScroll, { passive: true });
});

provide("saveScrollingBook", saveScrollingBook);
</script>

<style lang="scss">
.layout-main {
}

@media only screen and (min-width: 893px) {
  .page {
    width: calc(100% - 10rem);
    position: absolute;
    left: 10rem;
  }
}

@media only screen and (max-width: 892px) {
}

@media only screen and (max-width: 892px) and (orientation: landscape) {
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
}
</style>
