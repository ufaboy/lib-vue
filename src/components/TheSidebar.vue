<template>
<aside class="sidebar">
  <h2></h2>
  <label class="form-field__label">Genre</label>
  <select class="form-field__select mb-half" v-model="filter.genre"
          @change="changeGenreLoadBook">
    <optgroup :label="category.name" v-for="category of props.categories" :key="'category-' + category.id">
      <option v-for="genre of category.genres"
              :key="'select-genre'+genre.id"
              :value="genre">{{ genre.name }}
      </option>
    </optgroup>
  </select>
  <router-link :to="{ name: 'book-view', params: {id: book.id}}" class="book" v-for="book of books.items"
               :key="'book'+book.id">
    {{ book.name }}
  </router-link>
</aside>
</template>

<script setup>
import useBooks from "../composables/useBooks";
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
})
// eslint-disable-next-line no-unused-vars
const {filter, searchQuery, limit, orderBy,  books, page, getCover, loadOrderBy, saveOrderBy, getBooksAndPush} = useBooks();
function changeGenreLoadBook() {
  page.value = 1
  getBooksAndPush()
}
</script>

<style lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  align-content: baseline;
  .book {
    color: var(--text);
    background-color: var(--surface);
    width: 100%;
    text-decoration: none;
    margin: 0 0 0.5rem 0;
    padding: 5px 10px;
  }
}
</style>