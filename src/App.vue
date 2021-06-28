<template>
  <component :is="layout">
    <router-view @loaded-book="loadBook" :book-props="book" v-bind="$attrs" v-slot="{ Component }">
      <transition name="component-fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script>
import LayoutDefault from "@/layouts/LayoutDefault";
import {defineAsyncComponent} from "vue";

export default {
  components: {
    LayoutDefault,
    LayoutAuth: defineAsyncComponent(() => import('@/layouts/LayoutAuth.vue')),
    LayoutTest: defineAsyncComponent(() => import('@/layouts/LayoutTest.vue')),
    LayoutError: defineAsyncComponent(() => import('@/layouts/LayoutError.vue'))
  },
  data: () => ({
    book: {},
  }),
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
    loadBook(book) {
      console.log({'event': book})
      this.book = book
    }
  },
  created() {
    this.onResize()
    window.addEventListener('resize', this.onResize);
  }
}
</script>
<style>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>
