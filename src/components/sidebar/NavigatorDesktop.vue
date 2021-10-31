<template>
  <ul class="navigator-desktop">
    <li class="navigator-element">
      <router-link class="navigator-link" to="/">Home</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/books">Books</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/genre">Genre</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/note">Note</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/media">Media</router-link>
    </li>
    <li class="navigator-element" v-if="btnViewEditMode.name">
      <router-link class="navigator-link" :to="btnViewEditMode.path">{{ btnViewEditMode.name }}</router-link>
    </li>

  </ul>
</template>

<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()
const btnViewEditMode = computed(() => {
  return route.name === 'book-view' ? {
    name: 'Edit',
    path: `/book/update/${route.params.id}`
  } : route.name === 'book-edit' ? {name: 'View', path: `/book/${route.params.id}`} : {}
});
</script>

<style lang="scss">
.navigator-desktop {
  margin-bottom: 1rem;

  .navigator-element {
    display: flex;
    margin: 0 0 0.5rem 0;

    .navigator-link {
      text-decoration: none;
      color: var(--text);
      width: 100%;
      padding: 0.5rem 0.75rem;
    }
  }

  .navigator-element:last-of-type {
    margin: 0;
  }

  .navigator-element:hover {
    background-color: var(--surface-light);
  }
}
</style>