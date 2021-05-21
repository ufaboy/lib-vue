<template>
  <div id="ring" class="ring" :class="{'over-top': progress}">
    <div class="loader-ring">
      <svg :height="radius * 2"
           :width="radius * 2">
        <circle
          stroke="#018786"
          :stroke-dasharray="circumference + ' ' + circumference"
          :style="{ strokeDashoffset: strokeDashoffset }"
          :stroke-width="stroke"
          fill="transparent"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
      </svg>
      <span class="progress">{{ progress }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressRing",
  components: {},
  props: {
    radius: Number,
    progress: Number,
    stroke: Number
  },
  data: () => ({
  }),
  computed: {
    strokeDashoffset() {
      return this.circumference - this.progress / 100 * this.circumference;
    },
    normalizedRadius() {
      return this.radius - this.stroke * 2;
    },
    circumference() {
      return this.normalizedRadius * 2 * Math.PI
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss">
//.loader {
//  position: fixed;
//  top: 0;
//  left: 0;
//  width: 100%;
//  height: 100%;
//  background: transparent;
//  display: flex;
//  align-items: center;
//  justify-content: center;
//  z-index: -1;
//}
.ring {
  position: absolute;
}
.ring.over-top {
  z-index: 10;
}
.loader-ring {
  position: relative;

  .progress {
    color: #018786;
    position: absolute;
    top: 50px;
    width: 100%;
    left: 0;
    text-align: center;
  }
}
</style>
