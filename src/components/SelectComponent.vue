<template>
  <div class="selectWrapper">
    <select class="selectNative js-selectNative" aria-labelledby="jobLabel">
      <option value="sel" disabled="" selected=""> Select role...</option>
      <template v-if="group">
        <optgroup :label="group[label]" v-for="(group, index) of options" :key="`${trackBy}-${index}`" >
          <option v-for="(option, index) of group" :key="`option-${index}`" :value="option">
            <slot name="option">{{option[label]}}</slot>
          </option>
        </optgroup>
      </template>
      <template v-else>
        <option v-for="(option, index) of options" :key="`${trackBy}-${index}`" :value="option">
          <slot name="option">{{option[label]}}</slot>
        </option>
      </template>
    </select>

    <!-- Hide the custom select from AT (e.g. SR) using aria-hidden -->
    <div class="selectCustom js-selectCustom" aria-hidden="true">
      <div class="selectCustom-trigger">Select role...</div>
      <div class="selectCustom-options">
        <div class="selectCustom-option" data-value="ds">UI/UX Designer</div>
        <div class="selectCustom-option" data-value="fe">Frontend Engineer</div>
        <div class="selectCustom-option" data-value="be">Backend Engineer</div>
        <div class="selectCustom-option" data-value="qa">QA Engineer</div>
        <div class="selectCustom-option" data-value="un">Unicorn</div>
      </div>
    </div>
  </div>
</template>

<script>
// https://web-standards.ru/articles/native-and-custom-select/
export default {
  name: "SelectComponent",
  props: {
    options: {
      type: Array,
      default(){
        return [{name: 'UI/UX Designer', value: 'ds'},{name: 'Frontend Engineer', value: 'fe'},{name: 'Backend Engineer', value: 'be'},{name: 'QA Engineer', value: 'qa'},{name: 'Unicorn', value: 'un'},]
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
  data(){
    return {
      selectCustomActive: false,

      elSelectNative: null,
      elSelectCustom: null,
      elSelectCustomBox: null,
      elSelectCustomOpts: null,
      customOptsList: null,
      optionsCount: null,
      defaultLabel: null,
      optionChecked: '',
      optionHoveredIndex: -1
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
      this.customOptsList = Array.from(this.elSelectCustomOpts.children);
      this.optionsCount = this.customOptsList.length;
      this.defaultLabel = this.elSelectCustomBox.getAttribute("data-value");
    },
    openSelectCustom() {
  elSelectCustom.classList.add("isActive");
  // Remove aria-hidden in case this was opened by a user
  // who uses AT (e.g. Screen Reader) and a mouse at the same time.
  elSelectCustom.setAttribute("aria-hidden", false);

  if (optionChecked) {
    const optionCheckedIndex = customOptsList.findIndex(
        (el) => el.getAttribute("data-value") === optionChecked
    );
    updateCustomSelectHovered(optionCheckedIndex);
  }

  // Add related event listeners
  document.addEventListener("click", watchClickOutside);
  document.addEventListener("keydown", supportKeyboardNavigation);
},

closeSelectCustom() {
  elSelectCustom.classList.remove("isActive");

  elSelectCustom.setAttribute("aria-hidden", true);

  updateCustomSelectHovered(-1);

  // Remove related event listeners
  document.removeEventListener("click", watchClickOutside);
  document.removeEventListener("keydown", supportKeyboardNavigation);
},

updateCustomSelectHovered(newIndex) {
  const prevOption = elSelectCustomOpts.children[optionHoveredIndex];
  const option = elSelectCustomOpts.children[newIndex];

  if (prevOption) {
    prevOption.classList.remove("isHover");
  }
  if (option) {
    option.classList.add("isHover");
  }

  optionHoveredIndex = newIndex;
},

updateCustomSelectChecked(value, text) {
  const prevValue = optionChecked;

  const elPrevOption = elSelectCustomOpts.querySelector(
      `[data-value="${prevValue}"`
  );
  const elOption = elSelectCustomOpts.querySelector(`[data-value="${value}"`);

  if (elPrevOption) {
    elPrevOption.classList.remove("isActive");
  }

  if (elOption) {
    elOption.classList.add("isActive");
  }

  elSelectCustomBox.textContent = text;
  optionChecked = value;
},

watchClickOutside(e) {
  const didClickedOutside = !elSelectCustom.contains(event.target);
  if (didClickedOutside) {
    closeSelectCustom();
  }
},

supportKeyboardNavigation(e) {
  // press down -> go next
  if (event.keyCode === 40 && optionHoveredIndex < optionsCount - 1) {
    let index = optionHoveredIndex;
    e.preventDefault(); // prevent page scrolling
    updateCustomSelectHovered(optionHoveredIndex + 1);
  }

  // press up -> go previous
  if (event.keyCode === 38 && optionHoveredIndex > 0) {
    e.preventDefault(); // prevent page scrolling
    updateCustomSelectHovered(optionHoveredIndex - 1);
  }

  // press Enter or space -> select the option
  if (event.keyCode === 13 || event.keyCode === 32) {
    e.preventDefault();

    const option = elSelectCustomOpts.children[optionHoveredIndex];
    const value = option && option.getAttribute("data-value");

    if (value) {
      elSelectNative.value = value;
      updateCustomSelectChecked(value, option.textContent);
    }
    closeSelectCustom();
  }

  // press ESC -> close selectCustom
  if (event.keyCode === 27) {
    closeSelectCustom();
  }
},
  },


// Toggle custom select visibility when clicking the box
  elSelectCustomBox.addEventListener("click", (e) => {
    const isClosed = !elSelectCustom.classList.contains("isActive");

    if (isClosed) {
      openSelectCustom();
    } else {
      closeSelectCustom();
    }
  });



// Update selectCustom value when selectNative is changed.
elSelectNative.addEventListener("change", (e) => {
  const value = e.target.value;
  const elRespectiveCustomOption = elSelectCustomOpts.querySelectorAll(
      `[data-value="${value}"]`
  )[0];

  updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
});

// Update selectCustom value when an option is clicked or hovered
customOptsList.forEach(function (elOption, index) {
  elOption.addEventListener("click", (e) => {
    const value = e.target.getAttribute("data-value");

    // Sync native select to have the same value
    elSelectNative.value = value;
    updateCustomSelectChecked(value, e.target.textContent);
    closeSelectCustom();
  });

  elOption.addEventListener("mouseenter", (e) => {
    updateCustomSelectHovered(index);
  });

  // TODO: Toggle these event listeners based on selectCustom visibility
});
}
</script>

<style scoped lang="scss">
.selectWrapper {
  position: relative;
  // Both native and custom selects must have the same width/height.
  .selectNative,
  .selectCustom {
    position: relative;
    width: 22rem;
    height: 4rem;
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
    font-size: 1.6rem;
    background-color: #fff;
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
    background-color: #fff;
    padding: 0.8rem 0.8rem;
    cursor: pointer;
  }

  .selectCustom-trigger::after {
    content: "▾";
    position: absolute;
    top: 0;
    line-height: 3.8rem;
    right: 0.8rem;
  }

  .selectCustom-trigger:hover {
    border-color: #8c00ff;
  }

  .selectCustom-options {
    position: absolute;
    top: calc(3.8rem + 0.8rem);
    left: 0;
    width: 100%;
    border: 1px solid #6f6f6f;
    border-radius: 0.4rem;
    background-color: #fff;
    box-shadow: 0 0 4px #e9e1f8;
    z-index: 1;
    padding: 0.8rem 0;
    display: none;
  }

  .selectCustom.isActive .selectCustom-options {
    display: block;
  }

  .selectCustom-option {
    position: relative;
    padding: 0.8rem;
    padding-left: 2.5rem;
  }

  .selectCustom-option.isHover,
  .selectCustom-option:hover {
    background-color: #865bd7; // contrast AA
    color: white;
    cursor: default;
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

  html {
    font-size: 62.5%;
  }
  body {
    background: #f8f3ef;
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
    color: #343434;
    line-height: 1.5;
    font-size: 1.6rem;
    min-height: 120vh; /* using arrow keys in the select, does not scroll the page */
  }

  body * {
    box-sizing: inherit;
  }

  strong {
    font-weight: 600;
  }

  .title {
    font-size: 2rem;
    font-weight: 600;
    margin: 1.6rem;
    line-height: 1.2;
    text-align: center;
  }

  .link {
    display: inline-block;
    color: inherit;
    text-decoration-color: #9b78de;
    padding: 0.1rem 0.2rem;
    transform: translateX(-0.1em);
    margin-right: -0.1em;

    &:hover {
      color: #8c00ff;
    }

    &:focus {
      outline: none;
      background-color: #e9e1f8;
    }
  }
}
</style>