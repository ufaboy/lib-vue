<template>
<header class="header md:sticky flex top-0 justify-between items-center relative text-white bg-neutral-900 w-full h-fit p-3 z-20" :class="{active: activeBurger, hide: !activeBurger}" @click.stop="activeBurger = false">
  <router-link class="breadcrumb-home p-2" to="/">Home</router-link>
  <div id="header-target" class="w-40"></div>
  <button class="btn-icon" aria-label="Menu" @click.stop="activeBurger = !activeBurger">
    <IconBurger :active="activeBurger" />
  </button>
  <ul v-if="activeBurger" class="absolute bg-neutral-800 left-0 top-[3rem] w-full">
    <li class="p-2 mb-3">
      <router-link class="breadcrumb-link" :to="{name: 'book-index'}">Books</router-link>
    </li>
    <li class="p-2 mb-3">
      <router-link class="breadcrumb-link" :to="{name: 'genre-index'}">Genre</router-link>
    </li>
    <li class="p-2 mb-3">
      <router-link class="breadcrumb-link" :to="{name: 'note'}">Note</router-link>
    </li>
    <li class="p-2 mb-3">
      <router-link class="breadcrumb-link" :to="{name: 'author-index'}">Authors</router-link>
    </li>
    <li class="p-2 mb-3" v-if="btnViewEditMode.name">
      <router-link class="breadcrumb-link" :to="btnViewEditMode.path">{{ btnViewEditMode.name }}</router-link>
    </li>
    <slot name="burger"></slot>
  </ul>
</header>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import IconBurger from "./icons/IconBurger.vue";

const route = useRoute()
const activeBurger = ref(false)
const btnViewEditMode = computed(() => {
  return route.name === 'book-view' ? {
    name: 'Edit',
    path: `/book/update/${route.params.id}`
  } : route.name === 'book-edit' ? {name: 'View', path: `/book/${route.params.id}`} : {}
});
</script>