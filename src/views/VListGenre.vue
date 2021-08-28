<template>
  <div class="list-genre">
    <header class="header" v-if="isMobile">
      <select class="select" v-model="activeCategory">
        <option class="option" :value="category" v-for="category of categories" :key="category.id">
          {{ category.name }}
        </option>
      </select>
    </header>
    <section class="genre"
             v-for="genre of genres"
             :key="'genre'+genre.id"
             @click="openGenre(genre)">{{ genre.name }}
    </section>
    <!--    <observer @intersect="loadGenres('push')"/>-->
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex';

export default {
  name: "ListGenre",
  components: {},
  setup() {
    document.title = 'Genres';
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const activeCategory = ref({
      genres: []
    })
    const categories = computed(() => store.state.genre.categories)
    const isMobile = computed(() => store.state.main.isMobile)
    const genres = computed(() => {
      let selectedCategory = {}
      if (activeCategory.value.name) {
        selectedCategory = categories.value.find(item => item.id === activeCategory.value.id || item.name === activeCategory.value.name)
      } else if (route.params.id) {
        selectedCategory = categories.value.find(item => item.id === +route.params.id)
      } else if (route.params.name) {
        selectedCategory = categories.value.find(item => item.name === route.params.name)
      } else {
        return []
      }
      return selectedCategory ? Array.isArray(selectedCategory.genres) ? selectedCategory.genres : [] : []
    })

    const openGenre = (genre) => {
      router.push({
        name: 'list-book',
        params: {
          'id': genre.id,
          'name': genre.name,
        }
      })
    };
    const prepareCategory = async () => {
      if (route.params.id) {
        activeCategory.value = categories.value.find(item => item.id === +route.params.id)
      } else if (route.params.name) {
        activeCategory.value = categories.value.find(item => item.name === route.params.name)
      }
    };

    if (route.params.id || route.params.name) {
      prepareCategory()
    }

    return {activeCategory, categories, genres, isMobile, openGenre}
  },
}
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
    cursor: pointer;
    width: 300px;
    overflow: hidden;
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 1rem;
    color: var(--text1);
    background: var(--surface2);
    border-radius: 5px;

    .title {
      margin-right: 0.5rem;
    }
  }

  .genre:hover {
    background: var(--surface4);
  }
}

@media only screen and (max-width: 892px) {
  .list-genre {
    padding: 0.5rem;
    columns: 400px;

    .header {
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