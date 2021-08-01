<template>
  <div class="list-genre">
    <header class="header" v-if="isMobile">
      <select class="select" v-model="activeDivision">
        <option class="option" :value="division" v-for="division of divisions" :key="division.id">
          {{ division.name }}
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
    activeDivision: {
      genres: []
    },
  }),
  computed: {
    divisions() {
      return this.$store.state.genre.divisions
    },
    genres() {
      let selectedDivision
      if (this.activeDivision.name) {
        selectedDivision = this.divisions.find(item => item.id === this.activeDivision.id || item.name === this.activeDivision.name)
      } else if (this.$route.params.id) {
        selectedDivision = this.divisions.find(item => item.id === +this.$route.params.id)
      } else if (this.$route.params.name) {
        selectedDivision = this.divisions.find(item => item.name === this.$route.params.name)
      } else {
        return []
      }
      return selectedDivision ? Array.isArray(selectedDivision.genres) ? selectedDivision.genres : [] : []
    },
    isMobile() {
      return this.$store.state.main.isMobile
    }
  },

  watch: {
  },
  created() {
    document.title = 'Genres';
    if (this.$route.params.id || this.$route.params.name) {
      // this.prepareDivision()
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
          // parent: this.genresParent.find(item => item.id === +this.$route.params.id).name
        }
      })
    },
    async prepareDivision() {
      if (this.$route.params.id) {
        this.activeDivision = this.divisions.find(item => item.id === +this.$route.params.id)
      } else if (this.$route.params.name) {
        this.activeDivision = this.divisions.find(item => item.name === this.$route.params.name)
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