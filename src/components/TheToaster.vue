<template>
  <div class="toast">
    <transition name="toast" tag="div" >
      <span class="message" :class="messageTypeClass">{{message}}</span>
    </transition>
  </div>

</template>

<script setup lang="ts">
import {computed} from "vue";

// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info'
  }
})
const messageTypeClass = computed(()=>{
  return {
    info: props.type === 'info',
    error: props.type === 'error',
    success: props.type === 'success',
    warning: props.type === 'warning',
  }
})
</script>

<style lang="scss">
.toast {
  position: fixed;
  right: 20px;
  top: 20px;
  display: flex;
  flex-flow: column;

  z-index: 99;
  .message {
    padding: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: 1px solid;
    border-radius: 5px;
    margin-bottom: 0.5rem;
  }
  .message.info {
    color: white;
    border-color: dodgerblue;
    background-color: dodgerblue;
  }
  .message.error {
    color: white;
    border-color: crimson;
    background: hsla(4, 90%, 58%, 1);
  }
  .message.success {
    color: white;
    border-color: green;
    background-color: green;
  }
  .message.warning {
    color: white;
    border-color: yellowgreen;
    background-color: yellow;
  }

  .toast-enter-active, .toast-leave-active {
    transition: all 1s;
  }
  .toast-enter, .toast-leave-to {
    opacity: 0;
    //transform: translateY(30px);
  }
  .toast-move {
    transition: transform 1s;
  }
}

</style>
