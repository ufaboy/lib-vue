<template>
  <div class="media-manager">
    {{mediaFiles}}
  </div>
</template>

<script>
import useMedia from "../composables/useMedia";
export default {
  name: "VMedia",
  components: {},
  props: {},
  emits: [],
  setup() {
    const {mediaFiles, getMediaFiles} = useMedia()
    getMediaFiles()
    console.log({mediaFiles: mediaFiles})
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {},
}
</script>

<style scoped>

</style>