<template>
  <svg :width="size" :height="size" :viewBox="viewBox" :fill="fill">
    <g>
      <path class="cls-3" d="M 4 8 L 3 21 C 4 22.105469 3.894531 23 5 23 L 19 23 C 20.105469 23 21 22.105469 21 21 L 21 8 Z M 4 8 "/>
      <path class="cls-4" d="M 4 7 L 4 20 C 4 21.101562 4.894531 22 5 22 L 19 22 C 20.105469 22 21 21.101562 21 20 L 21 7 Z M 4 7 "/>
      <path class="cls-5" d="M 4 6 L 4 19 C 4 20.101562 4.894531 21 5 21 L 19 21 C 20.105469 21 21 20.101562 21 19 L 21 6 Z M 4 6 "/>
      <path class="cls-6" d="M 4 5 L 4 18 C 4 19.101562 4.894531 20 5 20 L 19 20 C 20.105469 20 21 19.101562 21 18 L 21 5 Z M 4 5 "/>
      <path class="cls-2" d="M 5 1 C 3.894531 1 3 1.894531 3 3 L 3 21 C 3 22.105469 3.894531 23 5 23 L 7 23 L 7 22 L 5.5 22 C 4.671875 22 4 21.328125 4 20.5 C 4 19.671875 4.671875 19 5.5 19 L 19 19 C 20.105469 19 21 18.105469 21 17 L 21 3 C 21 1.894531 20.105469 1 19 1 Z M 5 1 "/>
      <path class="cls-1" d="M 8 1 L 8 19 L 19 19 C 20.105469 19 21 18.105469 21 17 L 21 3 C 21 1.894531 20.105469 1 19 1 Z M 8 1 "/>
    </g>
  </svg>
</template>
<script lang="ts" setup>
import {computed, defineProps, withDefaults} from 'vue';
interface Props {
  size?: number;
  color?: string;
  viewBox?: string;
  fill?: string;
}

withDefaults(defineProps<Props>(), {
  size: 100,
  color: 'currentColor',
  viewBox: '0 0 24 24',
  fill: 'none',
});

function rand(min:number, max:number) {
  return min + Math.random() * (max - min);
}

const iconH = computed(() => {
  return rand(1, 360);
})
const iconS = computed(() => {
  return rand(0, 100);
})
const iconL = computed(() => {
  return rand(0, 100);
})

const clsOne = computed(() => {
  return `hsl(${iconH.value}, ${iconS.value}%, ${iconL.value}%)`;
})
const clsTwo = computed(() => {
  return `hsl(${iconH.value}, ${iconS.value}%, ${(iconL.value - 10) || 5}%)`;
})
const clsThree = computed(() => {
  return `hsl(${iconH.value}, ${iconS.value}%, ${(iconL.value - 20) || 10}%)`;
})
</script>
<style lang="scss" scoped>
.cls-1 {
  fill: v-bind('clsOne');
}

.cls-2 {
  fill: v-bind('clsTwo');
}

.cls-3 {
  fill: v-bind('clsThree');
}
.cls-4 {
  fill: hsla(192, 15%, 94%, 1);
}
.cls-5 {
  fill: hsla(204, 8%, 76%, 1);
}
.cls-6 {
  fill: hsla(192, 15%, 94%, 1);
}
</style>
<!--
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
</style>-->
