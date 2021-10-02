<template>
  <main class="list-book" @touchstart="touchStart" @touchend="touchEnd">
    <header class="header" v-if="isDesktop">
      <input class="header__block search-input"
             type="search"
             v-model="searchQuery"
             @input.prevent.stop="searchByName"
             placeholder="Search by name...">
      <select class="header__block select select-genre" v-model="filter.genre" @change="changeGenreLoadBook">
        <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
          <option v-for="genre of category.genres"
                  :key="'select-genre'+genre.id"
                  :value="genre">{{ genre.name }}
          </option>
        </optgroup>
      </select>
      <select class="header__block select select-order-by" v-model="orderBy.name" @change="changeSortOrderBy">
        <option v-for="(option, index) of $options.orderByOptions" :value="option" :key="option + index">{{ option }}
        </option>
      </select>
      <button class="btn header__block btn-asc" @click="changeSortAsc">
        <base-icon class="icon" icon-name="sort">
          <icon-sort-asc v-if="orderBy.asc"/>
          <icon-sort-desc v-else/>
        </base-icon>
      </button>
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
import {onBeforeUnmount, ref, toRefs} from 'vue';
import {useRoute} from 'vue-router'
import useDevice from "@/composables/useDevice";
import SortingModal from '@/components/SortingModal.vue'
import TheModal from "@/components/TheModal";
import useBooks from "@/composables/useBooks";
import useBook from "@/composables/useBook";
import useSlideButton from "@/composables/useSlideButton";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'

export default {
  name: "ListBook",
  components: {
    TheModal,
    SortingModal,
    IconSortAsc, IconSortDesc
  },
  props: {
    categories: Array,
  },
  orderByOptions: ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at'],
  setup(props) {
    document.title = 'Books';
    const {categories} = toRefs(props)
    const route = useRoute();
    const {isMobile, isDesktop} = useDevice();
    const {filter, searchQuery, limit, orderBy, books, page, infinityState, getCover, getBooksAndPush} = useBooks();
    const {openBook} = useBook();
    const {showSortingModal, touchStart, touchEnd} = useSlideButton();

    const showTopButton = ref(false);
    const genreId = ref(null);

    const calcGenreById = function (id) {
      let genreArray = []
      for (const cat of categories.value) {
        genreArray.push(...cat.genres)
      }
      const genre = genreArray.find(genre => genre.id === id)
      return genre ? genre : {}
    }
    limit.value = 25;
    const searchByName = () => {
      page.value = 1
      getBooksAndPush()
    };
    const changeGenreLoadBook = () => {
      page.value = 1
      getBooksAndPush()
    };
    if (route.params.id) {
      filter.value.genre = calcGenreById(+route.params.id)
    }

    const updateBySorting = (e) => {
      showSortingModal.value = false
      orderBy.value.name = e.orderBy
      orderBy.value.asc = e.ascending
      page.value = 1
      getBooksAndPush()
    };
    const changeSortAsc = function () {
      orderBy.value.asc = !orderBy.value.asc
      page.value = 1
      getBooksAndPush()
    }
    const changeSortOrderBy = function () {
      page.value = 1
      getBooksAndPush()
    }
    const onScroll = (e) => {
      showTopButton.value = e.target.scrollingElement.scrollTop > 50;
    };
    const scrollToTop = () => {
      document.scrollingElement.scrollTo({top: 0, behavior: "smooth"})
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll, {passive: true})
    })

    return {
      books,
      page,
      filter,
      showTopButton,
      limit,
      infinityState,
      orderBy,
      genreId,
      searchQuery,
      isMobile,
      isDesktop,
      calcGenreById,
      showSortingModal,
      touchStart, touchEnd,
      getBooksAndPush,
      changeSortAsc,
      changeSortOrderBy,
      searchByName,
      changeGenreLoadBook,
      openBook,
      getCover,
      scrollToTop,
      updateBySorting,
      onScroll,
    }
  },
}
</script>

<style scoped lang="scss">
.list-book {
  display: flex;
  flex-flow: row wrap;
  height: calc(100% - 3.5rem);
  padding: 0.5rem 1.5rem;
  align-content: baseline;

  .header {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    max-height: 42px;

    .header__block {
      margin: 0 0.5rem 0 0;
      cursor: pointer;
    }

    .header__block:last-child {
      margin: 0;
    }

    .search-input {
      display: flex;
      flex: 1;
      min-width: 50px;
      //border: 1px solid hsl(var(--brand-hue) 10% 50% / 15%);
      //border: 1px solid;
      border-radius: 5px;
      color: var(--text);
      background-color: var(--surface);
      padding: 5px;
    }

    .select-genre {
      width: 200px;
    }

    .select-order-by {
      width: 125px;
    }

    .btn-asc {
      //width: 75px;
      padding: 0;
    }

    //.select {
    //  display: flex;
    //  flex: 1;
    //}
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
    color: var(--surface-on);
    background: var(--surface);
    box-shadow: 5px 5px 20px #333;


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
    color: var(--text-primary);
    background: var(--primary-light);
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