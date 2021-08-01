<template>
  <div class="toggle day-night-toggle">
    <input type="checkbox" id="day-night-toggle" class="toggle--checkbox" v-model="theme">
    <label class="toggle--btn" for="day-night-toggle"><span class="toggle--feature"></span></label>
  </div>
</template>

<script>
export default {
  name: "ButtonDayNight",
  props: {
    themeValue: {
      type: String,
      default: 'day'
    }
  },
  emits: ['change-theme'],
  computed: {
    theme: {
      get() {
        return this.themeValue === 'day'
      },
      set(newValue) {
        this.$emit('change-theme', newValue ? 'day' : 'night')
      }
    }
  },
  methods: {
    changeTheme() {
      this.$emit('changeTheme', )
    }
  }
}
</script>

<style scoped>
.toggle--checkbox {
  display: none;
}

.toggle--btn {
  display: block;
  margin: 0 auto;
  font-size: 1.4em;
  transition: all 350ms ease-in;
}
.toggle--btn:hover {
  cursor: pointer;
}

.toggle--btn, .toggle--btn:before, .toggle--btn:after,
.toggle--checkbox,
.toggle--checkbox:before,
.toggle--checkbox:after,
.toggle--feature,
.toggle--feature:before,
.toggle--feature:after {
  transition: all 250ms ease-in;
}
.toggle--btn:before, .toggle--btn:after,
.toggle--checkbox:before,
.toggle--checkbox:after,
.toggle--feature:before,
.toggle--feature:after {
  content: '';
  display: block;
}

/* ===================================================
   Day/Night and Gender toggle buttons
   =================================================== */
.day-night-toggle .toggle--btn,
.toggle--like .toggle--btn {
  position: relative;
  height: 36px;
  width: 75px;
  border-radius: 30px;
}
.day-night-toggle .toggle--btn:before,
.toggle--like .toggle--btn:before {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.day-night-toggle .toggle--btn {
  border: 3px solid #1c1c1c;
  background-color: #3c4145;
}
.day-night-toggle .toggle--btn:before {
  background-color: #fff;
  border: 3px solid #e3e3c7;
}
.day-night-toggle .toggle--btn:after {
  position: absolute;
  top: 52%;
  left: 25px;
  z-index: 10;
  width: 9px;
  height: 9px;
  opacity: 0;
  background-color: #fff;
  border-radius: 50%;
  box-shadow:
      #fff 0 0,
      #fff 3px 0,
      #fff 6px 0,
      #fff 9px 0,
      #fff 11px 0,
      #fff 14px 0,
      #fff 16px 0,
      #fff 19px -1px 0 1px,
      #fff 15px -7px 0 -1px,
      #fff 7px -7px 0 1px,
      #d3d3d3 0 0 0 4px,
      #d3d3d3 6px 0 0 4px,
      #d3d3d3 11px 0 0 4px,
      #d3d3d3 16px 0 0 4px,
      #d3d3d3 19px -1px 0 5px,
      #d3d3d3 15px -7px 0 2px,
      #d3d3d3 7px -7px 0 5px;
  transition: opacity 100ms ease-in;
}
@keyframes starry_star {
  50% {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow:
        #ffffffff 15px -4px 0 -0.5px,
        #ffffffff 9px 3px 0 -1.5px,
        #ffffff1a 26px 7px 0 0.5px,
        #ffffffff 21px 15px 0 -0.5px,
        #ffffff1a 13px 10px 0 -1.5px,
        #ffffffff 2px 17px 0 0.5px;
  }
}
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 100;
    transform: scale(1.1);
  }
  55% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    opacity: 100;
    transform: scale(1);
  }
}
.day-night-toggle .toggle--feature {
  display: block;
  position: absolute;
  top: 9px;
  left: 52.5%;
  z-index: 20;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow:
      #ffffff1a 15px -4px 0 -0.5px,
      #ffffff1a 9px 3px 0 -1.5px,
      #ffffffff 26px 7px 0 0.5px,
      #ffffff1a 21px 15px 0 -0.5px,
      #ffffffff 13px 10px 0 -2px,
      #ffffff1a 2px 17px 0 0.5px;
  animation: starry_star 5s ease-in-out infinite;
}
.day-night-toggle .toggle--feature:before {
  position: absolute;
  top: -5px;
  left: -22px;
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #e3e3c7;
  box-shadow:
      #e3e3c7 -14px 0 0 -3px,
      #e3e3c7 -6px 12px 0 -4px;
  transform-origin: -6px 130%;
}
.day-night-toggle .toggle--checkbox:checked + .toggle--btn {
  background-color: #9ee3fb;
  border: 3px solid #86c3d7;
}
.day-night-toggle .toggle--checkbox:checked + .toggle--btn:before {
  left: 40px;
  background-color: #ffdf6d;
  border: 3px solid #e1c348;
}
.day-night-toggle .toggle--checkbox:checked + .toggle--btn:after {
  opacity: 100;
  animation-name: bounceIn;
  animation-duration: 0.60s;
  animation-delay: 0.10s;
  animation-fill-mode: backwards;
  animation-timing-function: ease-in-out;
}
.day-night-toggle .toggle--checkbox:checked + .toggle--btn > .toggle--feature {
  opacity: 0;
  box-shadow:
      #ffffff1a 15px -4px 0 -4px,
      #ffffff1a 9px 3px 0 -5px,
      #ffffffff 26px 7px 0 -3px,
      #ffffff1a 21px 15px 0 -4px,
      #ffffffff 13px 10px 0 -5.5px,
      #ffffff1a 2px 17px 0 -3px;
  animation: none;
}
.day-night-toggle .toggle--checkbox:checked + .toggle--btn > .toggle--feature:before {
  left: 25px;
  transform: rotate(70deg);
}
</style>