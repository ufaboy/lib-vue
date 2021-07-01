<template>
  <canvas id="canvas"></canvas>
</template>

<script>
export default {
  name: "CanvasSpace",
  props: {
    countDots: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1
    },
  },
  methods: {
    generateCanvas() {
      let fps = 60,
          interval = 1000 / fps,
          lastTime = (new Date()).getTime(),
          currentTime = 0,
          delta = 0;

      let stars = [],
          starsCount = this.countDots,
          starsMinSpeed = 0.01,
          // starsMaxSpeed = 0.05,
          starsSpeed = starsMinSpeed;



      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');

      function init() {
        window.onresize();
        window.requestAnimationFrame(render);
      }

      window.onresize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.fillStyle = "white";
        context.strokeStyle = "white";
        context.translate(canvas.width / 2, canvas.height /2);
      };


      class Star {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = this.random(-canvas.width / 2, canvas.width / 2);
          this.y = this.random(-canvas.height / 2, canvas.height / 2);
          this.z = 0;
          this.origX = this.x;
          this.origY = this.y;
        }

        random(min, max) {
          return min + Math.random() * (max - min);
        }

        update() {
          this.origX = this.x;
          this.origY = this.y;
          this.z += starsSpeed;
          this.x += this.x * this.z * starsSpeed;
          this.y += this.y * this.z * starsSpeed;
        }

        draw() {
          context.lineWidth = this.z;
          context.beginPath();
          context.moveTo(this.x, this.y);
          context.lineTo(this.origX, this.origY);
          context.stroke();
        }
      }

      function update() {
        for(var i = 0; i < stars.length; i++) {
          let star = stars[i];
          star.update();

          if(
              star.x - star.z > canvas.width / 2 ||
              star.x + star.z < -canvas.width / 2 ||
              star.y - star.z > canvas.height / 2 ||
              star.y + star.z < -canvas.height / 2
          ) {
            star.reset();
          }
        }

        if(stars.length < starsCount)
          stars.push(new Star());
      }

      function draw() {
        for(var i = 0; i < stars.length; i++) {
          stars[i].draw();
        }
      }

      function clear() {
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      }

      function render() {
        currentTime = (new Date()).getTime();
        delta = currentTime - lastTime;

        if(delta > interval) {

          update();

          clear();
          draw();

          lastTime = currentTime - (delta % interval);
        }

        window.requestAnimationFrame(() => {
          render();
        });
      }
      init();
      // (function gui() {
      //   let gui = new dat.GUI();
      //
      //   let f1 = gui.addFolder('Stars');
      //   let starCountGUI = f1.add(this, 'starsCount', 1, starsCount * 2).name('Count');
      //   starCountGUI.onChange(() => { stars = []; });
      //   f1.add(this, 'starsSpeed', starsMinSpeed, starsMaxSpeed).name('Speed');
      //   f1.open();
      // })();
    },
  },
  mounted() {
    this.generateCanvas()
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
//background: #020120;
  background: transparent;
}
</style>