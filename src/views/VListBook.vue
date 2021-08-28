<template>
  <main class="list-book" @touchstart="touchStart" @touchend="touchEnd" @scroll.passive="onScroll">
    <header class="header">
      <input class="search-input"
             type="search"
             v-model="searchParams"
             @input.prevent.stop="searchByName"
             placeholder="Search by name...">
      <select class="select" v-model="activeGenre" @change="changeGenre" v-if="isMobile">
        <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
          <option v-for="genre of category.genres"
                  :key="'select-genre'+genre.id"
                  :value="genre">{{ genre.name }}
          </option>
        </optgroup>
      </select>
    </header>
    <section class="book" v-for="book of books.items" @click="openBook(book)" :key="'book'+book.id">
      <img :src="getCover(book)" alt="" class="book-cover">
      <div class="book-text-wrap">
        <div class="book-name">{{ book.name }}</div>
        <div class="book-annotation">{{ book.annotation }}</div>
      </div>
    </section>
    <observer @intersect="getBooksAndPush('push')"/>
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
    <the-modal v-if="showSortingModal" @hide-modal="showSortingModal = false">
      <sorting-modal @sorting="updateBySorting"/>
    </the-modal>

    <button class="scroll-btn" v-show="showTopButton" title="Go to top" @click="scrollToTop">Top</button>
  </main>
</template>

<script>
import {reactive, computed, ref, inject} from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex';
import SortingModal from '@/components/SortingModal.vue'
import {loadBooks} from "@/utils/loadData";
import TheModal from "@/components/TheModal";

export default {
  name: "ListBook",
  components: {
    TheModal,
    SortingModal
  },
  setup() {
    document.title = 'Books';
    const loader = inject("loader");
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const books = reactive({
      items: [],
      _links: {},
      _meta: {},
    });
    const showSortingModal = ref(false);
    const showTopButton = ref(false);
    const genreId = ref(null);
    const searchParams = ref('');
    const page = ref(1);
    const limit = ref(25);
    const ascending = ref(0);
    const orderBy = reactive({name: 'updated_at', asc: false});
    const startPos = reactive({x: 0, y: 0});
    const endPos = reactive({x: 0, y: 0});
    if (route.params.id) {
      genreId.value = +route.params.id
    }
    const infinityState = ref(true);
    const infinityLoading = ref(false);

    const isMobile = computed(() => store.state.main.isMobile);
    const categories = computed(() => store.state.genre.categories);
    const activeGenre = computed(() => ({
      get() {
        const category = categories.value.find(category => category.genres.some(genre => genre.id === +genreId.value))
        return category ? category.genres.find(genre => genre.id === genreId.value) : null
      },
      set(newValue) {
        genreId.value = newValue.id
      }
    }))

    const getBooksAndPush = async (method = '') => {
      let filter = {}
      let genreIdForm = null
      if (activeGenre.value) {
        genreIdForm = activeGenre.value.id
      } else if (route.params.id) {
        genreIdForm = route.params.id
      }
      if (genreIdForm === null) {
        return false
      } else {
        filter.genre = genreIdForm
      }
      if (!infinityState.value && method) {
        return false
      } else if (method === null) {
        infinityState.value = true
      }

      if (searchParams.value) {
        filter.name += `&name=${searchParams.value}`
      }
      infinityLoading.value = true;
      loader.show();
      const result = await loadBooks(page.value, limit.value, `${ascending.value ? '' : '-'}${orderBy.value}`, filter);
      loader.hide();
      infinityLoading.value = false;
      if (result) {
        if (method === 'push') {
          books.items.push(...result.items)
          page.value = ++page.value
        } else {
          books.items.length = 0
          books.items.push(...result.items)
          page.value = ++page.value
        }
        if (result.items.length < limit.value) {
          infinityState.value = false
        }
      }
    };
    const searchByName = () => {
      page.value = 1
      getBooksAndPush()
    };
    const changeGenre = () => {
      page.value = 1
      getBooksAndPush()
    };
    const openBook = (book) => {
      router.push({name: 'book-view', params: {id: book.id}})
    };
    const getCover = (book) => {
      if (book.cover_path) {
        return `${process.env.VUE_APP_API_URL}/${book.cover_path}`
      } else return '/img/book-dead-solid.svg'
    };

    const touchStart = (e) => {
      startPos.value = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
      endPos.value = {x: 0, y: 0}
    };
    const touchEnd = (e) => {
      endPos.value = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
      let difX = endPos.value.x - startPos.value.x
      let difY = startPos.value.y - endPos.value.y
      if (difX > 100 && difY < 50) showSortingModal.value = true
    };
    const updateBySorting = (e) => {
      console.log({updateBySorting: e})
      showSortingModal.value = false
      orderBy.value = e.orderBy
      ascending.value = e.ascending
      page.value = 1
      getBooksAndPush()
    };
    const onScroll = (e) => {
      showTopButton.value = e.target.scrollTop > 50;
    };
    const scrollToTop = () => {
      window.scrollTo(0,0);
    }

    return {
      books,
      page,
      showSortingModal,
      showTopButton,
      limit,
      ascending,
      infinityState,
      infinityLoading,
      orderBy,
      genreId,
      searchParams,
      startPos,
      endPos,
      isMobile,
      categories,
      activeGenre,
      getBooksAndPush,
      searchByName,
      changeGenre,
      openBook,
      getCover,
      touchStart,
      touchEnd,
      updateBySorting,
      onScroll,
      scrollToTop,
    }
  },
}
</script>

<style scoped lang="scss">
.list-book {
  display: flex;
  flex-flow: row wrap;
  height: calc(100% - 3.5rem);
  overflow-y: auto;
  padding: 1rem;
  align-content: baseline;

  .header {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    max-height: 42px;

    .search-input {
      display: flex;
      flex: 1;
      border: 1px solid hsl(var(--brand-hue) 10% 50% / 15%);
      color: var(--text1);
      background-color: var(--surface3);
      padding: 5px;
    }

    .select {
      display: flex;
      flex: 1;
      margin-left: 0.5rem;
    }
  }

  .book {
    display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
    width: 450px;
    height: fit-content;
    overflow: hidden;
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 1rem;
    background: rgba(100, 100, 100, 0.5);


    .book-text-wrap {
      max-height: 100px;
      width: calc(100% - 115px);
    }

    .book-name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: bold;
    }

    .book-cover {
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-right: 1rem;
      filter: blur(10);
    }

    .book-cover.clear-view {
      filter: none;
    }

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
  }

  .book:hover {
    background: rgba(100, 100, 100, 0.8);
  }

  .loader {
    position: fixed;
    bottom: 0;
    left: 50%;
    border: 0.5rem solid var(--color-p); /* Light grey */
    border-top: 0.5rem solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }


}

@media only screen and (max-width: 892px) {
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

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .list-book {
  }
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .list-book {
    .header {
      .search-input {
        width: inherit;
      }

      .select {
        width: inherit;
      }
    }
  }
}
</style>