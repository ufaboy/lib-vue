<template>
  <div class="selectWrapper">
    <select class="selectNative js-selectNative" aria-labelledby="jobLabel" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)">
      <option value="sel" disabled="" selected=""> Select role...</option>
      <template v-if="group">
        <optgroup :label="group[label]" v-for="(group, index) of options" :key="`${trackBy}-${index}`">
          <option v-for="(option, index) of group" :key="`option-${index}`" :value="option">
            <slot name="option">{{ option[label] }}</slot>
          </option>
        </optgroup>
      </template>
      <template v-else>
        <option v-for="(option, index) of options" :key="`${trackBy}-${index}`" :value="option">
          <slot name="option">{{ option[label] }}</slot>
        </option>
      </template>
    </select>

    <!-- Hide the custom select from AT (e.g. SR) using aria-hidden -->
    <div ref="selectCustom" class="selectCustom js-selectCustom" :class="{'isActive': activeCustomSelect}"
         aria-hidden="true" @click="toggleCustomSelect">
      <div class="selectCustom-trigger">
        <slot name="default-option">{{selected ? selected[label] : 'Select role...'}}</slot>
      </div>
      <div class="selectCustom-options">
        <div class="selectCustom-option" :class="{'isHover': optionHoveredIndex === index}" v-for="(option, index) of options"
             :key="`option-${index}`"
             :data-value="index"
             @click.stop="selectCustomOption(option, index, $event.target)"
             @mouseenter="updateCustomSelectHovered(index)">
          <slot name="option">{{ option[label] }}</slot>
        </div>
        <!--        <div class="selectCustom-option" data-value="ds">UI/UX Designer</div>-->
        <!--        <div class="selectCustom-option" data-value="fe">Frontend Engineer</div>-->
        <!--        <div class="selectCustom-option" data-value="be">Backend Engineer</div>-->
        <!--        <div class="selectCustom-option" data-value="qa">QA Engineer</div>-->
        <!--        <div class="selectCustom-option" data-value="un">Unicorn</div>-->
      </div>
    </div>
  </div>
</template>

<script>
// https://web-standards.ru/articles/native-and-custom-select/
export default {
  name: "SelectComponent",
  props: {
    modelValue: Object,
    options: {
      type: Array,
      default() {
        return [{name: 'UI/UX Designer', value: 'ds'}, {
          name: 'Frontend Engineer',
          value: 'fe'
        }, {name: 'Backend Engineer', value: 'be'}, {name: 'QA Engineer', value: 'qa'}, {name: 'Unicorn', value: 'un'},]
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    group: String,
    trackBy: String,
    label: String,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      activeCustomSelect: false,
      selected: null,
      selectedIndex: null,
      optionHoveredIndex: -1,


      elSelectNative: null,
      elSelectCustom: null,
      elSelectCustomBox: null,
      elSelectCustomOpts: null,
      optionsCount: null,
      defaultLabel: null,
      optionChecked: null,

    }
  },
  created() {
  },
  mounted() {
    this.prepareConsts()
  },
  methods: {
    prepareConsts() {
      this.elSelectNative = document.getElementsByClassName("js-selectNative")[0];
      this.elSelectCustom = document.getElementsByClassName("js-selectCustom")[0];
      this.elSelectCustomBox = this.elSelectCustom.children[0];
      this.elSelectCustomOpts = this.elSelectCustom.children[1];
      this.defaultLabel = this.elSelectCustomBox.getAttribute("data-value");
    },
    selectCustomOption(value, index, element) {
      console.log('selectCustomOption', {value: value, index: index, element: element})

      this.selected = value;
      this.selectedIndex = index;
      this.activeCustomSelect = false
      this.updateCustomSelectChecked(value, element.textContent);

    },
    toggleCustomSelect() {
      if (this.activeCustomSelect) {
        this.activeCustomSelect = false
        this.$refs.selectCustom.setAttribute("aria-hidden", true);
        this.updateCustomSelectHovered(-1);

        // Remove related event listeners
        document.removeEventListener("click", this.watchClickOutside);
        document.removeEventListener("keydown", this.supportKeyboardNavigation);
      } else {
        this.activeCustomSelect = true
        this.$refs.selectCustom.setAttribute("aria-hidden", false);

        // if (this.optionChecked) {
        //   const optionCheckedIndex = this.options.findIndex(
        //       (el) => el.getAttribute("data-value") === this.optionChecked
        //   );
        //   this.updateCustomSelectHovered(optionCheckedIndex);
        // }

        // Add related event listeners
        document.addEventListener("click", this.watchClickOutside);
        document.addEventListener("keydown", this.supportKeyboardNavigation);
      }
    },

    updateCustomSelectHovered(newIndex) {
      this.optionHoveredIndex = newIndex
    },

    updateCustomSelectChecked(value, text) {
      const prevValue = this.optionChecked;

      const elPrevOption = this.elSelectCustomOpts.querySelector(
          `[data-value="${prevValue}"`
      );
      const elOption = this.elSelectCustomOpts.querySelector(`[data-value="${value}"`);

      if (elPrevOption) {
        elPrevOption.classList.remove("isActive");
      }

      if (elOption) {
        elOption.classList.add("isActive");
      }

      this.elSelectCustomBox.textContent = text;
      this.optionChecked = value;
    },

    watchClickOutside(event) {
      const didClickedOutside = !this.$refs.selectCustom.contains(event.target);
      console.log('watchClickOutside', {selectCustom: this.$refs.selectCustom, didClickedOutside: didClickedOutside, contains: this.$refs.selectCustom.contains(event.target)})
      if (didClickedOutside) {
        this.activeCustomSelect = false;
      }
    },
    goPrevOption() {},
    goNextOption() {},


    supportKeyboardNavigation(event) {
      console.log('supportKeyboardNavigation', {event: event})
      event.preventDefault(); // prevent page scrolling
      if (event.keyCode === 40 && this.optionHoveredIndex < this.options.length - 1) {
        this.updateCustomSelectHovered(this.optionHoveredIndex + 1);
      }
      // press up -> go previous
      if (event.keyCode === 38 && this.optionHoveredIndex > 0) {
        this.updateCustomSelectHovered(this.optionHoveredIndex - 1);
      }

      // press Enter or space -> select the option
      if (event.keyCode === 13 || event.keyCode === 32) {
        const option = this.elSelectCustomOpts.children[this.optionHoveredIndex];
        const value = option && option.getAttribute("data-value");
        if (Number(value)) {
          this.selectedIndex = Number(value);
          this.selected = this.options[Number(value)]
          // updateCustomSelectChecked(value, option.textContent);
        }
        this.activeCustomSelect = false
      }

      // press ESC -> close selectCustom
      if (event.keyCode === 27) {
        this.activeCustomSelect = false
      }
    },
  },

// Update selectCustom value when selectNative is changed.
//   elSelectNative.addEventListener("change", (e) => {
//     const value = e.target.value;
//     const elRespectiveCustomOption = elSelectCustomOpts.querySelectorAll(
//         `[data-value="${value}"]`
//     )[0];
//
//     updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
//   });

// Update selectCustom value when an option is clicked or hovered

}
</script>

<style scoped lang="scss">
.selectWrapper {
  position: relative;
  // Both native and custom selects must have the same width/height.
  .selectNative,
  .selectCustom {
    position: relative;
    width: 100%; //22rem;
    height: 2rem; //4rem;
    background-color: var(--background-on);
  }

  // Make sure the custom select does not mess with the layout
  .selectCustom {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }

  // This media query detects devices where the primary
  // input mechanism can hover over elements. (e.g. computers with a mouse)
  @media (hover: hover) {
    // Since we are using a mouse, it's safe to show the custom select.
    .selectCustom {
      display: block;
    }

    // In a computer using keyboard? Then let's hide back the custom select
    // while the native one is focused:
    .selectNative:focus + .selectCustom {
      display: none;
    }
  }

  /* Add the focus states too, They matter, always! */
  .selectNative:focus,
  .selectCustom.isActive .selectCustom-trigger {
    outline: none;
    box-shadow: white 0 0 0 0.2rem, #ff821f 0 0 0 0.4rem;
  }

  //
  // Rest of the styles to create the custom select.
  // Just make sure the native and the custom have a similar "box" (the trigger).
  //

  .select {

  }

  .selectWrapper {
    position: relative;
  }

  .selectNative,
  .selectCustom-trigger {
    //font-size: 1.6rem;
    //background-color: #fff;
    border: 1px solid #6f6f6f;
    border-radius: 0.4rem;
  }

  .selectNative {
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: 0.8rem;
    padding: 0rem 0.8rem;
  }

  .selectCustom-trigger {
    position: relative;
    width: 100%;
    height: 100%;
    //background-color: #fff;
    padding: 0.4rem;
    cursor: pointer;
  }

  .selectCustom-trigger::after {
    content: "▾";
    position: absolute;
    top: 5px;
    //line-height: 3.8rem;
    right: 0.4rem;
  }

  .selectCustom-trigger:hover {
    border-color: #8c00ff;
  }

  .selectCustom-options {
    color: var(--text);
    position: absolute;
    //top: calc(3.8rem + 0.8rem);
    top: calc(2rem);
    left: 0;
    width: 100%;
    border: 1px solid #6f6f6f;
    border-radius: 0.4rem;
    background-color: var(--background-on);
    box-shadow: 0 0 4px #e9e1f8;
    z-index: 1;
    //padding: 0.8rem 0;
    display: none;
  }

  .selectCustom.isActive .selectCustom-options {
    display: block;
  }

  .selectCustom-option {
    position: relative;
    padding: 0.5rem 1rem;
  }

  .selectCustom-option.isHover,
  .selectCustom-option:hover {
    background-color: #865bd7; // contrast AA
    color: var(--text-primary);
    cursor: pointer;
  }

  .selectCustom-option:not(:last-of-type)::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #d3d3d3;
  }

  .selectCustom-option.isActive::before {
    content: "✓";
    position: absolute;
    left: 0.8rem;
  }

  // ----- Theme styles -----

  //html {
  //  font-size: 62.5%;
  //}
  //
  //body {
  //  background: #f8f3ef;
  //  font-family: Arial, Helvetica, sans-serif;
  //  box-sizing: border-box;
  //  color: #343434;
  //  line-height: 1.5;
  //  font-size: 1.6rem;
  //  min-height: 120vh; /* using arrow keys in the select, does not scroll the page */
  //}
  //
  //body * {
  //  box-sizing: inherit;
  //}
  //
  //strong {
  //  font-weight: 600;
  //}
  //
  //.title {
  //  font-size: 2rem;
  //  font-weight: 600;
  //  margin: 1.6rem;
  //  line-height: 1.2;
  //  text-align: center;
  //}
  //
  //.link {
  //  display: inline-block;
  //  color: inherit;
  //  text-decoration-color: #9b78de;
  //  padding: 0.1rem 0.2rem;
  //  transform: translateX(-0.1em);
  //  margin-right: -0.1em;
  //
  //  &:hover {
  //    color: #8c00ff;
  //  }
  //
  //  &:focus {
  //    outline: none;
  //    background-color: #e9e1f8;
  //  }
  //}
}
</style>