<template>
  <div class="list-genre h-fit flex flex-row flex-wrap text-slate-900 dark:text-white pt-3">
<!--    <section class="sidebar" v-if="isMobile()">
      <select class="form-field__select" v-model="activeCategory">
        <option
          class="option"
          :value="category"
          v-for="category of categories"
          :key="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </section>-->
    <router-link
      :to="{
        name: 'list-book',
        params: {
          id: genre.id,
          name: genre.name,
        },
      }"
      class="genre border border-2 rounded uppercase w-48 h-fit p-4 mr-3 mb-3 hover:bg-slate-500"
      v-for="genre of genres"
      :key="'genre' + genre.id"
      >{{ genre.name }}
    </router-link>
    <!--    <observer @intersect="loadGenres('push')"/>-->
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
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
document.title = "Genres";
const route = useRoute();

const activeCategory = ref<CategoryExtended|undefined>({ name: "", id: 0, genres: [] });
const categories = ref<CategoryExtended[]>(props.categories);
const genres = computed(() => {
  let selectedCategory: CategoryExtended|undefined = { name: "", id: 0, genres: [] };

  if (activeCategory.value!.name) {
    selectedCategory = categories.value.find(
      (item: any) =>
        item.id === activeCategory.value!.id || item.name === activeCategory.value!.name
    );
  } else if (route.params.id) {
    selectedCategory = categories.value.find((item: Category) => item.id === +route.params.id);
  } else if (route.params.name) {
    selectedCategory = categories.value.find(
      (item: Category) => item.name === route.params.name
    );
  } else {
    return [];
  }
  return selectedCategory
    ? Array.isArray(selectedCategory.genres)
      ? selectedCategory.genres
      : []
    : [];
});

async function prepareCategory() {
  if (categories.value.length) {
    if (route.params.id) {
      activeCategory.value = categories.value.find(
        (item) => item.id === +route.params.id
      );
    } else if (route.params.name) {
      activeCategory.value = categories.value.find(
        (item) => item.name === route.params.name
      );
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

<style lang="scss">
.list-genre {

}

@media only screen and (max-width: 892px) {
  .list-genre {

  }
}

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .list-genre {
  }
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .list-genre {

  }
}
</style>
