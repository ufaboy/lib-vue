<template>
  <div class="toggle toggle--knob">
    <input type="checkbox" id="toggle--knob" class="toggle--checkbox" :checked="modelValue" @input="updateHandler">
    <label class="toggle--btn" for="toggle--knob">
      <span class="toggle--feature" data-label-on="on" data-label-off="off"></span>
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['submit', 'update:modelValue']);
function updateHandler(event: Event) {
  const data = Number((event.target as HTMLInputElement).checked)
  emit('update:modelValue', !!data)
}
</script>

<style lang="scss" scoped>
/* =====================================================
   Some defaults across all toggle demos
   ===================================================== */
.toggle {
  display: block;
  text-align: center;
  user-select: none;
}
.toggle--checkbox {
  display: none;
}
.toggle--btn {
  display: block;
  margin: 0 auto;
  transition: all 350ms ease-in;

  &:hover {
    cursor: pointer;
  }
}

.toggle--btn,
.toggle--checkbox,
.toggle--feature {
  &,
  &:before,
  &:after {
    transition: all 250ms ease-in;
  }
  &:before,
  &:after {
    content: '';
    display: block;
  }
}

/* =====================================================
   Toggle - knob button style
   ===================================================== */
$toggleHeight: 36px;
$toggleWidth: 100px;

$toggleBtnRadius: 36px;
$toggleBtnColor: #f1f1f1;

$toggle-bgColor--inactive: #a2a2a2;
$toggle-bgColor--active: #a4bf4d;

$toggle-textColor: #fff;

.toggle--knob {

  & .toggle--btn {
    position: relative;
    width: $toggleWidth;
    height: $toggleHeight;

    font-family: 'PT Sans', Sans Serif;
    text-transform: uppercase;
    color: $toggle-textColor;

    background: $toggle-bgColor--inactive;
    box-shadow: inset 0 20px 40px -10px #7e7e7e;
    border-radius: 40px;

    //contains the actual knob part of the button and the 'on' text
    &:before {
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);

      width: $toggleBtnRadius;
      height: $toggleBtnRadius;
      border-radius: 50%;
      background: $toggleBtnColor;
      box-shadow: 0 0 10px 0 #999,
      inset 0 10px 10px 8px rgba($toggleBtnColor, 0.6),
      inset 0 0 8px 0px #333,
      inset 0 0 0 13px #ccc,
      inset 0 0 0 14px $toggleBtnColor;

      text-indent: -100%;
    }
  }

  & .toggle--feature {
    position: relative;
    display: block;
    overflow: hidden;
    height: $toggleHeight;
    text-shadow: 0 1px 2px #666;

    &:before,
    &:after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &:before {
      content: attr(data-label-on);
      left: -60%;
    }
    &:after {
      content: attr(data-label-off);
      right: 20%;
    }
  }

  & .toggle--checkbox {
    &:checked {
      & + .toggle--btn {
        background: $toggle-bgColor--active;
        box-shadow: inset 0 20px 40px -10px #7b9d25;

        &:before { left: 65%; }

        & .toggle--feature {
          &:before	{ left: 20%; }
          &:after		{ right: -60%; }
        }
      }
    }
  }
}
</style>