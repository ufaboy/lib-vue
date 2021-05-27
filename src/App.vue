<template>
  <component :is="layout">
    <router-view/>
  </component>
</template>
<script>

import LayoutAuth from "@/layouts/LayoutAuth";
import LayoutDefault from "@/layouts/LayoutDefault";

export default {
  components: { LayoutDefault, LayoutAuth},
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
    this.onResize()
    window.addEventListener('resize', this.onResize);
  }
}
</script>
<style>

</style>
