<template>
  <svg class="icon-burger" :class="{active: active, hide: !active}" :width="size" :height="size" :viewBox="viewBox">
    <rect :fill="color" y="0" width="26" height="4"/>
    <rect :fill="color" y="10" width="26" height="4"/>
    <rect :fill="color" y="20" width="26" height="4"/>
  </svg>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';
interface Props {
  size?: number;
  color?: string;
  viewBox?: string;
  fill?: string;
  active: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  viewBox: '0 0 26 24',
  fill: 'none',
});
</script>
<style lang="scss">
.icon-burger {
  @keyframes slide-top {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100px);
    }
  }
  &.active {
    rect {
      transition: transform 0.3s;
    }

    rect:nth-child(1) {
      transform: rotate(45deg) translate(15%, -10%);
    }

    rect:nth-child(2) {
      transform: rotate(-45deg) translate(-50%, 20%);
    }

    rect:nth-child(3) {
      transform: rotate(-45deg) translate(-50%, -20%);
    }
  }
}
</style>