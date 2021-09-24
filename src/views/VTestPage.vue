<template>
  <div class="test">
    <ul>
      <li></li>
    </ul>
    <select-component label="name"></select-component>
    <button>button</button>
  </div>
</template>

<script>
import SelectComponent from "../components/SelectComponent";
export default {
  name: "TestPage",
  components: {SelectComponent},
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  created() {
    document.title = 'Test';
  },
  mounted() {
  },
  methods: {},
}
</script>

<style scoped>

</style>