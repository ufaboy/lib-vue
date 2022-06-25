<template>
  <div class="multi-radio-toggle multi-radio-toggle--three">
    <input type="radio" id="mt-first2" name="toggle_option2" :value="false" :checked="modelValue === false" @input="inputHandler">
    <input type="radio" id="mt-second2" name="toggle_option2" :value="null" :checked="modelValue === null" @input="inputHandler">
    <input type="radio" id="mt-third2" name="toggle_option2" :value="true" :checked="modelValue === true" @input="inputHandler">
    <label for="mt-first2" class="multi-radio-toggle__label"><p>Off</p></label>
    <label for="mt-second2" class="multi-radio-toggle__label multi-radio-toggle__label--align-bottom"><p>AD</p></label>
    <label for="mt-third2" class="multi-radio-toggle__label"><p>On</p></label>
    <div class="multi-radio-toggle__slide-bg"></div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

interface Props {
  modelValue: boolean|null
}
const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function inputHandler(event:Event) {
  const eventValue = (event.target as HTMLInputElement).value
  emit('update:modelValue', eventValue === 'true' ? true : eventValue === 'false' ? false : null)
}

</script>

<style lang="scss">
.multi-radio-toggle{
  position:relative;
  background: #eee;
  //margin: 20px auto 80px;
  padding: 0 !important;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 30px;
  box-shadow:inset 1px 1px 4px rgba(0, 0, 0, 0);
}
.multi-radio-toggle--three{
  width: 90px;
}
.multi-radio-toggle__label p{
  display:block;
  margin:0;
  line-height: 30px;
  font-size: 16px;
}

.multi-radio-toggle__label{
  position:absolute;
  z-index:99;
}
/* first pos */
.multi-radio-toggle__label:nth-of-type(1){
  left: -38px;
  width: 60px;
  text-align:left;
}

/* center */
.multi-radio-toggle--three .multi-radio-toggle__label:nth-of-type(2){
  text-align:center;
  width: 40px;
  left: 50%;
  margin-left: -20px;
}

/* last pos */
.multi-radio-toggle--two .multi-radio-toggle__label:nth-of-type(2),
.multi-radio-toggle--three .multi-radio-toggle__label:nth-of-type(3) {
  right: -32px;
  text-align:right;
  width: 60px;
}

.multi-radio-toggle__label--align-bottom p{
  display:block;
  margin-top: 30px;
}

.multi-radio-toggle > * {
  float: left;
}

.multi-radio-toggle input[type=radio]{
  display: none;
}

.multi-radio-toggle__label{
  width: 30px;
  height: 30px;
  margin: 0;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  cursor: pointer;
  z-index: 1;
  text-align: center;
}

.multi-radio-toggle__slide-bg{
  width: 30px;
  height: 30px;
  position: absolute;
  border-radius: 50%;
  transition: all .4s ease;
}

.multi-radio-toggle input:checked ~ .multi-radio-toggle__slide-bg{
  background: #009688;
}

.multi-radio-toggle input:nth-child(1):checked ~ .multi-radio-toggle__slide-bg{
  left: 0;
}

.multi-radio-toggle input:nth-child(2):checked ~ .multi-radio-toggle__slide-bg{
  left: 30px;
}

.multi-radio-toggle input:nth-child(3):checked ~ .multi-radio-toggle__slide-bg{
  left: 60px;
}
</style>