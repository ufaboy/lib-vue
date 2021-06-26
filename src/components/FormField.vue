<template>
  <label class="ml" @focusin="focused = true"
         @focusout="focused = false">
    <slot name="header" v-if="focused">
      <span class="ml-head" >{{ placeholder }}</span>
    </slot>
    <slot ></slot>
  </label>
</template>

<script>
export default {
  name: "FormField",
  components: {},
  props: {
    placeholder: String,
  },
  data: () => ({
    focused: false
  }),
  methods: {},
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.ml {
  display: flex;
  position: relative;
  padding: 5px;
  width: 100%;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.ml-head {
  position: absolute;
  top: -13px;
  left: 13px;
  padding: 0 3px;
  background-color: var(--surface2);
  border-radius: 5px;
}


</style>