<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import { useBook } from '@/composables/book';
import { useTag } from '@/composables/tags';
import { useSeries } from '@/composables/series';
import { useAuthor } from '@/composables/author';
import { useMedia } from '@/composables/media';
import { fetchData, formRequest, calcTextSize, isMobile } from '@/utils/helper';
import { RATINGS } from '@/utils/constants';
import { Book } from '@/interfaces/book';
import { Media } from '@/interfaces/media';

document.title = 'Book Edit';

const props = defineProps({
	sidebarCollapsed: Boolean,
});

const route = useRoute();
const router = useRouter();
const { book, getBook } = useBook();
const { tag, tags, showNewTag, getTags, updateTag } = useTag();
const { authors, getAuthors } = useAuthor();
const { series, getSeries } = useSeries();
const { deleteMedia, deleteAllMedia, copyMediaUrl } = useMedia();
const bookStore = useBookStore();

const name = ref<string>('');
const description = ref<string>('');
const source = ref<string>('');
const text = ref<string>('');
const cover = ref<string>('');
const rating = ref<number>();
const tagsID = ref<Array<number>>([]);
const seriesName = ref<string>();
const authorName = ref<string>();
const media = ref<Media | Blob>();
const mediaList = ref<File[]>([]);
const loading = ref(false);
const mounted = ref(false);

const bookID = computed(() => Number(route.params.id));
const routeName = computed(() => route.name);

const imageCoverList = computed(() => {
	return book.value && book.value.media
		? book.value.media.map((img) => {
				return `/${img.path}/${img.file_name}`;
			})
		: [];
});
const getMediaUrl = computed(() => {
	if (!media.value) return '';
	if (media.value instanceof Blob) {
		return window.URL.createObjectURL(media.value);
	} else {
		return import.meta.env.PROD
			? `/${media.value.path}/${media.value.file_name}`
			: `${import.meta.env.VITE_BACKEND_URL}/${media.value.path}/${media.value.file_name}`;
	}
});

watch(routeName, (newValue, oldValue) => {
	if (newValue === 'book-create' && oldValue === 'book-update') location.reload();
});

async function saveBook(event: Event) {
	try {
		if (loading.value) return null;
		loading.value = true;
		const formData = new FormData();
		const formElement = event.target as HTMLFormElement;
		const inputElements = Array.from(formElement.elements).filter((e) => e.getAttribute('name'));
		if (book.value) {
			formData.append(`bookID`, String(book.value.id));
		}
		formData.append(`Book[text_length]`, String(text.value.length));
		for (const element of inputElements) {
			if (element instanceof HTMLInputElement && element.name === 'Upload[mediaFiles][]' && element.files) {
				for (let i = 0; i < element.files.length; i++) {
					const img = element.files[i];
					formData.append(element.name, img);
				}
			} else if (element instanceof HTMLSelectElement && element.name === 'Book[tag_ids][]') {
				for (const [i, opt] of Array.from(element.options).entries()) {
					const optionElement = opt as HTMLOptionElement;
					if (opt.selected) formData.append(element.name, optionElement.value);
				}
			} else if (element instanceof HTMLInputElement && element.name === 'Book[tag_ids][]') {
				if (element.checked) formData.append(element.name, element.value);
			} else if (element instanceof HTMLInputElement && element.name === 'author_id') {
				const author = authors.value?.find((item) => item.name === element.value);
				formData.append(`Book[author_id]`, author ? String(author.id) : '');
			} else if (element instanceof HTMLInputElement && element.name === 'series_id') {
				const seriesItem = series.value?.find((item) => item.name === element.value);
				formData.append(`Book[series_id]`, seriesItem ? String(seriesItem.id) : '');
			} else {
				const inputElement = element as HTMLInputElement;
				formData.append(`Book[${inputElement.name}]`, inputElement.value);
			}
		}

		const url = bookID.value
			? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/book/update?id=${bookID.value}`)
			: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/book/create`);

		const request = formRequest(url, 'POST', formData);
		const data = await fetchData<Book>(request);
		bookStore.setBook(data);
		if (tags.value) {
			const comicsTag = tags.value.find((tag) => tag.name === 'comics');
			if (comicsTag && comicsTag.id)
				router.push({
					name: `${tagsID.value.includes(comicsTag.id) ? 'comics-view' : 'book-view'}`,
					params: { id: data.id },
				});
		} else {
			router.push({ name: 'books', params: { id: data.id } });
		}
	} catch (error) {
		console.log({ 'saveBook wrong': error });
	} finally {
		loading.value = false;
	}
}

async function removeAllFiles() {
	const result = await deleteAllMedia(bookID.value);
	if (result && book.value) book.value.media = [];
}
async function loadBook(data: Book) {
	name.value = data.name;
	description.value = data.description || '';
	source.value = data.source || '';
	text.value = data.text || '';
	cover.value = data.cover || '';
	rating.value = data.rating;
	tagsID.value = data.tags.map((tag) => tag.id);
	authorName.value = data.author?.name;
	seriesName.value = data.series?.name;
}
function loadFiles(evt: Event) {
	const fileList = (evt.target as HTMLInputElement).files;
	if (fileList) {
		for (const file of Array.from(fileList)) {
			mediaList.value.push(file);
		}
	}
}
function mouseOverBlobMediaHandler(event: Event) {
	const index = Number((event.target as HTMLElement).dataset.index);
	media.value = mediaList.value[index];
}
function mouseOverBookMediaHandler(event: Event) {
	const index = Number((event.target as HTMLElement).dataset.index);
	if (book.value && book.value.media) media.value = book.value.media[index];
}
function typo() {
	if (book.value && window.Worker) {
		const typografWorker = new Worker(new URL('../utils/typografWorker.ts', import.meta.url), { type: 'module' });
		typografWorker.postMessage(text.value);
		typografWorker.onmessage = (e) => {
			text.value = e.data;
		};
	} else console.log('typo error');
}

function removeMedia(mediaID: number, index: number) {
	deleteMedia([mediaID]);
	book.value?.media?.splice(index, 1);
}

if (!tags.value) getTags({ perPage: 100, sort: 'name' });
if (!authors.value) getAuthors({ perPage: 100, sort: 'name' });
if (!series.value) getSeries({ perPage: 100, sort: 'name' });

onMounted(async () => {
	mounted.value = true;
	if (route.name === 'book-update') {
		await getBook(bookID.value);
		if (book.value) loadBook(book.value);
	}
});
</script>

<template>
	<main class="flex flex-row flex-nowrap">
		<div class="flex flex-row flex-wrap w-[900px] h-fit">
			<div class="w-full flex flex-col px-4 py-2">
				<label for="name" class="label">Name</label>
				<input type="text" name="name" form="Book" v-model.trim="name" :title="name" required class="input" />
			</div>
			<div class="w-1/2 flex flex-col px-4 py-2">
				<label for="description" class="label">
					Description
					<output class="ml-2">{{ description.length }}</output>
				</label>
				<textarea
					name="description"
					form="Book"
					maxlength="300"
					v-model.trim="description"
					rows="3"
					class="input flex-1"></textarea>
			</div>
			<div class="w-1/2 px-4 py-2 flex flex-wrap">
				<div class="w-full flex justify-between mb-2 gap-2">
					<label for="tags" class="label mb-0">Tags</label>
					<form
						id="newTagForm"
						v-if="showNewTag"
						class="flex flex-row flex-nowrap items-center gap-1"
						@submit.prevent="updateTag">
						<input type="text" name="name" v-model="tag" class="input py-0 border-0" />
						<button class="rounded-full text-green-500 hover:bg-green-700/50">
							<svg class="size-5">
								<use xlink:href="/icons/iconSprite.svg#check" />
							</svg>
						</button>
						<button
							type="reset"
							@click.prevent.passive="showNewTag = false"
							class="rounded-full text-red-500 hover:bg-red-700/50">
							<svg class="size-5">
								<use xlink:href="/icons/iconSprite.svg#close" />
							</svg>
						</button>
					</form>
					<button v-else type="button" class="btn-icon h-5 w-5" @click.prevent.passive="showNewTag = true">
						<svg class="size-5">
							<use xlink:href="/icons/iconSprite.svg#add" />
						</svg>
					</button>
				</div>
				<div class="flex flex-wrap w-full">
					<select
						v-if="isMobile()"
						name="Book[tag_ids][]"
						form="Book"
						multiple
						class="select flex w-full"
						v-model="tagsID"
						required>
						<option v-for="tag in tags" :value="tag.id">{{ tag.name }}</option>
					</select>
					<template v-else>
						<label v-for="item in tags" :for="item.name" :key="item.id" class="w-1/3 flex items-center gap-1">
							<input
								type="checkbox"
								:id="item.name"
								:value="item.id"
								v-model="tagsID"
								name="Book[tag_ids][]"
								form="Book"
								class="size-4 shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
							<span>{{ item.name }}</span>
						</label>
					</template>
				</div>
			</div>
			<div class="w-1/2 flex flex-col px-4 py-2">
				<label for="source" class="label">Source</label>
				<input type="text" name="source" form="Book" v-model.trim="source" :title="source" class="input" />
			</div>
			<div class="w-1/2 flex flex-col px-4 py-2">
				<label for="source" class="label">Cover</label>
				<input
					type="text"
					name="cover"
					form="Book"
					list="coverList"
					v-model.trim="cover"
					:title="cover"
					class="input" />
				<datalist id="coverList">
					<option v-for="(image, index) in imageCoverList" :value="image" :key="index"></option>
				</datalist>
			</div>
			<div class="w-1/3 flex flex-col px-4 py-2">
				<label for="author" class="label">Author</label>
				<input
					type="search"
					form="Book"
					name="author_id"
					list="authorList"
					class="input overflow-ellipsis"
					aria-label="Search"
					v-model="authorName" />
				<datalist id="authorList">
					<option v-for="author in authors" :value="author.name"></option>
				</datalist>
			</div>
			<div class="w-1/3 flex flex-col px-4 py-2">
				<label for="" class="label">Series</label>
				<input
					type="search"
					form="Book"
					name="series_id"
					list="seriesList"
					aria-label="Search"
					class="input overflow-ellipsis"
					v-model="seriesName" />
				<datalist id="seriesList">
					<option v-for="seria in series" :value="seria.name"></option>
				</datalist>
			</div>
			<div class="w-1/3 flex flex-col justify-between px-4 py-2">
				<label for="rating" class="label">Rating</label>
				<select name="rating" form="Book" class="select" v-model="rating" required>
					<option v-for="num in RATINGS" :value="num.value">
						{{ num.name }}
					</option>
				</select>
			</div>
			<div class="w-full flex justify-between items-center px-4 py-3">
				<label for="multiple_files" class="flex mr-3 text-sm font-medium text-gray-900 dark:text-white">
					<input
						id="multiple_files"
						type="file"
						multiple
						form="Book"
						name="Upload[mediaFiles][]"
						accept="video/mp4,video/webm,image/webp,audio/mpeg"
						@change="loadFiles"
						class="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400" />
				</label>
				<button class="btn-red-outline flex gap-1" @click.passive="removeAllFiles">
					Remove
					<span class="hidden lg:inline">Media</span>
					<svg aria-hidden="true" role="status" class="inline size-5 text-red-500">
						<use xlink:href="/icons/iconSprite.svg#image" />
					</svg>
				</button>
			</div>
			<div class="w-full px-4 py-3">
				<label for="text" class="w-full label"
					>Text — <span>Length:</span><output class="mr-2">{{ text.length }}</output> <span>Size:</span
					><output>{{ calcTextSize(text.length) }}kb</output>
				</label>
				<textarea name="text" form="Book" class="w-full input" rows="20" v-model="text"></textarea>
			</div>
		</div>
		<div class="w-96 hidden md:block">
			<div v-if="mediaList.length">
				<h3>New</h3>
				<ol class="columns-2" @mouseover="mouseOverBlobMediaHandler" @mouseleave="media = undefined">
					<li v-for="(media, index) in mediaList" :key="index" class="flex items-center gap-2 p-1">
						<span :data-index="index" class="break-normal hover:text-blue-500">
							{{ media.name }}
						</span>
						<button @click.passive="mediaList.splice(index, 1)">
							<svg class="size-5">
								<use xlink:href="/icons/iconSprite.svg#delete" />
							</svg>
						</button>
					</li>
				</ol>
			</div>
			<div v-if="book?.media?.length">
				<h3 class="text-lg">Uploaded:</h3>
				<ol class="columns-2" @mouseover="mouseOverBookMediaHandler" @mouseleave="media = undefined">
					<li v-for="(img, index) in book.media" :key="index" class="flex items-center gap-2 p-1">
						<button @click.passive="copyMediaUrl(img)" :data-index="index" class="hover:text-blue-500">
							{{ img.file_name }}
						</button>
						<button @click.passive="removeMedia(img.id, index)" class="dark:text-red-600">
							<svg class="size-5">
								<use xlink:href="/icons/iconSprite.svg#delete" />
							</svg>
						</button>
					</li>
				</ol>
			</div>
			<div v-if="media">
				<video
					v-if="media.file_name.includes('.mp4')"
					loop
					autoplay
					muted
					:src="getMediaUrl"
					class="max-w-sm max-h-80 fixed top-[calc(50%_-_120px)] left-10 z-20 rounded-md" />
				<img
					v-else
					:src="getMediaUrl"
					class="max-w-sm max-h-80 fixed top-[calc(50%_-_120px)] left-10 z-20 rounded-md"
					onerror="this.onerror=null;this.src = '/images/unknownImage.webp'" />
			</div>
		</div>
		<form id="Book" name="Book" @submit.prevent="saveBook"></form>
		<Teleport v-if="mounted" to="#menu-target">
			<button
				class="nav-btn border flex items-center gap-2 hover:bg-gray-600"
				:class="{ 'w-full px-2 py-1': !sidebarCollapsed, 'w-fit p-0.5': sidebarCollapsed }"
				@click.prevent="typo">
				<svg aria-hidden="true" role="status" class="inline size-6">
					<use xlink:href="/icons/iconSprite.svg#spellcheck" />
				</svg>
				<span v-if="!sidebarCollapsed">Typo</span>
			</button>
			<button
				form="Book"
				type="submit"
				class="nav-btn border flex items-center gap-2 hover:bg-gray-600"
				:class="{ 'w-full px-2 py-1': !sidebarCollapsed, 'w-fit p-0.5': sidebarCollapsed }">
				<svg v-if="!sidebarCollapsed || !loading" aria-hidden="true" role="status" class="inline size-6">
					<use xlink:href="/icons/iconSprite.svg#save" />
				</svg>
				<span v-if="!sidebarCollapsed">Save</span>
				<svg v-if="loading" aria-hidden="true" role="status" class="inline size-6 animate-spin text-white">
					<use xlink:href="/icons/iconSprite.svg#loadingRing" />
				</svg>
			</button>
		</Teleport>
	</main>
</template>
