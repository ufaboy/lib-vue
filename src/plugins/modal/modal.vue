<template>
  <div class="modal-wrap" :class="{active: showDialog}" @click="hide">
    <div class="modal" :style="styleObject"  v-if="showDialog" @click.stop="">
      <slot :data-props="options"></slot>
    </div>

<!--    <dialog :id="name" class="dialog" :style="styleObject"><slot v-if="showDialog"></slot></dialog>-->
  </div>

</template>

<script>
export default {
  name: "modal",
  components: {},
  props: {
    name: {
      type: String,
      default: 'modal'
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data: () => ({
    showDialog: false,
    options: {}
  }),
  computed: {
    styleObject() {
      return {width: `${this.width ? this.width : 600}px`}
    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    show(options = {}) {
      this.options = options
      this.showDialog = true
    },
    hide() {
      this.showDialog = false
    }
  },
}
</script>

<style lang="scss">
.modal-wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
  .modal {
    position: absolute;
    margin: auto;
    height: fit-content;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    animation-name: zoomIn;
    animation-duration: 0.5s;
    animation-fill-mode: both;
  }
  /*the animation definition*/
  @-webkit-keyframes zoomIn {
    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3)
    }
    50% {
      opacity: 1
    }
  }
  @keyframes zoomIn {
    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      -ms-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3)
    }
    50% {
      opacity: 1
    }
  }
}
.modal-wrap.active {
  z-index: 30;
}

.dialog {
  margin: auto;
}
@media only screen and (max-width: 892px) and (orientation: landscape) {
  .dialog, .modal {
    width: 400px!important;
  }
}
@media only screen and (max-width: 892px) and (orientation: portrait) {
  .dialog, .modal {
    width: 100%!important;
  }
}
</style>
