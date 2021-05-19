<template>
<div class="home">
  <ul>
    <li v-for="genre of parentsArr" :key="genre.id">{{genre.name}}</li>
  </ul>
</div>
</template>

<script>
import parents from '@/models/parents'
export default {
  name: 'Home',
  head() {
    return {
      title: 'Home',
    };
  },
  components: {},
  props: {},
  data: () => ({
    parentsArr: []
  }),
  methods: {

  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    console.log({'home': parents.items})
    this.parentsArr = parents.items
    // console.log({'store': this.$store.state.genre.items})
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.general {
  height: calc(100% - 4.5rem);
}
</style>