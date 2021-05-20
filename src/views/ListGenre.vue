<template>
  <div class="list-genre">
    <header class="header" v-if="$store.state.isMobile">
      <select class="select" v-model="activeParent" @change="changeParent">
        <option class="option" :value="genre" v-for="genre of $store.state.genre.itemsByType" :key="genre.id">
          {{ genre.title }}
        </option>
      </select>
    </header>
    <section class="genre"
             v-for="genre of genres"
             :key="'genre'+genre.id"
             @click="openGenre(genre.id)">{{ genre.name }}
    </section>
    <!--    <observer @intersect="loadGenres('push')"/>-->
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
  </div>
</template>

<script>
export default {
  name: "ListGenre",
  components: {},
//mixins: {},
  props: {},
  data: () => ({
    activeParent: {
      childes: []
    }
  }),
  computed: {
    genresByType() {
      return this.$store.state.genre.data.itemsByType
    },
    genres() {
      return this.activeParent.childes
    }
  },
  watch: {},
  created() {
    this.prepareGenres()
  },
  mounted() {

  },
  methods: {
    openGenre(genreId) {
      this.$router.push({name: 'list-books', params: {'id': genreId}})
    },
    async prepareGenres() {
      if (this.$store.state.genre.data.items.length === 0) {
        await this.$store.dispatch('genre/loadGenres')
      }
      if (this.$store.state.genre.data.itemsByType.length) {
        const result = this.$store.state.genre.data.itemsByType.find(item => item.id === this.$route.params.id)
        if (result) this.activeParent = result
      }

    }
  },
}
</script>

<style scoped>

</style>