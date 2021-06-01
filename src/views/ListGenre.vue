<template>
  <div class="list-genre">
    <header class="header" v-if="$store.state.main.isMobile">
      <select class="select" v-model="activeParent" @change="loadGenre">
        <option class="option" :value="genre" v-for="genre of genresParent" :key="genre.id">
          {{ genre.name }}
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
import {$get} from "@/service/superFetch";
export default {
  name: "ListGenre",
  components: {},
  props: {},
  data: () => ({
    activeParent: {
      childes: []
    },
    genres: []
  }),
  computed: {
    parentId() {
      return this.activeParent.id ? this.activeParent.id : this.$route.params.id ? this.$route.params.id : null
    },
    genresParent() {
      return this.$store.state.genre.items
    }
  },
  watch: {},
  created() {
    if (this.$route.params.id) {
        const parent = this.genresParent.find(item=>item.id === +this.$route.params.id)
      if (parent) {
        this.activeParent = parent
      }
    this.loadGenre()
    }
  },
  mounted() {

  },
  methods: {
    openGenre(genre) {
      this.$router.push({name: 'list-book', params: {'id': genre.id, name: genre.name, parent: this.genresParent.find(item=>item.id === +this.$route.params.id).name}})
    },
    async loadGenre() {
      this.$loader.show()
      const result = await $get(`/genre?parent_id=${this.parentId}`)
      this.$loader.hide()
      if (result) {
        this.genres = result
      }
    }
  },
}
</script>

<style scoped lang="scss">
.list-genre {
  display: flex;
  flex-flow: row wrap;
  padding: 0 1rem;

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
    color: var(--color-2);
    background: var(--background-2);

    .title {
      margin-right: 0.5rem;
    }
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