<template>
  <div class="basement">
    <header class="header">
      <router-link to="/">Home</router-link>
      <router-link to="/book">Books</router-link>
      <router-link to="/genre">Genre</router-link>
    </header>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "LayoutDefault",
  components: {},
  props: {},
  data: () => ({
  }),
  methods: {
    checkAuth() {
      const token = sessionStorage.getItem('lib-token') ?? ''
      if (!token) {
        this.$router.push('/login')
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.checkAuth()
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