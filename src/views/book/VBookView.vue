<template>
  <component :is="typeBook === 'BookText' ? BookText : typeBook === 'BookMedia' ? BookMedia : BookEmpty" :book="book"
             :scrolling-progress="scrollingProgress"
             :window-heights="windowHeights"
             @scrolling="scrolling"></component>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router';
import useBook from "../../composables/useBook";
import BookText from "@/views/book/BookText.vue";
import BookMedia from "@/views/book/BookMedia.vue";
import BookEmpty from "@/views/book/BookEmpty.vue";

const props = defineProps({
  categories: Array,
  scrollingProgress: Object,
  windowHeights: Number,
})

const emit = defineEmits(['scrolling'])
const route = useRoute();

const {rawText, book, typeBook, downloadBook} = useBook();
function scrolling(e:Event) {
  emit('scrolling', e)
}
document.title = 'Book';
downloadBook(+route.params.id)

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
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {

}
</style>