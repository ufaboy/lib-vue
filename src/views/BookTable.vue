<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { convertTimestampToDate } from '@/utils/helper';
import { useBook } from '@/composables/book';
import { useTag } from '@/composables/tags';
import { useSeries } from '@/composables/series';
import { useAuthor } from '@/composables/author';
import { useTagStore } from '@/store/tagStore';
import { useAuthorStore } from '@/store/authorStore';
import { useSeriesStore } from '@/store/seriesStore';
import { RATINGS, SIZES } from '@/utils/constants';

import TablePaginator from '@/components/TablePaginator.vue';
import SkeletonTableRow from '@/components/SkeletonTableRow.vue';
import TheLoader from '@/components/TheLoader.vue';
import { QueryBooks } from '@/interfaces/book';

document.title = 'Books';

const props = defineProps({
	scrollProgress: Number,
});

const { books, queryBooks, booksMeta, loading, getBooks, changeSort, isComics, sizeConverter, parseQueryBookParams } =
	useBook();
const { convertTagToString, getTags } = useTag();
const { getAuthors } = useAuthor();
const { getSeries } = useSeries();
const tagStore = useTagStore();
const authorStore = useAuthorStore();
const seriesStore = useSeriesStore();
const { tags } = storeToRefs(tagStore);
const { authors } = storeToRefs(authorStore);
const { series } = storeToRefs(seriesStore);

const mounted = ref(false);
const shortColumns = ref<Array<string>>([]);

const scrolled = computed(() => {
	return !!props.scrollProgress;
});
function getBooksByPage(page: number) {
	queryBooks.value.page = page;
	getBooks();
}
function getBooksByFilter() {
	queryBooks.value.page = 1;
	getBooks();
}
function toggleColumn(column: string) {
	const colIndex = shortColumns.value.findIndex((item) => item === column);
	if (colIndex === -1) {
		shortColumns.value.push(column);
	} else {
		shortColumns.value.splice(colIndex, 1);
	}
}
function saveColumnsToLS(columns: string[]) {
	localStorage.setItem('book-columns', JSON.stringify(columns));
}
function getSavedColumns() {
	const savedColumns = localStorage.getItem('book-columns');
	shortColumns.value = savedColumns ? JSON.parse(savedColumns) : [];
}
function getBookRating(bookRating: number) {
	const rating = RATINGS.find((item) => item.value === bookRating);
	return rating ? rating.name : '—';
}
function updateLimit(size: number) {
	queryBooks.value.perPage = size;
	getBooks();
}

function setFilterUpdateList(filter: QueryBooks) {
	queryBooks.value = filter
	getBooksByFilter();
}

watch(
	() => shortColumns,
	(newValue) => {
		saveColumnsToLS(newValue.value);
	},
	{ deep: true },
);

onMounted(() => {
	getSavedColumns();
	mounted.value = true;
});

// parseQueryBookParams();
getBooks();

if (!tags.value) getTags({ perPage: 100, sort: 'name' });
if (!authors.value) getAuthors({ perPage: 100, sort: 'name' });
if (!series.value) getSeries({ perPage: 100, sort: 'name' });
</script>

<template>
	<main class="">
		<table class="w-full table-auto border-separate border-spacing-0" v-table-nav>
			<thead>
				<tr>
					<th
						class="th sticky top-0 !rounded-es-none"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('id') }">
							<button
								class="overflow-hidden"
								aria-label="ID"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('id') }"
								@click.passive="toggleColumn('id')">
								ID
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('id') }"
								@click.passive="changeSort('id')"
								aria-label="Sort by ID">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('name') }">
							<button
								class="overflow-hidden"
								aria-label="Name"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('name') }"
								@click.passive="toggleColumn('name')">
								Name
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('name') }"
								@click.passive="changeSort('name')"
								aria-label="Sort by Name">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div
							class="flex flex-row items-center"
							:class="{ 'text-emerald-300': queryBooks.sort.includes('description') }">
							<button
								class="overflow-hidden"
								aria-label="Description"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('description') }"
								@click.passive="toggleColumn('description')">
								Description
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('description') }"
								@click.passive="changeSort('description')"
								aria-label="Sort by Description">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('tags') }">
							<button
								class="overflow-hidden"
								aria-label="Tags"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('tags') }"
								@click.passive="toggleColumn('tags')">
								Tags
							</button>
							<!--               <button class="inline-block size-4 ml-2" :class="{ 'hidden': shortColumns.includes('tags') }"
                @click.passive="changeSort('tags')" aria-label="Sort by Tags">
                <IconSort :class="{}" size="16" :ascending="queryBooks.sort[0] !== '-'" />
              </button> -->
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('rating') }">
							<button
								class="overflow-hidden"
								aria-label="Rating"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('rating') }"
								@click.passive="toggleColumn('rating')">
								Rating
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('rating') }"
								@click.passive="changeSort('rating')"
								aria-label="Sort by Rating">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('count') }">
							<button
								class="overflow-hidden"
								aria-label="Count"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('count') }"
								@click.passive="toggleColumn('count')">
								Count
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('count') }"
								@click.passive="changeSort('view_count')"
								aria-label="Sort by Count">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('author') }">
							<button
								class="overflow-hidden"
								aria-label="Author"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('author') }"
								@click.passive="toggleColumn('author')">
								Author
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('author') }"
								@click.passive="changeSort('author')"
								aria-label="Sort by Author">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div class="flex flex-row items-center" :class="{ 'text-emerald-300': queryBooks.sort.includes('series') }">
							<button
								class="overflow-hidden"
								aria-label="Series"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('series') }"
								@click.passive="toggleColumn('series')">
								Series
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('series') }"
								@click.passive="changeSort('series')"
								aria-label="Sort by Series">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div
							class="flex flex-row items-center"
							:class="{ 'text-emerald-300': queryBooks.sort.includes('text_length') }">
							<button
								class="overflow-hidden"
								aria-label="Size"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('text_length') }"
								@click.passive="toggleColumn('text_length')">
								Size
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('text_length') }"
								@click.passive="changeSort('text_length')"
								aria-label="Sort by Length">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0"
						:class="{ '!border-black ': scrolled }">
						<div
							class="flex flex-row items-center"
							:class="{ 'text-emerald-300': queryBooks.sort.includes('updated_at') }">
							<button
								class="overflow-hidden"
								aria-label="Updated"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('updated_at') }"
								@click.passive="toggleColumn('updated_at')">
								Updated
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('updated_at') }"
								@click.passive="changeSort('updated_at')"
								aria-label="Sort by Updated At">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
					<th
						class="th sticky top-0 !rounded-ee-none"
						:class="{ '!border-black ': scrolled }">
						<div
							class="flex flex-row items-center"
							:class="{ 'text-emerald-300': queryBooks.sort.includes('last_read') }">
							<button
								class="overflow-hidden whitespace-nowrap"
								aria-label="Last Read"
								:class="{ 'w-4 invisible first-letter:visible': shortColumns.includes('last_read') }"
								@click.passive="toggleColumn('last_read')">
								Last Read
							</button>
							<button
								class="inline-block size-4 ml-2"
								:class="{ hidden: shortColumns.includes('last_read') }"
								@click.passive="changeSort('last_read')"
								aria-label="Sort by Last Read">
								<svg class="size-4">
									<use v-if="queryBooks.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
									<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
								</svg>
							</button>
						</div>
					</th>
				</tr>
				<tr>
					<th class="th">
						<input
							form="searchForm"
							name="id"
							type="search"
							class="w-14 input"
							:class="{ hidden: shortColumns.includes('id') }"
							aria-label="Search"
							v-model="queryBooks.id"
							@search="getBooksByFilter" />
					</th>
					<th class="th">
						<input
							form="searchForm"
							name="name"
							type="search"
							class="input"
							:class="{ hidden: shortColumns.includes('name') }"
							aria-label="Search"
							v-model="queryBooks.name"
							@search="getBooksByFilter"
							autocomplete="off" />
					</th>
					<th class="th">
						<input
							form="searchForm"
							name="description"
							type="search"
							aria-label="Search"
							class="input"
							:class="{ hidden: shortColumns.includes('description') }"
							v-model="queryBooks.text"
							@search="getBooksByFilter"
							autocomplete="off" />
					</th>
					<th class="th">
						<select
							form="searchForm"
							name="tag"
							class="w-28 select"
							:class="{ hidden: shortColumns.includes('tags') }"
							aria-label="Search"
							v-model="queryBooks.tag"
							@change="getBooksByFilter">
							<option :value="undefined">All</option>
							<option v-for="tag in tags" :value="tag.name">{{ tag.name }}</option>
						</select>
					</th>
					<th class="th" :class="{ 'w-2': shortColumns.includes('rating') }">
						<select
							form="searchForm"
							name="rating"
							class="w-[5.5rem] select"
							:class="{ hidden: shortColumns.includes('rating') }"
							aria-label="Search"
							v-model="queryBooks.rating"
							@change="getBooksByFilter">
							<option :value="undefined">All</option>
							<option v-for="num in RATINGS" :value="num.value">{{ num.name }}</option>
						</select>
					</th>
					<th class="th">
						<input
							type="search"
							form="searchForm"
							name="count"
							class="input"
							:class="{ hidden: shortColumns.includes('count') }"
							aria-label="Search"
							v-model="queryBooks.view_count"
							@search="getBooksByFilter" />
					</th>
					<th class="th">
						<input
							type="search"
							form="searchForm"
							name="author"
							list="authorList"
							class="input"
							:class="{ hidden: shortColumns.includes('author') }"
							aria-label="Search"
							v-model="queryBooks.authorName"
							@search="getBooksByFilter"
							autocomplete="off" />
						<datalist id="authorList">
							<option v-for="author in authors" :value="author.name">{{ author.name }}</option>
						</datalist>
					</th>
					<th class="th">
						<input
							type="search"
							form="searchForm"
							name="series"
							list="seriesList"
							aria-label="Search"
							class="input"
							:class="{ hidden: shortColumns.includes('series') }"
							v-model="queryBooks.seriesName"
							@search="getBooksByFilter"
							autocomplete="off" />
						<datalist id="seriesList">
							<option v-for="seria in series" :value="seria.name">{{ seria.name }}</option>
						</datalist>
					</th>
					<th class="th">
						<select
							form="searchForm"
							name="size"
							class="select"
							:class="{ hidden: shortColumns.includes('text_length') }"
							aria-label="Search"
							v-model="queryBooks.size"
							@change="getBooksByFilter">
							<option :value="undefined">All</option>
							<option v-for="element in SIZES" :value="element">{{ element }}</option>
						</select>
					</th>
					<th class="th">
						<input
							type="date"
							form="searchForm"
							name="updated"
							class="w-40 input"
							:class="{ hidden: shortColumns.includes('updated_at') }"
							aria-label="Search"
							v-model="queryBooks.updated_at"
							@change="getBooksByFilter" />
					</th>
					<th class="th">
						<input
							type="date"
							form="searchForm"
							name="last"
							class="w-40 input"
							:class="{ hidden: shortColumns.includes('last_read') }"
							aria-label="Search"
							v-model="queryBooks.last_read"
							@change="getBooksByFilter" />
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="book in books" :key="book.id" class="tr">
					<td class="td">
						<router-link
							:to="{ name: 'book-update', params: { id: book.id } }"
							class="block"
							:class="{ hidden: shortColumns.includes('id') }">
							{{ book.id }}
						</router-link>
					</td>
					<td class="td">
						<router-link
							:to="{ name: isComics(book) ? 'comics-view' : 'book-view', params: { id: book.id } }"
							:title="book.name"
							class="line-clamp-2"
							:class="{ hidden: shortColumns.includes('name') }">
							{{ book.name }}
						</router-link>
					</td>
					<td class="td">
						<span class="line-clamp-2" :class="{ hidden: shortColumns.includes('description') }" :title="book.description">
							{{ book.description }}
						</span>
					</td>
					<td class="td">
						<span class="line-clamp-2" :class="{ hidden: shortColumns.includes('tags') }" :title="convertTagToString(book.tags)">
							{{ convertTagToString(book.tags) }}
						</span>
					</td>
					<td class="td w-5 text-center">
						<span v-if="book.rating" :class="{ hidden: shortColumns.includes('rating') }">
							{{ getBookRating(book.rating) }}
						</span>
					</td>
					<td class="td text-center">
						<span :class="{ hidden: shortColumns.includes('count') }">
							{{ book.view_count }}
						</span>
					</td>
					<td class="td">
						<button :class="{ hidden: shortColumns.includes('author') }" @click="setFilterUpdateList({...queryBooks, authorName: book.author?.name})">
							{{ book.author?.name }}
						</button>
					</td>
					<td class="td">
						<button :class="{ hidden: shortColumns.includes('series') }" @click="setFilterUpdateList({...queryBooks, seriesName: book.series?.name})">
							{{ book.series?.name }}
						</button>
					</td>
					<td class="td text-center">
						<span :class="{ hidden: shortColumns.includes('length') }">
							{{ sizeConverter(book.text_length) }}
						</span>
					</td>
					<td class="td text-center">
						<span :class="{ hidden: shortColumns.includes('updated_at') }">
							{{ convertTimestampToDate(book.updated_at) }}
						</span>
					</td>
					<td class="td text-center">
						<span :class="{ hidden: shortColumns.includes('last_read') }">
							{{ convertTimestampToDate(book.last_read) }}
						</span>
					</td>
				</tr>
				<SkeletonTableRow v-if="!books.length" count="11" />
			</tbody>
		</table>
		<TablePaginator v-if="booksMeta" :meta="booksMeta" @update-page="getBooksByPage" @update-limit="updateLimit" />
		<form name="searchForm"></form>
		<TheLoader v-if="loading" class="fixed m-auto inset-0 size-24 text-emerald-500" />
	</main>
</template>
