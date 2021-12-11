<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24">
    <g>
      <path class="cls-3" d="M 3 8 L 3 21 C 3 22.105469 3.894531 23 5 23 L 19 23 C 20.105469 23 21 22.105469 21 21 L 21 8 Z M 3 8 "/>
      <path style="fill:rgb(92.54902%,94.117647%,94.509804%);fill-opacity:1;" d="M 3 7 L 3 20 C 3 21.101562 3.894531 22 5 22 L 19 22 C 20.105469 22 21 21.101562 21 20 L 21 7 Z M 3 7 "/>
      <path style="fill:rgb(74.117647%,76.470588%,78.039216%);fill-opacity:1;" d="M 3 6 L 3 19 C 3 20.101562 3.894531 21 5 21 L 19 21 C 20.105469 21 21 20.101562 21 19 L 21 6 Z M 3 6 "/>
      <path style="fill:rgb(92.54902%,94.117647%,94.509804%);fill-opacity:1;" d="M 3 5 L 3 18 C 3 19.101562 3.894531 20 5 20 L 19 20 C 20.105469 20 21 19.101562 21 18 L 21 5 Z M 3 5 "/>
      <path class="cls-2" d="M 5 1 C 3.894531 1 3 1.894531 3 3 L 3 21 C 3 22.105469 3.894531 23 5 23 L 7 23 L 7 22 L 5.5 22 C 4.671875 22 4 21.328125 4 20.5 C 4 19.671875 4.671875 19 5.5 19 L 19 19 C 20.105469 19 21 18.105469 21 17 L 21 3 C 21 1.894531 20.105469 1 19 1 Z M 5 1 "/>
      <path class="cls-1"  d="M 8 1 L 8 19 L 19 19 C 20.105469 19 21 18.105469 21 17 L 21 3 C 21 1.894531 20.105469 1 19 1 Z M 8 1 "/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconBook",
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
    },
    index: Number,
  },
  data() {
    return {}
  },
  computed: {
    iconColor() {
      return Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },
    clsOne() {
      return `#${this.iconColor}`
    },
    clsTwo() {
      return `#${this.lightenDarkenColor(this.iconColor, -10)}`
    },
    clsThree() {
      return `#${this.lightenDarkenColor(this.iconColor, -10)}`
    }
  },
  methods: {
    lightenDarkenColor(col, amt) {
      let num = parseInt(col, 16);
      let r = (num >> 16) + amt;
      let b = ((num >> 8) & 0x00FF) + amt;
      let g = (num & 0x0000FF) + amt;
      let newColor = g | (b << 8) | (r << 16);
      return newColor.toString(16);
    }
  }
}
</script>

<style>
.cls-1 {
  /*fill: #4b6ea4;*/
  fill: v-bind(clsOne);
}

.cls-2 {
  /*fill: #445f96;*/
  fill: v-bind(clsTwo);
}

.cls-3 {
  /*fill: #a09b8c;*/
  fill: v-bind(clsThree);
}

.cls-4 {
  fill: #f1f2f2;
}

.cls-5 {
  fill: #4c5665;
}
</style>