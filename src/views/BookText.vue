<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBook } from '@/composables/book';
import { isSmallDevice } from '@/utils/helper';
import { TEXT_SIZES } from '@/constants';
import { Chapter, Book } from '@/interfaces/book';

import TheLoader from '@/components/TheLoader.vue';

document.title = 'Book';

const props = defineProps({
	progress: Number,
});

const route = useRoute();
const { readBook } = useBook();

const bookID = Number(route.params.id);
const bookmark = Number(localStorage.getItem(`bookmark-${bookID}`));
const book = ref<Book>();
const bottomSheetShow = ref(false);
const headerChapters = ref<Array<Chapter>>([]);
const chapterElement = ref<Chapter>();
const bottomShow = ref(false);
const mounted = ref(false);
const classicMode = ref<boolean>(isSmallDevice());
const fontSize = ref('text-xl');
const page = ref(1);
const pageCount = ref(1);

const textStyles = computed(() => {
	return classicMode.value
		? 'columns-1 h-[calc(100dvh_-_52px)] gap-x-16 max-w-7xl py-2 overflow-hidden'
		: 'md:p-3 lg:p-4';
});

/* const progressStyle = computed(() => {
	return { height: `${props.scrollProgress}dvh` };
}); */

watch(
	() => props.progress,
	(newValue) => {
		localStorage.setItem(`bookmark-${bookID}`, String(newValue));
	},
);

function scrollToChapter() {
	bottomShow.value = false;
	if (chapterElement.value) chapterElement.value.element.scrollIntoView();
	bottomSheetShow.value = false;

}

function calcOptionChapterName(chapter: Element) {
	const chapterElem = chapter.querySelector('.chapter-header');
	return chapterElem ? chapterElem.innerHTML : '';
}

async function prepareHeaders() {
	const arr: Chapter[] = [];
	const chapterElements = document.querySelectorAll('.chapter');
	const h1Element = document.querySelector('.book-name');

	if (h1Element) {
		const item = { name: 'Table Of Content', shortName: 'ToC', url: 'mainText', element: h1Element };
		arr.push(item);
		chapterElement.value = item;
	}
	for (const [index, elem] of chapterElements.entries()) {
		arr.push({ name: calcOptionChapterName(elem), shortName: `Chapter ${index + 1}`, url: elem.id, element: elem });
	}
	headerChapters.value = arr;
}

async function scrollToBookmark() {
	const clientHeight = document.documentElement.clientHeight;
	const scrollHeight = Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.body.clientHeight,
		document.documentElement.clientHeight,
	);
	const windowHeights = scrollHeight - clientHeight;

	if (bookmark) {
		window.scrollTo(0, (bookmark * windowHeights) / 100);
	}
}

function keyHandler(event: KeyboardEvent) {
	// event.preventDefault();
	if (event.code === 'ArrowLeft') {
		prevPage();
	} else if (event.code === 'ArrowRight') {
		nextPage();
	} else if (event.code === 'Space') {
		console.log('keyHandler event', event)
	}
}

function firstPage() {
	const mainElement = document.getElementById('mainText');
	if (mainElement) {
		mainElement.setAttribute('data-translated', '0');
		mainElement.scroll(0, 0);
		calcPages()
	}
	bottomSheetShow.value = false;
}

function lastPage() {
	const mainElement = document.getElementById('mainText');
	if (mainElement) {
		const translate = mainElement.scrollWidth - mainElement.clientWidth;
		mainElement.setAttribute('data-translated', String(translate));
		mainElement.scroll(translate, 0);
		calcPages()
	}
	bottomSheetShow.value = false;
}

function nextPage() {
	const mainElement = document.getElementById('mainText');
	if (mainElement) {
		const currentTranslate = Number(mainElement.dataset['translated']);
		const translate = mainElement.clientWidth + (currentTranslate || 0) + 64;
		if (mainElement.scrollWidth > translate) {
			mainElement.setAttribute('data-translated', String(translate));
			mainElement.scroll(translate, 0);
			calcPages()
		}
	}
	bottomSheetShow.value = false;
}

function prevPage() {
	const mainElement = document.getElementById('mainText');
	if (mainElement) {
		const currentTranslate = Number(mainElement.dataset['translated']);
		const prev = currentTranslate - mainElement.clientWidth;
		const translate = prev > 0 ? prev - 64 : 0;
		mainElement.setAttribute('data-translated', String(translate));
		mainElement.scroll(translate, 0);
		calcPages()
	}
	bottomSheetShow.value = false;
}

function generalClickHandle(event: MouseEvent) {
	const x = event.clientX;
	const width = window.innerWidth;
	const threshold = isSmallDevice() ? 150 : 350;
	if (x <= threshold) {
		prevPage()
	} else if (x >= width - 150) {
		nextPage()
	}
}

function calcPages() {
	const mainElement = document.getElementById('mainText');
	if (mainElement) {
		pageCount.value = Math.floor(mainElement.scrollWidth / mainElement.offsetWidth)
		page.value = Math.ceil(mainElement.scrollLeft / mainElement.offsetWidth) || 1
	}
}

async function initBook() {
	const result = await readBook(bookID);
		if(import.meta.env.PROD) {
			return result
		} else {
			const text = prepareMediaLinks(result.text);
			return { ...result, text}
		}
}

function prepareMediaLinks(htmlString: string|null) {
	const mediaRegex = /<([a-z]+)\s+([^>]*?)src=["'](\/[^"']*)["']([^>]*?)>/gi;
	const bgImageRegex = /url\(["']?(\/[^"')]+)["']?\)/gi;

	return htmlString ? htmlString.replace(mediaRegex, (match, tagName, beforeSrc, relativeUrl, afterSrc) => {
        const absoluteUrl = new URL(relativeUrl, import.meta.env.VITE_BACKEND_URL).toString();
        return `<${tagName} ${beforeSrc} src="${absoluteUrl}"${afterSrc}>`;
    }).replace(bgImageRegex, (match, relativeUrl) => {
        const absoluteUrl = new URL(relativeUrl, import.meta.env.VITE_BACKEND_URL).toString();
        return `url("${absoluteUrl}")`;
    }) : null;
}

onMounted(async () => {
	mounted.value = true;

	book.value = await initBook();
	document.addEventListener('keydown', keyHandler, { passive: true });
	nextTick(() => {
		prepareHeaders();
		scrollToBookmark();
		calcPages();
	});
});
onBeforeUnmount(() => {
	document.removeEventListener('keydown', keyHandler);
});

</script>

<template>
  <main
    id="bookText"
    class="flex justify-center lg:w-[calc(100%_-_15rem)]"
    :class="{ 'px-3': classicMode }"
    @click="generalClickHandle">
    <div
      v-if="book"
      id="mainText"
      class="text max-w-[900px] flex-1"
      :class="{ [fontSize]: true, [textStyles]: true }"
      v-html="book.text" />
    <TheLoader v-else class="fixed top-1/2 m-auto size-24 text-emerald-500" />
    <div
      v-if="isSmallDevice()"
      class="fixed flex h-32 w-full cursor-pointer flex-row flex-wrap gap-1 bg-slate-300 px-4 py-2 transition-all dark:bg-slate-600 lg:left-48 lg:h-28 lg:w-[calc(100%_-_192px)] lg:gap-3"
      :class="{ 'bottom-0 ': bottomSheetShow, '-bottom-32 lg:-bottom-28': !bottomSheetShow }"
      @click.stop="">
      <button
        class="absolute -top-4 left-[calc(50%_-_40px)] mx-auto h-4 w-20 rounded-t-xl bg-slate-400 dark:bg-slate-600"
        @click="bottomSheetShow = !bottomSheetShow">
        <svg class="m-auto" height="16" width="20">
          <use xlink:href="/icons/iconSprite.svg#menu" />
        </svg>
      </button>
      <div class="flex w-full justify-between gap-2">
        <button class="flex-1 rounded border uppercase" @click="firstPage">
          first
        </button>
        <button class="flex-1 rounded border uppercase" @click="prevPage">
          prev
        </button>
        <button class="flex-1 rounded border uppercase" @click="nextPage">
          next
        </button>
        <button class="flex-1 rounded border uppercase" @click="lastPage">
          last
        </button>
      </div>
      <div class="flex w-full gap-2">
        <div class="flex flex-row flex-wrap md:w-auto">
          <label for="" class="w-full">Font</label>
          <select
            id=""
            v-model="fontSize"
            name=""
            class="w-full rounded px-2 py-1 dark:bg-gray-400">
            <option v-for="(size, index) in TEXT_SIZES" :key="index" :value="size.value">
              {{ size.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-row flex-wrap md:w-auto md:max-w-48">
          <label for="" class="w-full">Chapter</label>
          <select
            v-model="chapterElement"
            class="w-full rounded px-2 py-1 dark:bg-gray-400"
            @change="scrollToChapter">
            <option v-for="(chapter, index) in headerChapters" :key="index" :value="chapter">
              {{ chapter.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div v-else class="fixed right-6 flex h-dvh flex-col gap-2 p-3">
      <a
        v-for="(chapter, index) in headerChapters"
        :key="index"
        :href="`#${chapter.url}`"
        class="link">
        {{ chapter.shortName }}
      </a>
    </div>
    <Teleport v-if="mounted && book" to="#menu-target">
      <button
        v-if="!isSmallDevice()"
        class="w-full rounded-lg  bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800
		px-3 py-1.5 text-center text-sm font-bold 
		hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-400 dark:focus:ring-teal-900"
        @click="classicMode = !classicMode">
        {{ classicMode ? 'Classic' : 'Scroll' }}
      </button>
    </Teleport>
    <Teleport v-if="isSmallDevice()" to="#header-target">
      <div class="text-white">
        <div v-if="classicMode">
          {{ page }}/{{ pageCount }}
        </div>
        <div v-else class="">
          {{ progress }}%
        </div>
      </div>
    </Teleport>
  </main>
</template>
<style>
@import url('/src/assets/style/tooltip.css');

.text hr {
	border-color: initial;
}

.text h3 + hr {
	margin: 0.5rem 0 1rem 0;
}

.text p + hr {
	margin: 1rem 0;
}

.text h3 {
	font-size: 1.25rem;
	text-align: center;
}

.text p {
	word-break: break-word;
	padding: initial;
	text-indent: 1rem;
}

.text p + p {
	margin-top: 0.5rem;
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

.text blockquote {
	padding: 1rem;
	background-color: #eee;
	border-radius: 5px;
	margin: 0.5rem 0;
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

.picture, .picture-full {
	object-fit: cover;
	border-radius: 0.75rem;
}
.picture-full {
	max-width: 868px;
	max-height: 675px;
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
	animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.chapter+.chapter {
	break-before: column;
}


.chat {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	position: relative;
}

.chat div {
	border: 1px solid gray;
	font-size: 0.9rem;
	line-height: 1.3;
	position: relative;
	text-align: left;
	max-width: 90%
}

.chat div:hover::before {
	opacity: 1;
}

.user1 {
	margin: 0 0 0 1rem;
	border-radius: 0 1rem 1rem 1rem;
	padding: 0.5rem 1rem 0.5rem 2rem;
	align-self: flex-start;
}

.user1::after {
	left: -25px;
}

.user2 {
	border-radius: 1rem 0 1rem 1rem;
	padding: 0.5rem 2rem 0.5rem 1rem;
	align-self: flex-end;
	margin: 0 1rem 0 0;
}
/* 
.user1::before,
.user2::before {
	content: attr(data-content);
	position: fixed;
	top: 1rem;
	width: 200px;
	height: 200px;
	border-radius: 10px;
	z-index: 100;
	opacity: 0;
	background-size: cover;
	background-position: top;
	transition: opacity 0.3s ease-in-out 1s;
} */

.user1::before {
	left: 1rem;
}

.user2::before {
	left: auto;
	right: 1rem;
}

.user2::after,
.user1::after {
	content: attr(data-content);
	display: block;
	border: 1px solid gray;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	position: absolute;
	top: -7px;
	background-size: cover;
	background-position: top;
}

.user2::after {
	right: -25px;
}

.chat .remark {
	border: none;
	margin: 0.5rem 0;
	font-size: 1rem;
	line-height: 1.5rem;
	text-align: justify;
	padding: 0;
	background: transparent;
}
.picture-hidden {
	display: none;
	max-width: 75vw;
	max-height: 75dvh;
	position: fixed;
	z-index: 9;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
.btn-trigger-hidden-picture {
	cursor: pointer;
	color: yellow;
}

.btn-trigger-hidden-picture:focus + .picture-hidden {
	display: block;
}

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

@media only screen and (max-width: 768px) {
	.book-view {
		max-width: initial;
		width: 100%;
	}
}

@media only screen and (min-width: 360px) and (max-width: 768px) and (orientation: landscape) {

	.video, .picture, .picture-full {
		float: left;
		margin: 0 0.5rem 0.5rem 0;
		max-width: 394px;
	}
}

@media only screen and (min-width: 360px) and (max-width: 768px) and (orientation: portrait) {

	.video, .picture, .picture-full {
		width: 100%;
	}
}

@media only screen and (min-width: 769px) and (max-width: 1368px) {

	.video, .picture, .picture-full {
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
	.picture-hidden {
		max-width: 50vw;
		max-height: 50dvh;
	}
}
</style>