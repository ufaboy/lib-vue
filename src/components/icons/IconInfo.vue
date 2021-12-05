<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       :viewBox="viewBox">
    <g>
      <path d="M 22.5 11.859375 C 22.421875 6.0625 17.65625 1.425781 11.859375 1.5 C 6.0625 1.574219 1.425781 6.34375 1.5 12.140625 C 1.578125 17.9375 6.34375 22.574219 12.140625 22.5 C 17.9375 22.421875 22.578125 17.65625 22.5 11.859375 Z M 12 5.246094 C 12.828125 5.246094 13.5 5.914062 13.5 6.746094 C 13.5 7.574219 12.828125 8.246094 12 8.246094 C 11.171875 8.246094 10.5 7.574219 10.5 6.746094 C 10.5 5.914062 11.171875 5.246094 12 5.246094 Z M 14.0625 18.515625 L 9.9375 18.515625 L 9.9375 18 L 10.96875 18 L 10.96875 10.5 L 9.9375 10.5 L 9.9375 9.9375 L 13.03125 9.9375 L 13.03125 18 L 14.0625 18 Z M 14.0625 18.515625 "/>
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
