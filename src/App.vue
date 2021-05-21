<template>
  <component :is="layout">
    <router-view/>
  </component>
</template>
<script>

import LayoutAuth from "@/layouts/LayoutAuth";
import LayoutDefault from "@/layouts/LayoutDefault";

export default {
  components: {LayoutDefault, LayoutAuth},
  computed: {
    layout() {
      return this.$route.meta.layout || 'layout-default'
    }
  },
  methods: {
    onResize() {
      if (document.documentElement.clientWidth > 892) {
        this.$store.commit('main/setIsDesktop')
      } else {
        this.$store.commit('main/setIsMobile')
      }
    },

  },
  created() {
    window.addEventListener('resize', this.onResize);

  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
