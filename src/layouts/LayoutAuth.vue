<template>
  <div class="auth-wrap">
    <login/>
    <canvas-space/>
  </div>
</template>

<script>
import Login from "@/views/Login";
import CanvasSpace from "@/components/CanvasSpace";
export default {
  name: "LayoutAuth",
  components: {CanvasSpace, Login},
  data: () => ({
  }),
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