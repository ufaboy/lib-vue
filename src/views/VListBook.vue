<template>
  <main class="list-book" @touchstart="touchStart" @touchend="touchEnd" @scroll.passive="onScroll">
    <header class="header">
      <input class="search-input"
             type="search"
             v-model="searchField"
             @input.prevent.stop="searchByName"
             placeholder="Search by name...">
      <select class="select" v-model="activeGenre" @change="changeGenreLoadBook" v-if="isMobile">
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
import {ref, toRefs} from 'vue';
import {useRoute} from 'vue-router'
import useDevice from "@/composables/useDevice";
import SortingModal from '@/components/SortingModal.vue'
import TheModal from "@/components/TheModal";
import useBooks from "@/composables/useBooks";
import useBook from "@/composables/useBook";
import useSlideButton from "@/composables/useSlideButton";

export default {
  name: "ListBook",
  components: {
    TheModal,
    SortingModal
  },
  props: {
    categories: Array,
  },
  setup(props) {
    document.title = 'Books';
    const {categories} = toRefs(props)
    const {isMobile} = useDevice();
    const route = useRoute();
    const {filter, searchField, limit, orderBy, books, page, infinityState, getCover, getBooksAndPush} = useBooks();
    const {openBook} = useBook();
    const {showSortingModal, touchStart, touchEnd} = useSlideButton();

    const showTopButton = ref(false);
    const genreId = ref(null);

    const activeGenre = ref({})
    if (route.params.id) {
      genreId.value = +route.params.id
    }

    if (activeGenre.value.id) {
      filter.value.genre = activeGenre.value.id
    } else if (route.params.id) {
      filter.value.genre = Number(route.params.id)
    }
    if (route.params.id) {
      const category = categories.value.find(category => category.genres.some(genre => genre.id === +genreId.value))
      activeGenre.value = category ? category.genres.find(genre => genre.id === genreId.value) : {}
    }
    limit.value = 25;
    const searchByName = () => {
      page.value = 1
      getBooksAndPush()
    };
    const changeGenreLoadBook = () => {
      filter.value.genre = activeGenre.value.id
      page.value = 1
      getBooksAndPush()
    };


    const updateBySorting = (e) => {
      showSortingModal.value = false
      orderBy.value.name = e.orderBy
      orderBy.value.asc = e.ascending
      page.value = 1
      getBooksAndPush()
    };
    const onScroll = (e) => {
      showTopButton.value = e.target.scrollTop > 50;
    };

    return {
      books,
      page,
      showTopButton,
      limit,
      infinityState,
      orderBy,
      genreId,
      searchField,
      isMobile,
      activeGenre,
      showSortingModal,
      touchStart, touchEnd,
      getBooksAndPush,
      searchByName,
      changeGenreLoadBook,
      openBook,
      getCover,
      updateBySorting,
      onScroll,
    }
  },
  methods: {
    scrollToTop() {
      this.$el.scrollTop = 0
    }
  }
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
    border-radius: 5px;
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