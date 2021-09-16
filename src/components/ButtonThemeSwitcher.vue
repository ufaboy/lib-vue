<template>
  <fieldset class="switcher">
    <legend class="switcher__legend">Схема</legend>
    <input class="switcher__radio switcher__radio--light" v-model="activeScheme" @click="setScheme('light-theme')" type="radio" name="color-scheme" value="light-theme" aria-label="Светлая">
    <input class="switcher__radio switcher__radio--auto" v-model="activeScheme" @click="setScheme('auto-theme')" type="radio" name="color-scheme" value="auto-theme" aria-label="Системная" checked="">
    <input class="switcher__radio switcher__radio--dark" v-model="activeScheme" @click="setScheme('dark-theme')" type="radio" name="color-scheme" value="dark-theme" aria-label="Тёмная">
    <div class="switcher__status"></div>
  </fieldset>
</template>

<script>
import {ref} from "vue";

export default {
  name: "ButtonThemeSwitcher",
  setup() {
    // const lightStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=light]');
    // const darkStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]');
    const darkSchemeMedia = matchMedia('(prefers-color-scheme: dark)');
    const activeScheme = ref('auto-theme')

    const setupSwitcher = function() {
      const savedScheme = getSavedScheme();
      if (savedScheme !== null) {
        activeScheme.value = savedScheme
        // const currentRadio = document.querySelector(`.switcher__radio[value=${savedScheme}]`);
        // console.log({currentRadio: currentRadio})
        // currentRadio.checked = true;
      }
    }

    function setupScheme() {
      const savedScheme = getSavedScheme();
      const systemScheme = getSystemScheme();

      if (savedScheme === null) return;

      if (savedScheme !== systemScheme) {
        setScheme(savedScheme);
      }
    }

    const setScheme = function(scheme) {
      switchMedia(scheme);

      if (scheme === 'auto-theme') {
        clearScheme();
      } else {
        saveScheme(scheme);
      }
    }

    const switchMedia = function(scheme) {
      let htmlElement = document.documentElement
      htmlElement.setAttribute('color-scheme', scheme)
    }

    const getSystemScheme = function() {
      const darkScheme = darkSchemeMedia.matches;
      return darkScheme ? 'dark-theme' : 'light-theme';
    }

    const getSavedScheme = function() {
      return localStorage.getItem('color-scheme');
    }

    const saveScheme = function(scheme) {
      localStorage.setItem('color-scheme', scheme);
    }

    const clearScheme = function() {
      localStorage.removeItem('color-scheme');
    }

    setupSwitcher();
    setupScheme();

    return {activeScheme, setScheme}
  }
}
</script>

<style scoped lang="scss">
.switcher {
  position: absolute;
  bottom: 36px;
  left: 50%;
  margin: 0;
  margin-left: -50px;
  padding: 2px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border: none;
  input {
    cursor: pointer;
  }
}

/* Switcher Legend */

.switcher__legend {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Switcher Radio */

.switcher__radio {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  width: 32px;
  height: 32px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
  transition: filter 0.1s ease-in;
}

.switcher__radio:focus {
  outline: none;
}

.switcher__radio--light {
  background-image: url('/icons/light.svg');
}

.switcher__radio--auto {
  background-image: url('/icons/auto.svg');
}

.switcher__radio--dark {
  background-image: url('/icons/dark.svg');
}

/* Switcher Status */

.switcher__status {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  box-shadow: 0 0 0 2px rgb(0 0 0 / 0.2);
  border-radius: 18px;
  background-color: rgb(255 255 255 / 0.5);
  background-repeat: no-repeat;
  background-image: url('/icons/status.svg');
  background-size: 32px;
  background-position: center;
  transition: background-position 0.1s ease-in;
}

.switcher__radio:focus-visible ~ .switcher__status {
  box-shadow: 0 0 0 2px black;
}

.switcher__radio--light:checked ~ .switcher__status {
  background-position: left 2px center;
}

.switcher__radio--auto:checked ~ .switcher__status {
  background-position: center center;
}

.switcher__radio--dark:checked ~ .switcher__status {
  background-position: right 2px center;
}

@media (prefers-color-scheme: dark) {
  .switcher__radio {
    filter: invert(1);
  }

  .switcher__radio:checked {
    filter: invert(0);
  }

  .switcher__status {
    filter: invert(1);
  }
}
[color-scheme="dark-theme"] {
  .switcher__radio {
    filter: invert(1);
  }

  .switcher__radio:checked {
    filter: invert(0);
  }

  .switcher__status {
    filter: invert(1);
  }
}
[color-scheme="light-theme"] {
  .switcher__radio {
    filter: invert(0);
  }

  .switcher__radio:checked {
    filter: invert(1);
  }

  .switcher__status {
    filter: invert(0);
  }
}

</style>