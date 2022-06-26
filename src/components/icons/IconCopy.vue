<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       :width="size" :height="size" :viewBox="viewBox" :fill="fill">
    <g>
      <path :fill="color"
          d="M308.51,450H80.59a15,15,0,0,1-15-15V143.93a15,15,0,0,1,15-15H308.51a15,15,0,0,1,15,15V435A15,15,0,0,1,308.51,450ZM95.59,420H293.51V158.93H95.59Z" />
      <path :fill="color"
          d="M389.44,369.07H308.51a15,15,0,0,1,0-30h65.93V78H176.52v65.92a15,15,0,0,1-30,0V63a15,15,0,0,1,15-15H389.44a15,15,0,0,1,15,15V354.07A15,15,0,0,1,389.44,369.07Z" />
    </g>
  </svg>
</template>

<script lang="ts" setup>
import {defineProps, withDefaults} from 'vue';

interface Props {
  size?: number;
  color?: string;
  viewBox?: string;
  fill?: string;
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  viewBox: '0 0 512 512',
  fill: 'none',
});
</script>
