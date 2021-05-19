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
        this.$store.commit('genre/setGenre', result)
      }
      console.log({'loaded': parents})
    }
  },
  computed: {},
  watch: {},
  created() {
    // if (this.$store.getters['genre/items'].length === 0) {
    //   this.loadParents()
    // }
  },
  mounted() {
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