<template>
  <main class="list-book" @touchstart="touchStart" @touchend="touchEnd">
    <teleport to="#aside" :disabled="isMobile">
      <section class="sidebar">
        <input class="sidebar-input mb-half"
               type="search"
               v-model="searchQuery"
               @input.prevent.stop="searchByName"
               placeholder="Search ...">
        <select class="sidebar-btn form-field__select mb-half" v-model="filter.genre"
                @change="changeGenreLoadBook">
          <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
            <option v-for="genre of category.genres"
                    :key="'select-genre'+genre.id"
                    :value="genre">{{ genre.name }}
            </option>
          </optgroup>
        </select>
        <select class="sidebar-btn form-field__select mb-half" v-model="orderBy.name"
                @change="changeSortOrderBy">
          <option v-for="(option, index) of orderByOptions" :value="option" :key="option + index">{{ option }}
          </option>
        </select>
        <button class="btn btn-icon sidebar-btn" @click="changeSortAsc">
          <IconSortAsc class="icon" v-if="orderBy.asc"/>
          <IconSortDesc class="icon" v-else/>
        </button>
      </section>
    </teleport>

    <router-link :to="{ name: 'book-view', params: {id: book.id}}" class="book" v-for="book of books.items"
                 :key="'book'+book.id">
      <img :src="getCover(book)" alt="cover" class="book-cover" onerror="this.src = '/img/book-dead-solid.svg'">
      <div class="book-text-wrap">
        <div class="book-name">{{ book.name }}</div>
        <div class="book-annotation">{{ book.annotation }}</div>
      </div>
    </router-link>
    <observer @intersect="getBooksAndPush('push')"/>
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
    <TheModal v-if="slideLeftRight">
      <SortingModal @sorting="updateBySorting" @hide-modal="slideLeftRight = false"/>
    </TheModal>
    <button class="scroll-btn" v-show="showTopButton" title="Go to top" @click="scrollToTop">Top</button>
  </main>
</template>

<script setup>
import {onBeforeUnmount, ref, watch} from 'vue';
import {useRoute} from 'vue-router'
import SortingModal from '@/components/SortingModal.vue'
import TheModal from "@/components/TheModal";
import useBooks from "@/composables/useBooks";
import useSlideButton from "@/composables/useSlideButton";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import useDevice from "../composables/useDevice";

document.title = 'Books';
const orderByOptions = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at']
// eslint-disable-next-line no-undef
const props = defineProps({
  categories: Array,
})
const route = useRoute();
const {isMobile} = useDevice();
const {filter, searchQuery, limit, orderBy,  books, page, getCover, loadOrderBy, saveOrderBy, getBooksAndPush} = useBooks();
const {slideLeftRight, touchStart, touchEnd} = useSlideButton();
const showTopButton = ref(false);

function calcGenreById(id) {

  let genreArray = []
  for (const cat of props.categories) {
    genreArray.push(...cat.genres)
  }
  const genre = genreArray.find(genre => genre.id === id)
  return genre ? genre : {}
}

limit.value = 25;

function searchByName() {
  page.value = 1
  getBooksAndPush()
}

function changeGenreLoadBook() {
  page.value = 1
  getBooksAndPush()
}

watch(props, () => {
  filter.value.genre = calcGenreById(+route.params.id)
})

function updateBySorting(e) {
  slideLeftRight.value = false
  orderBy.value.name = e.orderBy
  orderBy.value.asc = e.ascending
  page.value = 1
  saveOrderBy()
  getBooksAndPush()
}

function changeSortAsc() {
  orderBy.value.asc = !orderBy.value.asc
  page.value = 1
  getBooksAndPush()
}

function changeSortOrderBy() {
  page.value = 1
  saveOrderBy()
  getBooksAndPush()
}

function onScroll(e) {
  showTopButton.value = e.target.scrollingElement.scrollTop > 50;
}

function scrollToTop() {
  document.scrollingElement.scrollTo({top: 0, behavior: "smooth"})
}
loadOrderBy();
filter.value.genre = calcGenreById(+route.params.id)
window.addEventListener('scroll', onScroll, {passive: true});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll, {passive: true})
})
</script>

<style lang="scss">
.list-book {
  display: flex;
  flex-flow: row wrap;
  height: calc(100% - 3.5rem);
  padding: 0.5rem 1.5rem;
  align-content: baseline;

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
    text-decoration: none;

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
}

@media only screen and (max-width: 892px) {
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

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .list-book {
  }
}

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
}
</style>