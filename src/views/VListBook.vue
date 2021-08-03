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
    <modal ref="sortings">
      <sorting-modal @sorting="updateBySorting"/>
    </modal>
    <button class="scroll-btn" ref="topBtn" title="Go to top" @click="scrollToTop">Top</button>
  </main>
</template>

<script>
import SortingModal from '@/components/SortingModal.vue'
import {loadBooks} from "../utils/loadData";

export default {
  name: "ListBook",
  components: {
    SortingModal
  },
  props: {},
  data: () => ({
    books: {
      items: [],
      _links: {},
      _meta: {}
    },
    genreId: null,
    searchParams: null,
    infinityState: true,
    infinityLoading: false,
    orderBy: 'updated_at',
    limit: 25,
    page: 1,
    ascending: 0,
    startPos: {x: 0, y: 0},
    endPos: {x: 0, y: 0},
  }),
  computed: {
    isMobile() {
      return this.$store.state.main.isMobile
    },
    categories() {
      return this.$store.state.genre.categories
    },
    activeGenre: {
      get: function () {
        const category = this.categories.find(category => category.genres.some(genre => genre.id === +this.genreId))
        return category ? category.genres.find(genre => genre.id === this.genreId) : null
      },
      set: function (newValue) {
        this.genreId = newValue.id
      }
    }
  },
  watch: {
  },
  created() {
    document.title = 'Books';
    if (this.$route.params.id) {
      this.genreId = +this.$route.params.id
    }
  },
  mounted() {
  },
  methods: {
    async searchByName() {
      this.page = 1
      this.getBooksAndPush()
    },

    async getBooksAndPush(method = null) {
      let filter = {}
      let genreId = null
      if (this.activeGenre) {
        genreId = this.activeGenre.id
      } else if (this.$route.params.id) {
        genreId = this.$route.params.id
      }
      if (genreId === null) {
        return false
      } else {
        filter.genre = genreId
      }
      if (!this.infinityState && method) {
        return false
      } else if (method === null) {
        this.infinityState = true
      }

      if (this.searchParams) {
        filter.name += `&name=${this.searchParams}`
      }
      this.infinityLoading = true
      this.$loader.show()
      const result = await loadBooks(this.page, this.limit, `${this.ascending ? '' : '-'}${this.orderBy}`, filter);
      this.$loader.hide()
      this.infinityLoading = false
      if (result) {
        if (method === 'push') {
          this.books.items.push(...result.items)
          this.page = ++this.page
        } else {
          this.books.items.length = 0
          this.books.items.push(...result.items)
          this.page = ++this.page
        }
        if (result.items.length < this.limit) {
          this.infinityState = false
        }

      }
    },
    async changeGenre() {
      this.page = 1
      this.getBooksAndPush()
    },
    async openBook(book) {
      await this.$router.push({name: 'book-view', params: {id: book.id}})
    },
    getCover(book) {
      if (book.cover_path) {
        return `${process.env.VUE_APP_API_URL}/${book.cover_path}`
      } else return '/img/book-dead-solid.svg'
    },

    touchStart(e) {
      this.startPos = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
      this.endPos = {x: 0, y: 0}
    },
    touchEnd(e) {
      this.endPos = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
      let difX = this.endPos.x - this.startPos.x
      let difY = this.startPos.y - this.endPos.y
      if (difX > 100 && difY < 50) this.$modal.show('sortings', this)
    },
    async updateBySorting(e) {
      this.orderBy = e.orderBy
      this.ascending = e.ascending
      this.page = 1
      this.getBooksAndPush()
    },
    onScroll() {
      // if (!this.infinityState) {
      //   return false
      // }
      // const windowHeights = e.target.scrollHeight -  e.target.clientHeight
      // const scroll = this.$el.scrollTop
      // if (scroll > 20) {
      //   this.$refs.topBtn.style.display = "block";
      // } else {
      //   this.$refs.topBtn.style.display = "none";
      // }
      // if (windowHeights > 0 && (scroll === windowHeights)) {
      //   this.page = ++this.page
      //   this.loadAndPush()
      // }
    },
    // loadAndPush() {
    //   this.loadBooks('push')
    // },
    scrollToTop() {
      this.$el.scrollTop = 0
    },
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