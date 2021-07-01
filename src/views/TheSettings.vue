<template>
  <div class="settings">
    <button @click="changeTheme('auto')">auto</button>
    <button @click="changeTheme('light')">light</button>
    <button @click="changeTheme('black')">black</button>
    <button @click="changeTheme('dark')">dark</button>
    <button @click="changeTheme('dim')">dim</button>
  </div>
</template>

<script>
export default {
  name: "TheSettings",
  components: {},
  props: {},
  data: () => ({}),
  methods: {
    changeTheme(theme) {
      localStorage.setItem('lib-theme', theme)
      const doc = document.firstElementChild
      doc.setAttribute('color-scheme', theme)
    }
  },
  computed: {},
  watch: {},
  created() {
    document.title = 'Settings';
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped>

</style>