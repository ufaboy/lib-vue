<template>
  <div class="list-genre w-full lg:absolute lg:top-0 lg:left-[10rem] lg:w-[calc(100%_-_10rem)]
  h-fit block lg:flex flex-row flex-wrap text-slate-900 dark:text-white p-3">
    <select v-if="isMobile()" class="w-full h-fit bg-white dark:bg-neutral-900 text-slate-900 dark:text-white p-4 border border-2 rounded uppercase mb-5" @change="changeCategory" v-model="activeCategory">
      <option
          class="option text-slate-900 dark:text-white"
          :value="category"
          v-for="category of categories"
          :key="category.id"
      >
        {{ category.name }}
      </option>
    </select>
    <router-link
      :to="{ name: 'list-book', params: { id: genre.id, name: genre.name }}"
      class="flex justify-center px-4 py-3 w-full lg:w-40 mr-3 mb-3 cursor-pointer rounded-md text-lg capitalize
        ring-1 dark:ring-white hover:ring hover:bg-emerald-100 dark:hover:bg-slate-800"
      v-for="genre of genres"
      :key="'genre' + genre.id"
      @click="clearQuery"
      >{{ genre.name }}
    </router-link>
    <!--    <observer @intersect="loadGenres('push')"/>-->
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBooks from "../../composables/useBooks";
import { isMobile } from "../../utils/helpers";

interface Category {
    id: number,
    name: string,
    genres: Array<Genre>
}
interface Genre {
    [key: string]: number|string|Category|boolean
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: boolean,
    created_at: number,
}
interface CategoryExtended extends Category{
    genres: Array<Genre>
}
const props = defineProps<{
  categories: CategoryExtended[]
}>()
const route = useRoute();
const router = useRouter();
const {clearQuery} = useBooks();

document.title = "Genres";
const defaultCategory = { name: "", id: 0, genres: [] }
const activeCategory = ref<CategoryExtended>(defaultCategory);
const genres = computed(() => {
  let selectedCategory: CategoryExtended = defaultCategory;

  if (activeCategory.value!.name) {
    selectedCategory = props.categories.find(
      (item: any) =>
        item.id === activeCategory.value!.id || item.name === activeCategory.value!.name
    ) || defaultCategory;
  } else if (route.params.id) {
    selectedCategory = props.categories.find((item: Category) => item.id === +route.params.id) || defaultCategory;
  } else if (route.params.name) {
    selectedCategory = props.categories.find(
      (item: Category) => item.name === route.params.name
    ) || defaultCategory;
  } else {
    return [];
  }
  return selectedCategory
    ? Array.isArray(selectedCategory.genres)
      ? selectedCategory.genres
      : []
    : [];
});
function changeCategory() {
  router.push({name:'list-genre', params: {name: activeCategory.value.name}})
}
async function prepareCategory() {
  if (props.categories.length) {
    if (route.params.id) {
      const cat = props.categories.find(
          (item) => item.id === +route.params.id
      )
      activeCategory.value = cat || defaultCategory;
    } else if (route.params.name) {
      activeCategory.value = props.categories.find(
        (item) => item.name === route.params.name
      ) || defaultCategory;
    }
  }
}

if (route.params.id || route.params.name) {
  prepareCategory();
}
watch(props, () => {
  prepareCategory();
});
</script>
