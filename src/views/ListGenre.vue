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
    activeParent: {}
  }),
  computed: {},
  watch: {},
  created() {
this.prepareGenres()
  },
  mounted() {
  },
  methods: {
    prepareGenres() {
      console.log({'byType': this.$store.getters['genre/byType']})
      if (this.$store.state.genre.data.items.length === 0) {
        this.$store.dispatch('genre/loadGenres')
      }
      // this.activeParent = this.$store.getters['genre/byType'].find(item => item.id === +this.$route.params.id)
    }
  },
}
</script>

<style scoped>

</style>