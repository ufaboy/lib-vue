<template>
  <component :is="typeBook" :book="book" :progress-scroll="progressScroll" :window-heights="windowHeights" @scrolling="scrolling"></component>
</template>

<script>
import {defineAsyncComponent, } from "vue";
import {useRoute} from 'vue-router';
import useBook from "@/composables/useBook";

export default {
  name: "BookView",
  components: {
    BookText: defineAsyncComponent(() => import('@/views/book/BookText.vue')),
    BookMedia: defineAsyncComponent(() => import('@/views/book/BookMedia.vue')),
    BookEmpty: defineAsyncComponent(() => import('@/views/book/BookEmpty.vue'))
  },
  props: {
    categories: Array,
    progressScroll: Number,
    windowHeights: Number,
  },
  setup() {
    const route = useRoute();
    const {book, typeBook, downloadBook} = useBook();
    downloadBook(route.params.id)
    return {
      typeBook,
      book,
    }
  },
  methods: {
    scrolling(e) {
      // let header = document.getElementById('header')
      // if (e === 'down') {
      //   header.classList.add('hide')
      // } else {
      //   header.classList.remove('hide')
      // }
      this.$emit('scrolling', e)
    }
  },
}
</script>

<style lang="scss">

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

@media only screen and (max-width: 892px) {
  //.book-container {
  //  .book {
  //    .text {
  //      max-width: initial;
  //      width: 100%;
  //
  //      .media {
  //        position: static;
  //        width: 100%;
  //        max-height: calc(var(--media-width) / 1.5);
  //      }
  //    }
  //  }
  //
  //  .image-modal {
  //    padding: 0.3rem;
  //    height: 100%;
  //    display: flex;
  //    flex-flow: row nowrap;
  //    justify-content: space-between;
  //    align-items: center;
  //
  //    .close {
  //      top: 0;
  //    }
  //
  //    .picture-action-panel {
  //      height: 100%;
  //      display: flex;
  //      flex-direction: column;
  //      justify-content: space-around;
  //    }
  //
  //    .picture-arrow-btn {
  //      height: 5rem;
  //      width: 5rem;
  //      color: var(--color-2);
  //      background-color: var(--background-3);
  //    }
  //
  //    .modal-content {
  //      height: 100%;
  //      object-fit: cover;
  //    }
  //  }
  //}
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {

}
</style>