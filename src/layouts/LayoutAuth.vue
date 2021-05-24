<template>
  <div class="auth-wrap">
    <login/>
  </div>

</template>

<script>
import Login from "@/views/Login";
export default {
  name: "LayoutAuth",
  components: {Login}
}
</script>

<style scoped>
.auth-wrap {
  height: 100%;
  width: 100%;
}
</style>