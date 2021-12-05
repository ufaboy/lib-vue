<template>
  <div class="toast">
      <div class="message check" v-if="type === 'check'">
        <IconCheck class="color" /> &nbsp; &nbsp;
        <span class="message-text">{{message}}</span>
      </div>

      <div class="message info" v-if="type === 'info'">
        <IconInfo class="spin" />
        &nbsp; &nbsp;
        <span class="message-text">{{message}}</span>
      </div>

      <div class="message warning" v-if="type === 'warning'">
        <IconWarning class="rotate" />
        &nbsp; &nbsp;
        <span class="message-text">{{message}}</span>
      </div>

      <div class="message danger" v-if="type === 'danger'">
        <IconDanger class="shine" />
        &nbsp; &nbsp;
        <span class="message-text">{{message}}</span>
      </div>
  </div>

</template>

<script setup lang="ts">
import {computed} from "vue";
import IconCheck from "./icons/IconCheck.vue";
import IconInfo from "./icons/IconInfo.vue";
import IconWarning from "./icons/IconWarning.vue";
import IconDanger from "./icons/IconDanger.vue";

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
    border-radius: 5px;
    text-align: left;
    display: flex;
    align-items: center;
    padding: 10px;
    cursor:pointer;
    margin: 20px;
    background-color: #2B3246;
    box-shadow:  9px 9px 18px #262c3e, -9px -9px 18px #30384e;
    .message-text {
      display: flex;
      font-size: 24px;
      align-items: center;
      height: 36px;
    }
  }
  .check {
    color: #0ad406;
    svg {
      fill: #0ad406;
    }
  }
  .check:hover{
    background-color: rgba(147, 209, 117, 0.50);
    transition:0.5s;
  }

  .color {
    animation: color 2s linear infinite;
  }


  .info {
    color: rgb(82, 125, 243);
    svg {
      fill: rgb(82, 125, 243);
    }
  }

  .spin {
    animation: spin 2s linear infinite;
  }

  .info:hover
  {
    background-color: rgba(82, 125, 243, 0.50);
    transition:0.5s;
  }

  .warning {
    svg {
      fill: rgb(247, 149, 72);
    }
    color: rgb(247, 149, 72);
  }

  .warning:hover{
    background-color: rgba(247, 149, 73, 0.50);
    transition:0.5s;
  }


  .rotate {
    animation: rotate 2s linear infinite;
  }
  .danger {
    svg {
      fill: rgb(255, 10, 1);
    }
    color: rgb(255, 10, 1);
  }

  .danger:hover
  {
    background-color: rgba(255, 10, 1, 0.33);
    transition:0.5s;
  }


  .shine {
    animation: shine 2s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes color {
    50% {
      color: #2B3246;
      fill: #2B3246;
    }
    100% {
      color: #0ad406;
      fill: #0ad406;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    20% {
      transform: rotate(90deg);
    }
    40% {
      transform: rotate(0deg);
    }
    80% {
      transform: rotate(-90deg);
    }
  }

  @keyframes shine {
    0% {
      color: #2B3246;
        fill: #2B3246;
    }
    50% {
      text-shadow:
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 40px red,
          0 0 60px red,
          0 0 80px red;
    }
  }
}

</style>
