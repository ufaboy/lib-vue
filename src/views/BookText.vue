<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBook } from '@/composables/book';
import { isSmallDevice } from '@/utils/helper';
import { TEXT_SIZES } from '@/utils/constants';
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
		? 'columns-1 h-[calc(100dvh_-_52px)] gap-x-16 max-w-7xl py-4 overflow-hidden'
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
		const item = { name: 'Table Of Content', shortName: 'Table Of Content', url: 'mainText', element: h1Element };
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
	const leftЕhreshold = isSmallDevice() ? 150 : 350;
	if (x <= leftЕhreshold) {
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

onMounted(async () => {
	mounted.value = true;
	book.value = await readBook(bookID);
	
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
    class="flex justify-center"
    :class="{ 'px-3': classicMode }"
    @click="generalClickHandle">
    <div
      v-if="book"
      id="mainText"
      class="text max-w-[900px] flex-1"
      :class="{ [fontSize]: true, [textStyles]: true }"
      v-html="book.text" />
    <TheLoader v-else class="absolute inset-0 m-auto size-24 text-emerald-500" />
    <div
      class="fixed flex h-32 cursor-pointer flex-row flex-wrap gap-1 bg-slate-300 px-4 py-2 transition-all dark:bg-slate-600 lg:left-48 lg:h-28 w-full lg:w-[calc(100%_-_192px)] lg:gap-3"
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
    <Teleport v-if="mounted && book" to="#menu-target">
      <div class="flex items-center gap-1">
        <div class="max-w-52 truncate whitespace-nowrap font-medium text-white md:max-w-40">
          {{ book.name }}
        </div>
        <div v-if="classicMode">
          {{ page }}/{{ pageCount }}
        </div>
        <div v-else class="font-medium text-white">
          {{ progress }}%
        </div>   
      </div>
      <template v-if="!isSmallDevice()">
        <button
          class="rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
          @click="classicMode = !classicMode">
          {{ classicMode ? 'Classic' : 'Scroll' }} mode
        </button>
        <ol>
          <li v-for="(chapter, index) in headerChapters" :key="index" class="sidebar-link px-0">
            <a :href="`#${chapter.url}`">
              {{ chapter.shortName }}
            </a>
          </li>
        </ol>
      </template>
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
	animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.chapter+.chapter {
	break-before: column;
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

	.picture,
	.video {
		float: left;
		margin: 0 0.5rem 0.5rem 0;
		max-width: 394px;
	}
}

@media only screen and (min-width: 360px) and (max-width: 768px) and (orientation: portrait) {

	.picture,
	.video {
		width: 100%;
	}
}

@media only screen and (min-width: 769px) and (max-width: 1368px) {

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
