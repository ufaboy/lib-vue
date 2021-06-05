<template>
    <transition-group name="toast" tag="div" class="toast">
      <span class="message" :class="classObject" v-for="(text, index) of messageArray" :key="index + Date.now()" v-html="text"></span>
    </transition-group>
</template>

<script>
export default {
  name: "ToasterModule",
  data: () => ({
    type: '',
    messageArray: []
  }),
  computed: {
    classObject: function () {
      return {
        info: this.type === 'info',
        error: this.type === 'error',
        success: this.type === 'success',
        warning: this.type === 'warning',
      }
    }
  },
  created() {
  },
  watch: {
  },
  methods: {
    printMessage(message, option) {
      const {time, type} = {...option}
      this.type = type
      if (Array.isArray(message)) {
        console.log({'message': message})
        for (const elem of message) {
          this.messageArray.push(elem)
        }
        setTimeout(()=>{
          for (const elem of message) {
            const index = this.messageArray.findIndex(item => item === elem);
            this.messageArray.splice(index, 1)
          }

        }, time)
      } else if (typeof(message) === 'string') {
        this.messageArray.push(message)
        // let index = this.messageArray.length
        setTimeout(()=>{
          const index = this.messageArray.findIndex(item => item === message);
            this.messageArray.splice(index, 1)
          }, time)
      } else if (message === null) {
        this.messageArray.length = 0
      } else if (typeof message === 'object' && message.message) {
        this.messageArray.push(message.message)
        setTimeout(()=>{
          const index = this.messageArray.findIndex(item => item === message.message);
          this.messageArray.splice(index, 1)
        }, time)
      }

    }
  }
}
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
