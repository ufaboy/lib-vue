<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       :viewBox="viewBox"
  >
    <g>
      <path d="M 11.972656 9.003906 L 17.542969 3.433594 C 18.160156 2.816406 18.160156 1.820312 17.542969 1.207031 L 16.800781 0.460938 C 16.183594 -0.152344 15.1875 -0.152344 14.574219 0.460938 L 9.003906 6.03125 L 3.433594 0.460938 C 2.816406 -0.152344 1.820312 -0.152344 1.207031 0.460938 L 0.460938 1.203125 C -0.152344 1.820312 -0.152344 2.816406 0.460938 3.433594 L 6.03125 9.003906 L 0.460938 14.574219 C -0.152344 15.1875 -0.152344 16.1875 0.460938 16.800781 L 1.207031 17.542969 C 1.820312 18.160156 2.820312 18.160156 3.433594 17.542969 L 9.003906 11.972656 L 14.574219 17.542969 C 15.1875 18.160156 16.1875 18.160156 16.800781 17.542969 L 17.542969 16.800781 C 18.160156 16.183594 18.160156 15.1875 17.542969 14.574219 Z M 11.972656 9.003906 "/>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    viewBox: {
      type: String,
      default: '0 0 18 18'
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px; /* yes, I'm that particular about formatting */
}
</style>
