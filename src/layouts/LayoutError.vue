<template>
  <div class="error-wrap">
    <v-error/>
  </div>
</template>

<script>
import VError from "@/views/VError";

export default {
  name: "LayoutError",
  components: {VError}
}
</script>

<style scoped>
.error-wrap {
  margin: 0;
  background-color: #252842;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-family: 'Ubuntu', sans-serif;
}
</style>