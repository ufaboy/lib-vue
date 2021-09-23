<template>
<div class="theme-light"></div>
</template>

<script>

export default {
  name: "ThemeLight"
}
</script>

<style scoped>
.theme-light {
  position: fixed;
  z-index: -1;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: var(--background);
  /*background-image: url("/img/retina_wood.png");*/
}
</style>