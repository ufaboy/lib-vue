<template>
  <div class="error-wrap">
    <the-error/>
  </div>
</template>

<script>
import TheError from "@/views/TheError";

export default {
  name: "LayoutError",
  components: {TheError}
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