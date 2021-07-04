<template>
  <div class="auth-wrap">
    <login/>
    <canvas-space :count-dots="countDots"/>
  </div>
</template>

<script>
import Login from "@/views/TheLogin";
import CanvasSpace from "@/components/CanvasSpace";
export default {
  name: "LayoutAuth",
  components: {CanvasSpace, Login},
  data: () => ({
  }),
  computed: {
    isMobile() {
      return this.$store.state.main.isMobile
    },
    countDots() {
      return this.isMobile ? 100 : 500
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.auth-wrap {
  height: 100%;
  width: 100%;
  //background: linear-gradient(#141e30, #243b55);
  background: linear-gradient(#020120, #243b55);
  overflow: hidden;
  position: absolute;
  z-index: 0;
}
</style>