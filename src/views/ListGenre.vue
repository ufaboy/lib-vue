<template>
  <div class="list-genre">
    <header class="header" v-if="$store.state.main.isMobile">
      <select class="select" v-model="activeParent">
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
    genresParent() {
      return this.$store.state.genre.items
    },
  },

  watch: {
    genresParent: function () {
      this.prepareGenres()
    },
    activeParent: function (newValue) {
      this.prepareGenres(newValue)
    }
  },
  created() {
    document.title = 'Genres';
    if (this.$route.params.id) {
      this.prepareGenres()
    }
  },
  mounted() {

  },
  methods: {
    openGenre(genre) {
      this.$router.push({name: 'list-book',
        params: {
          'id': genre.id,
          name: genre.name,
          parent: this.genresParent.find(item => item.id === +this.$route.params.id).name
        }
      })
    },
    async prepareGenres(element = null) {
      const genreId = element ? element.id : +this.$route.params.id
      const parent = this.genresParent.find(item => item.id === genreId)
      if (parent) {
        this.activeParent = parent
        this.genres = parent.childes
        this.$emit('loaded-parent', {name: parent.name, id: parent.id})
      }
    },
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