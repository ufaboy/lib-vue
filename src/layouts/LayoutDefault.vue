<template>
  <div class="basement">
    <header class="header">
      <router-link to="/">Home</router-link>
    </header>
    <slot/>
  </div>
</template>

<script>
import parents from "@/models/parents";

export default {
  name: "LayoutDefault",
  components: {},
  props: {},
  data: () => ({
  }),
  methods: {
    async loadParents() {
      const result = await this.$fetch('/genre/find')
      if (result) {
        parents.items = result.parents
      }
      console.log({'loaded': parents})
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$store.dispatch('genre/loadGenres')
    // if (this.$store.state.genre.items.length === 0) {
    //   this.loadParents()
    // }
  },
  mounted() {
    console.log({'store': this.$store.getters['genre/byType']})
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.basement {
.header {
  color: var(--color-2);
  background: var(--background-2);
  display: flex;
  height: 3.5rem;
  padding: 0.5rem 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
}
</style>