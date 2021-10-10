<template>
  <component :is="typeBook === 'BookText' ? BookText : typeBook === 'BookMedia' ? BookMedia : BookEmpty" :book="book" :progress-scroll="progressScroll" :window-heights="windowHeights"
             @scrolling="scrolling"></component>
</template>

<script setup>
// import {defineAsyncComponent,} from "vue";
import {useRoute} from 'vue-router';
import useBook from "@/composables/useBook";
import BookText from "@/views/book/BookText.vue";
import BookMedia from "@/views/book/BookMedia.vue";
import BookEmpty from "@/views/book/BookEmpty.vue";

// let BookText = defineAsyncComponent(() => import('@/views/book/BookText.vue'))
// let BookMedia = defineAsyncComponent(() => import('@/views/book/BookMedia.vue'))
// let BookEmpty = defineAsyncComponent(() => import('@/views/book/BookEmpty.vue'))
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
  progressScroll: Number,
  windowHeights: Number,
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['scrolling'])
const route = useRoute();

const {book, typeBook, downloadBook} = useBook();
downloadBook(route.params.id)

function scrolling(e) {
  emit('scrolling', e)
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