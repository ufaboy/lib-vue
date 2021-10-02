<template>
  <router-view></router-view>
  <teleport to="body">
    <refresh-popup v-if="updateAvailable" :sw-reg="registration" @refresh-sw="refreshApp"/>
  </teleport>
</template>

<script>
import RefreshPopup from "@/components/RefreshPopup";
import {ref} from "vue";
export default {
  components: {RefreshPopup},
  setup() {
    const registration = ref(null);
    const updateAvailable = ref(false);
    const swUpdate = function (event) {
      updateAvailable.value = true
      registration.value = event.detail
    }
    const refreshApp = function () {
      updateAvailable.value = false;
      if (!registration.value || !registration.value.waiting) return null;
      registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
    }

    document.addEventListener('swUpdated', swUpdate, {once: true})

    return { registration, updateAvailable, swUpdate, refreshApp}
  },
  data() {
    return {
      parent: null,
      book: null,
      genre: null
    }
  },
  computed: {
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
    },
  },
  created() {
    // window.addEventListener('resize', this.onResize);
  },
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
