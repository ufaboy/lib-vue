<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       :viewBox="viewBox"
  >
    <g>
      <path d="M 18 9 L 13.757812 13.242188 L 12.695312 12.183594 L 15.878906 9 L 12.695312 5.816406 L 13.757812 4.757812 Z M 2.121094 9 L 5.304688 12.183594 L 4.242188 13.242188 L 0 9 L 4.242188 4.757812 L 5.300781 5.816406 Z M 7.339844 15.75 L 5.746094 15.75 L 10.660156 2.25 L 12.253906 2.25 Z M 7.339844 15.75 "/>
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
