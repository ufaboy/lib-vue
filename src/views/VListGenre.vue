<template>
  <div class="list-genre">
    <section class="sidebar" v-if="isMobile()">
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
    </section>
    <router-link
      :to="{
        name: 'list-book',
        params: {
          id: genre.id,
          name: genre.name,
        },
      }"
      class="genre"
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
import { isMobile } from "../utils/helpers";



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

<style scoped lang="scss">
.list-genre {
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;

  .genre {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    text-transform: capitalize;
    text-decoration: none;
    cursor: pointer;
    width: 300px;
    overflow: hidden;
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 1rem;
    color: var(--surface-on);
    background: var(--surface);
    border-radius: 5px;

    .title {
      margin-right: 0.5rem;
    }
  }

  .genre:hover {
    color: var(--text-primary);
    background: var(--primary-dark);
  }
}

@media only screen and (max-width: 892px) {
  .list-genre {
    padding: 0.5rem;
    columns: 400px;

    .sidebar {
      width: 100%;
      max-width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      max-height: 42px;

      .search-input {
        flex: 1;
        margin-right: 0.5rem;
        color: (var(--color));
        background-color: var(--background-2);
      }

      .select {
        flex: 1;
        padding: 0.5rem;

        .option {
          padding: 0.5rem;
        }
      }
    }

    .genre {
      margin-bottom: 0.5rem;
      margin-right: 0;
      padding: 0.5rem;
      width: 100%;
    }
  }
}

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .list-genre {
  }
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .list-genre {
    .header {
      .search-input {
        max-width: 220px;
      }

      .select {
        //max-width: 165px;
      }
    }

    .genre {
      justify-content: space-between;
    }
  }
}
</style>
