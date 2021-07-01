<template>
  <div class="test-wrap">
    <slot/>
    <div class="stars" id="stars"></div>
    <div class="moon" ></div>
  </div>
</template>

<script>
export default {
  name: "LayoutTest",
  components: {},
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.generateDots()
  },
  methods: {
    generateDots() {
      let style = document.createElement('style');
      // style.innerHTML = `.cssClass { ${this.createDotsString()}; }`;
      style.innerHTML = `.star-animating { } .star-animating:before { ${this.createDotsString()}; } .star-animating:after { ${this.createDotsString()}; }`;
      document.getElementsByTagName('head')[0].appendChild(style);
      document.getElementById('stars').className = 'star-animating stars';
    },
    createDotsString() {
      const maxDots = document.documentElement.clientHeight > 900 ? 500 : 150;
      const maxW = document.documentElement.clientWidth;
      const maxH = document.documentElement.clientHeight;
      let str = `box-shadow: `
      for (let i = 0; i < maxDots; i++) {
        const rndH = this.randomInteger(0, maxH)
        const rndW = this.randomInteger(0, maxW)
        str += `${i === 0 ? '' : ', '} ${rndW}px ${rndH}px #A1B8D0`
      }
      return str
    },
    randomInteger(min, max) {
      // случайное число от min до (max+1)
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
  },
}
</script>

<style scoped>
.moon {
  height: 100px;
  width: 100px;
  margin: 0 auto;
  position: absolute;
  top: calc(50% - 290px);
  left: calc(50% - 50px);
  clip-path: circle(50px, 50px, 50px);
  border-radius: 50%;
  background: #B5BCC6;
  overflow: hidden;
}
.moon:before, .moon:after {
  border-radius: 50%;
  content: "";
  position: absolute;
  top: -4%;
  left: -4%;
  height: 108%;
  width: 108%;
}
.moon:before {
  background: #04162E;
  box-shadow: inset -10px 0 7px 0px #B5BCC6;
}
.moon:after {
  background: #B5BCC6;
  box-shadow: inset -10px 0 7px 0px #B5BCC6;
}
/* Animation */
@keyframes before-fullmoon {
  0%, 50% {
    opacity: 1;
  }
  50.01%, 100% {
    opacity: 0;
  }
  0%, 24.99% {
    background: #04162E;
  }
  25%, 100% {
    background: #B5BCC6;
  }
  0% {
    box-shadow: inset 0px 0 7px 0px #B5BCC6;
  }
  24.99% {
    box-shadow: inset 55px 0 7px 0px #B5BCC6;
  }
  25% {
    box-shadow: inset 55px 0 7px 0px #04162E;
  }
  50%, 100% {
    box-shadow: inset 0 0 7px 0px #04162E;
  }
  0%, 50%, 100% {
    border-radius: 50%;
  }
  20%, 30% {
    border-radius: 10% 10% 10% 10%/50% 50% 50% 50%;
  }
  25% {
    border-radius: 0;
  }
  0%, 24.99% {
    transform: rotate(0);
  }
  25%, 50%, 100% {
    transform: rotate(180deg);
  }
}
@keyframes after-fullmoon {
  0%, 50% {
    opacity: 0;
  }
  50.01%, 100% {
    opacity: 1;
  }
  0%, 50%, 74.99% {
    background: #B5BCC6;
  }
  75%, 100% {
    background: #04162E;
  }
  0%, 50% {
    box-shadow: inset 0px 0 7px 0px #04162E;
  }
  74.99% {
    box-shadow: inset 55px 0 7px 0px #04162E;
  }
  75% {
    box-shadow: inset 55px 0 7px 0px #B5BCC6;
  }
  100% {
    box-shadow: inset 0 0 7px 0px #B5BCC6;
  }
  0%, 50%, 100% {
    border-radius: 50%;
  }
  70%, 80% {
    border-radius: 10% 10% 10% 10%/50% 50% 50% 50%;
  }
  75% {
    border-radius: 0;
  }
  0%, 50%, 74.99% {
    transform: rotate(0);
  }
  75%, 100% {
    transform: rotate(180deg);
  }
}
.moon:before {
  animation: before-fullmoon linear 5s infinite;
}
.moon:after {
  animation: after-fullmoon linear 5s infinite;
}

@keyframes before-stars {
  0%, 20% {
    opacity: 1;
  }
  20.01%, 40% {
    opacity: 0.8;
  }
  40.01%, 60% {
    opacity: 0.6;
  }
  60.01%, 80% {
    opacity: 0.4;
  }
  80.01%, 100% {
    opacity: 0.1;
  }
}
@keyframes after-stars {
  0%, 20% {
    opacity: 1;
  }
  20.01%, 40% {
    opacity: 0.8;
  }
  40.01%, 60% {
    opacity: 0.6;
  }
  60.01%, 80% {
    opacity: 0.4;
  }
  80.01%, 100% {
    opacity: 0.1;
  }
}
/* stars */
.stars {
  position: absolute;
  width: 1px;
  height: 1px;
  background: transparent;
}
.stars:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 1px;
  background: #A1B8D0;
  animation: before-stars linear 5s infinite alternate;
}
.stars:after {
  content: "";
  position: absolute;
  width: 1px;
  height: 1px;
  background: #A1B8D0;
  animation: after-stars linear 3s infinite alternate;
}
</style>