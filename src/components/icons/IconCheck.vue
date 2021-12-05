<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       :viewBox="viewBox">
    <g>
      <path d="M 11.25 15.75 C 11.050781 15.75 10.859375 15.671875 10.71875 15.53125 L 7.71875 12.53125 C 7.421875 12.238281 7.421875 11.761719 7.71875 11.46875 C 8.011719 11.171875 8.488281 11.171875 8.78125 11.46875 L 11.25 13.941406 L 15.96875 9.21875 C 16.261719 8.921875 16.738281 8.921875 17.03125 9.21875 C 17.328125 9.511719 17.328125 9.988281 17.03125 10.28125 L 11.78125 15.53125 C 11.640625 15.671875 11.449219 15.75 11.25 15.75 Z M 11.25 15.75 "/>
      <path d="M 12 21.75 C 6.613281 21.75 2.25 17.386719 2.25 12 C 2.25 6.613281 6.613281 2.25 12 2.25 C 17.386719 2.25 21.75 6.613281 21.75 12 C 21.75 17.386719 17.386719 21.75 12 21.75 Z M 12 3.75 C 7.445312 3.75 3.75 7.445312 3.75 12 C 3.75 16.554688 7.445312 20.25 12 20.25 C 16.554688 20.25 20.25 16.554688 20.25 12 C 20.25 7.445312 16.554688 3.75 12 3.75 Z M 12 3.75 "/>
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
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
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
