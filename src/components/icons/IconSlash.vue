<template>
  <svg :width="size" :height="size" :viewBox="viewBox" :fill="fill">
    <g>
      <path d="M 18 9 L 13.757812 13.242188 L 12.695312 12.183594 L 15.878906 9 L 12.695312 5.816406 L 13.757812 4.757812 Z M 2.121094 9 L 5.304688 12.183594 L 4.242188 13.242188 L 0 9 L 4.242188 4.757812 L 5.300781 5.816406 Z M 7.339844 15.75 L 5.746094 15.75 L 10.660156 2.25 L 12.253906 2.25 Z M 7.339844 15.75 "/>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';
interface Props {
  size?: number;
  color?: string;
  viewBox?: string;
  fill?: string;
}

withDefaults(defineProps<Props>(), {
  size: 18,
  color: 'currentColor',
  viewBox: '0 0 18 18',
  fill: 'none',
});
</script>
