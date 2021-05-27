<template>
  <div class="modal">
    <dialog :id="name" class="dialog" :style="styleObject"><slot v-if="showDialog"></slot></dialog>
  </div>

</template>

<script>
export default {
  name: "modal",
  components: {},
//mixins: {},
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
    md() {
      const x = `#${this.name}`
      return document.querySelector(x)
    },
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
    // show() {
    //   this.showDialog = true
    //   this.md.showModal()
    // },
    // close() {
    //   this.showDialog = false
    //   this.md.close()
    // },

  },
}
</script>

<style lang="scss">
.dialog {
  margin: auto;
}
@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: landscape) {
  .dialog {
    width: 400px;
  }
}
@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: portrait) {
  .dialog {
    width: 100%;
  }
}
</style>
