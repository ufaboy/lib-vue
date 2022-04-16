<template>
<div class="book" :class="{mobile: isMobile()}">
  <div class="page" v-html="props.book.text"></div>
  <div class="wrapper">

<!--    <section id="page-1" class="page"></section>-->
<!--    <section id="page-2" class="page"></section>-->
  </div>

</div>
</template>

<script  setup lang="ts">
import {onMounted} from "vue";
import {isMobile} from "../../utils/helpers";
interface CategoryExtended extends Category{
  genres?: Array<Genre>
}
interface Category {
  id: number,
  name: string
}
interface Genre {
  [key: string]: number|string|Category|boolean
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}
interface BookFile {
  created_at: number,
  extension: string,
  file_name: string,
  full_name: string,
  id: number,
  path: string,
  size: number,
  type: string,
  url: string,
}
interface Book {
  id: number,
  name: string,
  annotation?: string,
  text?: string,
  book_type?: string,
  source?: string,
  bookmark?: number,
  rating?: number,
  ad?: boolean,
  genres: Array<Genre>
  cover_path?: string,
  files?: Array<BookFile>,
  view_count?: number,
  created_at?: number,
  updated_at?: number,
  last_read?: number,
}

type Page = []
document.title = 'Book';
const props = defineProps<{
  book: Book,
}>()

let textNodes: string | any[] = []
let lastElementIndex = 0
const bookTextArray:Page[] = []

const clearedText = props.book.text?.replaceAll('\n', '') ?? ''
const doc = new DOMParser().parseFromString(clearedText, 'text/html');
// @ts-expect-error
const arr = [...doc.body.childNodes]
    .map(child => child.outerHTML || child.textContent);
let arrTwo = []

for (const element of arr) {
  if (element.includes('<h1>')) {
    arrTwo.push(element)
  } else if (element.includes('<h2')) {
const value = getId(element)
    const name = getName(element)
    const chapter = {name: name, value: value, chapterElement: element, content: []}
    arrTwo.push(chapter)
  } else if (element.includes('<p>')) {
    arrTwo[arrTwo.length - 1].content.push(element)
  }
}
function getName(element:string) {
  const regular = new RegExp('>(.*)<')
  const nameArray = regular.exec(element)
  return nameArray ? nameArray.length ? nameArray[1] : '' : ''
}
function getId(element:string) {
  const regular = new RegExp('id="st\\d*"')
  const idArray = regular.exec(element)
// @ts-expect-error
  return idArray ? idArray.length ? parseInt(idArray[0].match(/\d+/)) : '' : ''
}
console.log({arr:arr, arrTwo: arrTwo});

// const regular = new RegExp('(?i)<h([1-6].*?)(.*?)</h([1-6])>')
// const arr = clearedText?.split(regular)
// console.log({clearedText: clearedText, arr: arr})
// function prepareBook() {
//   const clearedText = (props.book.text as string).replaceAll('\n', '')
//   const div = document.createElement("div")
//   div.innerHTML = clearedText;
//   textNodes = [].slice.call(div.childNodes);
//   console.log('prepareBook', {nodes:textNodes})
// }
//
// onMounted(() => {
//   calcPages()
// })
// function calcPages() {
//   let pageOne = document.querySelector('#page-1')
//   let pageTwo = document.querySelector('#page-2')
//   if (!pageOne || !pageTwo) {
//     return;
//   }
//   for (let i = 0; i < textNodes.length; i++) {
//     const observer = createObserver()
//     observer.observe(textNodes[i])
//     pageOne.append(textNodes[i])
//   }
//   console.log({pageOne: pageOne})
// }
// function createObserver() {
//   const options = {
//     root: document.querySelector('#scrollArea'),
//     rootMargin: '0px',
//     threshold: 0
//   }
//   let callback = function(entries:any, observer:IntersectionObserver) {
//     console.log({observer:observer, entries: entries})
//   };
//   return new IntersectionObserver(callback, options)
// }
//
// prepareBook()

</script>

<style lang="scss">
.book {
  width: 100%;
  height: 95vh;
  .page {
    width: max-content;
    height: 100%;
    columns: 650px auto;
    column-gap: 3rem;
  }

  p {
    word-break: break-word;
    padding: initial;
    text-indent: 1rem;
    margin: 0 0 0.3rem;
    position: relative;
  }
}
</style>