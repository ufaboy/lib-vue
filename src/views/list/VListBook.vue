<template>
  <main ref="listBook" class="list-book pt-4 flex flex-row flex-wrap" @touchstart="touchStart" @touchend="touchEnd">
    <router-link :to="{ name: 'book-view', params: {id: book.id}}"
                 class="h-fit overflow-hidden w-80  flex flex-row flex-nowrap justify-between
                 drop-shadow-md cursor-pointer rounded-md m-2 p-2 lg:mr-4 lg:mb-4 lg:p-2 lg:p-4
                 dark:bg-slate-800 hover:dark:bg-slate-700"
                 v-for="book of books.items"
                 :key="'book'+book.id">
      <img v-if="book.cover_path" :src="getCover(book)" alt="cover" class="shrink-0 rounded-md mr-2" width="100" height="100"
           onerror="this.onerror=null;this.src = '/icons/svg/book-dead-solid.svg'">
      <IconBook class="mr-2 shrink-0 rounded-md w-[100px] h-[100px]" v-else/>
      <div class="h-[110px] w-[calc(100%_-_150px)]">
        <div class="font-bold truncate">{{ book.name }}</div>
        <div class="book-annotation">{{ book.annotation }}</div>
      </div>
      <StarRating class="flex-col-reverse ml-1" :hide-inactive="true" v-model="book.rating" :size="18"/>
    </router-link>
    <observer @intersect="getBooksAndPush('push')"/>
    <button class="scroll-btn" v-show="topButtonShow" title="Go to top" @click="scrollToTop">Top</button>
    <dialog ref="sortingModal" class="dialog dark:bg-slate-800 rounded-lg w-72" @close="slideLeftRight = false">
      <SortingModal v-if="slideLeftRight" @hide-modal="slideLeftRight = false" />
    </dialog>
  </main>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, watch} from 'vue';
import {useRoute} from 'vue-router'
import useBooks from "../../composables/useBooks";
import useSwipe from "../../composables/useSwipe";
import {isMobile} from "../../utils/helpers";
import StarRating from "../../components/StarRating.vue";
import IconBook from "../../components/icons/IconBook.vue";
import SortingModal from "../../components/SortingModal.vue";

document.title = 'Books';
const orderByOptions = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at']

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
const route = useRoute();
const {
  queryData,
  books,
  getCover,
  loadOrderBy,
  saveOrderBy,
  getBooksAndPush,
  debounceGetBooksAndReplace
} = useBooks();
const {slideLeftRight, touchStart, touchEnd} = useSwipe();
const listBook = ref<HTMLElement | null>(null)
const topButtonShow = ref(false);

function calcGenreById(id: number) {
  let genreArray = []
  for (const cat of props.categories) {
    genreArray.push(...cat.genres)
  }
  return genreArray.find(genre => genre.id === id)
}

queryData.value.limit = 25;

function searchByName() {
  queryData.value.page = 1
  debounceGetBooksAndReplace()
}

function changeGenreLoadBook() {
  queryData.value.page = 1
  debounceGetBooksAndReplace()
}

watch(props, () => {
  const x = calcGenreById(+route.params.id)
  if (x && queryData.value.genre) {
    queryData.value.genre.id = x.id
  }
})

function changeSortAsc() {
  queryData.value.orderBy.asc = !queryData.value.orderBy.asc
  queryData.value.page = 1
  getBooksAndPush()
}

function changeSortOrderBy() {
  queryData.value.page = 1
  saveOrderBy()
  getBooksAndPush()
}

function onScroll(event: Event) {
  if (event.target instanceof Document) {
    topButtonShow.value = event.target.scrollingElement!.scrollTop > 50;
  }
}

function scrollToTop() {
  document.scrollingElement!.scrollTo({top: 0, behavior: "smooth"})
}

loadOrderBy();
if (calcGenreById(+route.params.id)) {
  queryData.value.genre = calcGenreById(+route.params.id)
}
window.addEventListener('scroll', onScroll, {passive: true});
onBeforeUnmount(() => {
  // @ts-expect-error
  window.removeEventListener('scroll', onScroll, {passive: true})
})
</script>

<style lang="scss">
.list-book {
  .book-annotation {
    display: block;
    display: -webkit-box;
    max-width: 100%;
    margin: 0 auto;
    line-height: 1;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .book {
    //box-shadow: 5px 5px 20px #333;
    text-decoration: none;



    .book-cover {
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-right: 1rem;
      border-radius: 5px;
      filter: blur(10);
    }

    .book-cover.clear-view {
      filter: none;
    }




  }
}

/*@media only screen and (max-width: 892px) {
  .sidebar {
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .sidebar-input {
      width: 100%;
    }

    .sidebar-btn {
      width: 40%;
      margin: 0;
    }

    .btn-icon {
      width: auto;
      padding: 5px;
    }
  }
  .list-book {
    padding: 0.5rem;
    columns: 400px;

    .book {
      width: 100%;
      margin-bottom: 0.5rem;
      margin-right: 0;
      padding: 0.5rem;
    }

  }
}

@media only screen and (max-width: 892px) and (orientation: landscape) {}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .list-book {
    .header {
      background-color: var(--surface);
      display: grid;
      grid-template-areas: "select-genre select-order-by btn-icon"
                            "search-input search-input search-input";
      position: sticky;
      top: 0;

      .search-input {
        grid-area: search-input;
        margin: 0.5rem 0 0 0;
      }

      .select-genre {
        grid-area: select-genre;
        width: 47vw;
      }

      .select-order-by {
        grid-area: select-order-by;
        width: 37vw;
      }

      .btn-icon {
        grid-area: btn-icon;
      }

      .select {
        width: inherit;
      }
    }
  }
}*/
</style>