<template>
  <div class="image-slider">
    <button class="close-btn" type="reset" @click="closeSlider">
      <base-icon width="36" height="36">
        <icon-close class="icon"/>
      </base-icon>
    </button>
    <img class="image" :src="activeImage.url" alt="image">
    <footer id="sliderFooter" class="footer" ref="sliderFooter">
      <img class="footer-image" :class="{active: activeImageIndex === index}" :src="image.url" alt="image"
           v-for="(image, index) of images" :key="index"
           :ref="setImageRef"
           @click="openImage(image.id, index)">
    </footer>
  </div>
</template>

<script setup>
import BaseIcon from "./BaseIcon";
import IconClose from "./icons/IconClose";
import {computed, onBeforeUnmount, onBeforeUpdate} from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  activeImageIndex: Number,
  rawImages: Array
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['select-image']);
const apiUrl = process.env.VUE_APP_API_URL;

let images = [];
let imagesRefs = [];
const activeImage = computed(() => {
  return Number.isInteger(props.activeImageIndex) ? images[props.activeImageIndex] : images[0]
});

function openImage(id) {
  const index = images.findIndex(file => file.id === id)
  emit('select-image', index)
  scrollFooter(index)
}

function calcImages() {
  images = props.rawImages.map(image => {
    return {...image, url: getSrcImgUrl(image)}
  })
}

function getSrcImgUrl(e) {
  return e.url ? `${apiUrl}/${e.url}` : ''
}

function closeSlider() {
  emit('select-image', null)
}

function keyPressHandler(e) {
  switch (e.key) {
    case 'Escape':
      closeSlider();
      break;
    case 'ArrowUp':
      moveFirst()
      break;
    case 'ArrowRight':
      moveNext();
      break;
    case 'ArrowDown':
      moveLast()
      break;
    case 'ArrowLeft':
      movePrev()
      break;
  }
}

function moveFirst() {
  emit('select-image', 0)
  document.getElementById('sliderFooter').scrollTo(0, 0)
}

function moveNext() {
  const index = props.activeImageIndex < images.length - 1 ? props.activeImageIndex + 1 : 0
  emit('select-image', index)
  scrollFooter(index)
}

function moveLast() {
  const index = images.length - 1
  const footerElement = document.getElementById('sliderFooter')
  emit('select-image', index)
  const lastPoint = footerElement.offsetWidth
  footerElement.scrollTo(lastPoint, 0)
}

function movePrev() {
  const index = props.activeImageIndex > 0 ? props.activeImageIndex - 1 : images.length - 1
  emit('select-image', index)
  scrollFooter(index)
}

function setImageRef(el) {
  if (el) {
    imagesRefs.push(el)
  }
}

function scrollFooter(index) {
  imagesRefs[index].scrollIntoView({inline: "center", behavior: "smooth"})
}

calcImages();
document.getElementById('app').classList.add('no-scroll')
window.addEventListener('keydown', keyPressHandler, {passive: true})

onBeforeUpdate(() => {
  imagesRefs = []
})
onBeforeUnmount(() => {
  document.getElementById('app').classList.remove('no-scroll')
  window.removeEventListener('keypress', keyPressHandler, {passive: true})
})
</script>

<style lang="scss">
.image-slider {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 1rem 1rem 0 1rem;
  display: flex;
  justify-content: center;
  background-color: hsla(0, 0%, 20%, 0.9);

  .close-btn {
    position: absolute;
    right: 2rem;
    top: 2rem;

    .icon {
      fill: red;
    }
  }

  .image {
    height: 83vh;
  }

  .footer {
    height: 12vh;
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    padding: 0 1rem;
    overflow-x: auto;

    .footer-image {
      max-height: 100%;
      width: 100px;
      cursor: pointer;
      margin-right: 0.5rem;
      object-fit: cover;
      border-radius: 5px;
      border: 5px solid;
      border-color: transparent;
    }

    .footer-image.active {
      border-color: var(--primary)
    }

    &::-webkit-scrollbar {
      width: 0.5rem;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid slategrey;
    }
  }
}

.slides {
  padding: 0;
  width: 609px;
  height: 420px;
  display: block;
  margin: 0 auto;
  position: relative;
}

.slides * {
  user-select: none;
}

.slides input {
  display: none;
}

.slide-container {
  display: block;
}

.slide {
  top: 0;
  opacity: 0;
  width: 609px;
  height: 420px;
  display: block;
  position: absolute;

  transform: scale(0);

  transition: all .7s ease-in-out;
}

.slide img {
  width: 100%;
  height: 100%;
}

.nav label {
  width: 200px;
  height: 100%;
  display: none;
  position: absolute;

  opacity: 0;
  z-index: 9;
  cursor: pointer;

  transition: opacity .2s;

  color: #FFF;
  font-size: 156pt;
  text-align: center;
  line-height: 380px;
  font-family: "Varela Round", sans-serif;
  background-color: rgba(255, 255, 255, .3);
  text-shadow: 0px 0px 15px rgb(119, 119, 119);
}

.slide:hover + .nav label {
  opacity: 0.5;
}

.nav label:hover {
  opacity: 1;
}

.nav .next {
  right: 0;
}

input:checked + .slide-container .slide {
  opacity: 1;

  transform: scale(1);

  transition: opacity 1s ease-in-out;
}

input:checked + .slide-container .nav label {
  display: block;
}

.nav-dots {
  width: 100%;
  bottom: 9px;
  height: 11px;
  display: block;
  position: absolute;
  text-align: center;
}

.nav-dots .nav-dot {
  top: -5px;
  width: 11px;
  height: 11px;
  margin: 0 4px;
  position: relative;
  border-radius: 100%;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.6);
}

.nav-dots .nav-dot:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.8);
}

input#img-1:checked ~ .nav-dots label#img-dot-1,
input#img-2:checked ~ .nav-dots label#img-dot-2,
input#img-3:checked ~ .nav-dots label#img-dot-3,
input#img-4:checked ~ .nav-dots label#img-dot-4,
input#img-5:checked ~ .nav-dots label#img-dot-5,
input#img-6:checked ~ .nav-dots label#img-dot-6 {
  background: rgba(0, 0, 0, 0.8);
}
</style>