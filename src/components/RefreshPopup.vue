<template>
  <div class="sw-update-popup" @click="refreshApp">
    Доступен новый контент.
    <button class="sw-update-popup__btn">Обновить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'refresh-sw'): void
}>()

const props = defineProps<{
  swReg: any
}>()
const registration = ref()
const updateExists = ref<boolean>(false)

    if (props.swReg) {
      console.log({created: props.swReg})
      registration.value = Object.assign({}, props.swReg)
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log({controllerchange: navigator.serviceWorker})
      if (updateExists.value) return
      updateExists.value = true
      window.location.reload()
    })

function refreshApp() {
      emit('refresh-sw');
    }

</script>

<style lang="scss">
.sw-update-popup {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 1em;
  bottom: 1em;
  padding: 1em;
  border: 1px solid #3eaf7c;
  border-radius: 5px;
  background: #484343;
  box-shadow: 0 4px 16px rgb(0 0 0 / 50%);
  text-align: center;
  z-index: 2;

  .sw-update-popup__btn {
    border: none;
    border-radius: 5px;
    margin-top: .5em;
    padding: .25em 2em;
    cursor: pointer;
    background-color: hsla(162, 100%, 26%, 1);
    color: #ffffff;
  }

}
</style>