<template>
  <main class="flex flex-row flex-wrap" @touchstart="touchStart" @touchend="touchEnd">
    <router-link :to="{ name: 'book-view', params: {id: book.id}}"
                 class="h-fit overflow-hidden w-80 flex flex-row flex-nowrap justify-between
                 drop-shadow-md cursor-pointer rounded-md m-2 p-2 lg:mr-4 lg:mb-4 lg:p-2 lg:p-4
                 bg-sky-200 hover:bg-sky-400
                 dark:bg-slate-800 hover:dark:bg-slate-700"
                 v-for="book of books.items"
                 :key="'book'+book.id">
      <img v-if="book.cover_path" :src="getCover(book)" alt="cover"
           class="shrink-0 rounded-md mr-2 object-cover w-[100px] h-[100px]" width="100" height="100"
           onerror="this.onerror=null;this.src = '/icons/svg/book-dead-solid.svg'">
      <IconBook class="mr-2 shrink-0 rounded-md w-[100px] h-[100px]" v-else/>
      <div class="h-[110px] w-[calc(100%_-_150px)]">
        <div class="font-bold truncate">{{ book.name }}</div>
        <div class="book-annotation">{{ book.annotation }}</div>
      </div>
      <StarRating class="flex-col-reverse ml-1" :hide-inactive="true" v-model="book.rating" :size="18"/>
    </router-link>
    <p v-if="!books.items.length" class="w-full text-xl text-center">Nothing found</p>
    <observer @intersect="getBooksAndPush('push')"/>
    <button class="fixed bottom-5 right-5 rounded-lg shadow bg-yellow-300/75 dark:bg-neutral-300/50 p-2" v-show="topButtonShow" title="Go to top" @click="scrollToTop">Top</button>
    <dialog ref="filterDialog"
            class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-72"
            @close="closeDialog">
      <FilterModal :categories="categories"
                   :query-data="queryData"
                   v-if="filterDialogShow"
                   @active-filter="filterHandler"
                   @reset-filter="filterResetHandler"
                   @hide-modal="closeDialog" />
    </dialog>
  </main>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, watch} from 'vue';
import {useRoute} from 'vue-router'
import useBooks from "../../composables/useBooks";
import useSwipe from "../../composables/useSwipe";
import {QueryData} from "../../interfaces/book";
import {isMobile} from "../../utils/helpers";
import StarRating from "../../components/StarRating.vue";
import IconBook from "../../components/icons/IconBook.vue";
import FilterModal from "../../components/modals/FilterModal.vue";

interface Category {
  id: number,
  name: string,
  genres: Array<Genre>
}
interface Genre {
  [key: string]: number | string | Category | boolean

  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}
interface CategoryExtended extends Category {
  genres: Array<Genre>
}

const props = defineProps<{
  categories: CategoryExtended[]
}>()
document.title = 'Books';
const orderByOptions = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at']
const route = useRoute();
const { queryData, books, getCover, loadQuery, saveQuery, getBooksAndPush, getBooksAndReplace } = useBooks();
const { slideLeftRight, touchStart, touchEnd } = useSwipe();
const topButtonShow = ref(false);
const filterDialog = ref<InstanceType<typeof HTMLDialogElement>>()
const filterDialogShow = ref(false)

queryData.value.limit = isMobile() ? 10 : 25;

function calcGenreById(id: number) {
  let genreArray = []
  for (const cat of props.categories) {
    genreArray.push(...cat.genres)
  }
  // console.log('calcGenreById', id, genreArray)
  return genreArray.find(genre => genre.id === id)
/*  const genreArray = props.categories.flat(2)
  console.log('calcGenreById', {genreArray:genreArray})
  return genreArray.find(genre => genre.id === id)*/
}
function closeDialog() {
  slideLeftRight.value = false
  filterDialogShow.value = false
  if(filterDialog.value) filterDialog.value.close()
}
function filterHandler(eventData:QueryData) {
  queryData.value = eventData
  saveQuery()
  getBooksAndReplace()
}
function filterResetHandler() {
  queryData.value.rating = undefined
  queryData.value.ad = undefined
  queryData.value.orderBy = 'updated_at'
  queryData.value.searchQuery = undefined
  queryData.value.ascending = true
  queryData.value.genre = undefined
  getBooksAndReplace()
}
function onScroll(event: Event) {
  if (event.target instanceof Document) {
    topButtonShow.value = event.target.scrollingElement!.scrollTop > 50;
  }
}
function scrollToTop() {
  document.scrollingElement!.scrollTo({top: 0, behavior: "smooth"})
}

watch(() => props.categories, () => {
  const genre = calcGenreById(+route.params.id)
  // console.log('watch categories', props.categories, genre)
  if (genre) {
    queryData.value.genre = genre
  }
})
watch(slideLeftRight, newValue => {
  if (newValue) {
    filterDialogShow.value = newValue
    filterDialog.value?.showModal()
  }
})

loadQuery();
if (calcGenreById(+route.params.id)) {
  queryData.value.genre = calcGenreById(+route.params.id)
}
window.addEventListener('scroll', onScroll, {passive: true});
onBeforeUnmount(() => {
  // @ts-expect-error
  window.removeEventListener('scroll', onScroll, {passive: true})
})
</script>