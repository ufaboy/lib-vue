<template>
  <div class="star-rating flex flex-row" :class="{disabled: disabled}">
    <svg width="0" height="0">
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="star">
        <path d="M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z" />
      </symbol>
    </svg>
    <svg v-for="num in 5" class="c-icon" :class="starClassesObject(num)" :width="sizePx" :height="sizePx"
         @click="changeRating(num)">
      <use href="#star"></use>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";

interface Props {
  modelValue: Number
  size?: Number
  disabled?: Boolean
  hideInactive?:Boolean
}
const { modelValue, disabled, size = 32, hideInactive } = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function starClassesObject(num:number){
  return {'active': modelValue >= num, 'hide': hideInactive ? modelValue < num : false}
}
function changeRating(value:number) {
  if (disabled) return null;
  emit('update:modelValue', value)
}

const sizePx = computed(() => {
  return size ? `${size}px` : '32px'
})
</script>

<style lang="scss">
.star-rating {
  .c-icon {
    --star-active: #fece3c;
    --star-inactive: #6c6962;
    fill: var(--star-inactive);
    cursor: pointer;
  }
  .c-icon.active {
    fill: var(--star-active);
  }
  .c-icon.hide {
    fill: transparent;
  }
}
</style>