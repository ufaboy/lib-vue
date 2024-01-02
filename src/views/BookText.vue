<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import { useBook } from '@/composables/book'
import { TEXT_SIZES } from '@/utils/constants'
import { Chapter } from '@/interfaces/book';

import TheLoader from '@/components/TheLoader.vue';

document.title = 'Book';

const props = defineProps({
    scrollProgress: Number
})

const route = useRoute()
const bookStore = useBookStore()
const bookID = Number(route.params.id)
const { book, getBook } = useBook()

const bookmark = Number(localStorage.getItem(`bookmark-${bookID}`))
const bottomSheetShow = ref(false)
const headerChapters = ref<Array<Chapter>>([])
const chapterElement = ref<Chapter>()
const bottomShow = ref(false)
const mounted = ref(false)
const classicMode = ref(false)
const fontSize = ref('text-xl')

const textStyles = computed(() => {
    return classicMode.value
        ? ' columns-1 md:columns-2 h-[calc(100dvh_-_67px)] gap-x-16 max-w-7xl py-4'
        : 'text w-full max-w-[900px] py-2 px-3 md:p-3 lg:p-4'
})

const progressStyle = computed(() => {
    return { height: `${props.scrollProgress}dvh` }
})

watch(() => props.scrollProgress, (newValue) => {
    localStorage.setItem(`bookmark-${bookID}`, String(newValue))
})

function scrollToChapter() {
    bottomShow.value = false
    if (chapterElement.value) chapterElement.value.element.scrollIntoView()
}

function calcOptionChapterName(chapter: Element) {
    const chapterElem = chapter.querySelector('.chapter-header')
    return chapterElem ? chapterElem.innerHTML : ''
}

async function prepareHeaders() {
    let arr = []
    const chapterElements = document.querySelectorAll('.chapter')
    const h1Element = document.querySelector('.book-name')

    if (h1Element) {
        const item = { name: 'Table Of Content', url: '/', element: h1Element }
        arr.push(item)
        chapterElement.value = { name: 'Table Of Content', url: '/', element: h1Element }
    }
    for (const elem of chapterElements) {
        arr.push({ name: calcOptionChapterName(elem), url: elem.id, element: elem })
    }
    headerChapters.value = arr
}

async function scrollToBookmark() {
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    const windowHeights = scrollHeight - clientHeight;

    if (bookmark) {
        window.scrollTo(0, (bookmark * windowHeights) / 100)
        console.log('scrollToBookmark', bookmark * windowHeights);
    }
}

function keyHandler(event: KeyboardEvent) {
    event.preventDefault()
    if (event.code === 'ArrowLeft') {
        prevPage()
    } else if (event.code === 'ArrowRight') {
        nextPage()
    } else if (event.code === 'Space') {
    }
}

function nextPage() {
    const mainElement = document.getElementById('mainText')
    if (mainElement) {
        const currentTranslate = Number(mainElement.dataset['translated'])
        const translate = mainElement.clientWidth + (currentTranslate || 0) + 72
        mainElement.setAttribute('data-translated', String(translate))
        window.scroll(translate, 0)
        console.log('nextPage', { currentTranslate: currentTranslate, translate: translate })
    }
}
function prevPage() {
    const mainElement = document.getElementById('mainText')
    if (mainElement) {
        const currentTranslate = Number(mainElement.dataset['translated'])
        const prev = currentTranslate - mainElement.clientWidth
        const translate = prev > 0 ? prev - 72 : 0
        mainElement.setAttribute('data-translated', String(translate))
        window.scroll(translate, 0)
        console.log('prevPage', { currentTranslate: currentTranslate, translate: translate })
    }
}

onMounted(async () => {
    mounted.value = true
    if (!book.value) await getBook(bookID)
    prepareHeaders()
    document.addEventListener('keydown', keyHandler, { passive: true });
    nextTick(() => {
        scrollToBookmark()
    })
})
onBeforeUnmount(() => {
    document.removeEventListener('keydown', keyHandler);
})

if (book.value && book.value.id !== bookID) bookStore.setBook()
</script>

<template>
    <main class="flex justify-center" :class="{ 'px-8': classicMode }">
        <div v-if="book" id="mainText" v-html="book.text" class="" :class="{ [fontSize]: true, [textStyles]: true }"></div>
        <TheLoader v-else class="fixed m-auto inset-0 size-24 text-emerald-500" />
        <div class="fixed flex flex-row flex-wrap gap-1 md:gap-3 w-full h-56 md:h-20 cursor-pointer bg-slate-300 dark:bg-slate-600 px-4 py-2 transition-all"
            :class="{ 'bottom-0 ': bottomSheetShow, '-bottom-56 md:-bottom-20': !bottomSheetShow }">
            <div class="absolute -top-4 left-[calc(50%_-_40px)] bg-slate-400 dark:bg-slate-600 w-20 h-4 mx-auto rounded-t-xl"
                @click="bottomSheetShow = !bottomSheetShow">
                <svg class="m-auto" height="16" width="20"><use xlink:href="/icons/iconSprite.svg#menu" /></svg>
            </div>
            <div class="flex flex-row flex-wrap w-full md:w-auto">
                <label for="" class="w-full">Font</label>
                <select name="" id="" class="w-full px-2 py-1 rounded dark:bg-gray-400" v-model="fontSize">
                    <option v-for="(size, index) in TEXT_SIZES" :value="size.value" :key="index">
                        {{ size.name }}
                    </option>
                </select>
            </div>
            <div class="flex flex-row flex-wrap w-full md:w-auto md:max-w-[12rem]">
                <label for="" class="w-full">Chapter</label>
                <select class="w-full px-2 py-1 rounded dark:bg-gray-400" v-model="chapterElement"
                    @change="scrollToChapter">
                    <option :value="chapter" v-for="(chapter, index) in headerChapters">
                        {{ chapter.name }}
                    </option>
                </select>
            </div>
            <div class="flex flex-row flex-wrap w-full md:w-min md:max-w-[12rem]">
                <label for="" class="w-full whitespace-nowrap">View Mode</label>
                <button @click="classicMode = !classicMode"
                    class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {{ classicMode ? 'Classic' : 'Scroll' }}
                </button>
            </div>
        </div>
        <Teleport v-if="mounted && book" to="#header-target">
            <div class="text-sm truncate max-w-[180px] text-white">{{ book.name }}</div>
            <div class="text-sm mr-1 text-white">{{ scrollProgress }}%</div>
            <router-link :to="{ name: 'book-update', params: { id: book.id } }" class="btn-header-green"
                active-class="header-link-active">
                Update
            </router-link>
        </Teleport>
    </main>
</template>
<style>
@import url('/src/assets/style/tooltip.css');

.text hr {
    margin: 0.5rem 0;
    border-color: initial;
}

.text p+hr {
    margin: 1rem 0 0.5rem 0;
}

.text h3 {
    font-size: 1.25rem;
    text-align: center;
}

.text p {
    word-break: break-word;
    padding: initial;
    text-indent: 1rem;
    margin: 0 0 0.5rem;
}

.chapter {
    margin-bottom: 1.5rem;
}

.book-name {
    text-align: center;
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-bottom: 1rem;
}

.chapter-header {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    margin-bottom: 0.5rem;
}

blockquote {
    padding: 1rem;
    background-color: #eee;
    border-radius: 5px;
}

#scrolling-progress {
    position: fixed;
    left: 0;
    top: 0;
    width: 4px;
    background-color: #ffc107;
}

span[data-tooltip]:hover {
    color: crimson;
}

.picture-group {
    display: flex;
    flex-flow: row wrap;
}

.picture {
    object-fit: cover;
    border-radius: 0.75rem;
}

.illustrations {
    display: flex;
    flex: 1;

}

.progress-line {
    position: fixed;
    width: 3px;
    left: 0;
    top: 0;
    background-color: var(--bs-green);
}

.bottom {
    width: calc(100% - 30px);
    padding: 3rem 0 0 0;
    position: fixed;
    bottom: -3rem;
}

.bottom select {
    width: 100%;
    padding: 5px;
}

.bottom.active {
    animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.chapter+.chapter {
    break-before: column;
}

[data-tooltip] {}

@media (prefers-color-scheme: dark) {
    blockquote {
        background-color: #343a40;
    }
}

.dark {
    blockquote {
        background-color: #343a40;
    }
}

@keyframes slide-top {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-3rem);
    }
}

@media only screen and (max-width: 892px) {
    .book-view {
        max-width: initial;
        width: 100%;
    }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {

    .picture,
    .video {
        float: left;
        margin: 0 0.5rem 0.5rem 0;
        max-width: 394px;
    }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {

    .picture,
    .video {
        width: 100%;
    }
}

@media only screen and (min-width: 893px) and (max-width: 1368px) {

    .picture,
    .video {
        float: left;
        width: 375px;
        margin: 0.5rem 1rem 0.5rem 0;
    }
}

@media only screen and (min-width: 1368px) {

    .picture,
    .video {
        float: left;
        width: 375px;
        margin: 0.5rem 1rem 0.5rem 0;
    }
}
</style>