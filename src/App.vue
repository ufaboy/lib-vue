<template>
  <component
      :is="layout"
      @resize="onResize"
      :parent-props="parentData"
      :genre-props="genreData"
      :book-name="bookName">
    <router-view
        @loaded-parent="loadedParent"
        @loaded-book="loadedBook"
        @loaded-genre="loadedGenre"
        :book-props="book"
        v-bind="$attrs"
        v-slot="{ Component }">
      <transition name="component-fade" mode="out-in" appear>
        <component :is="Component"/>
      </transition>
    </router-view>
  </component>
</template>

<script>
import LayoutDefault from "@/layouts/LayoutDefault";
import {defineAsyncComponent} from "vue";

export default {
  components: {
    LayoutDefault,
    LayoutAuth: defineAsyncComponent(() => import('@/layouts/LayoutAuth.vue')),
    LayoutTest: defineAsyncComponent(() => import('@/layouts/LayoutTest.vue')),
    LayoutError: defineAsyncComponent(() => import('@/layouts/LayoutError.vue'))
  },
  data: () => ({
    parent: null,
    book: null,
    genre: null
  }),
  computed: {
    layout() {
      return this.$route.meta.layout || 'layout-default'
    },
    parentData() {
      if (['list-genre', 'list-book', 'book-view'].includes(this.$route.name)) {
        return this.parent ? {name: this.parent.name, id: this.parent.id} : null
      }
      return null
    },
    genreData() {
      if (['list-book', 'book-view'].includes(this.$route.name)) {
        return this.genre ? {id: this.genre.id, name: this.genre.name} : null
      }
      return null
    },
    bookName() {
      return this.$route.name === 'book-view' ? this.book : null
    }

  },
  methods: {
    onResize() {
      if (document.documentElement.clientWidth > 892) {
        this.$store.commit('main/setIsDesktop')
      } else {
        this.$store.commit('main/setIsMobile')
      }
    },
    loadedParent(parent) {
      this.parent = parent
    },
    loadedGenre(genre) {
      this.genre = genre
      this.parent = genre.parent
    },
    loadedBook(book) {
      this.book = book.name
      this.genre = book.genre
      this.parent = book.genre.parent
    }
  },
  created() {
    this.onResize()
    // window.addEventListener('resize', this.onResize);
  }
}
</script>
<style>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>
