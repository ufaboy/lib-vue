<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthor } from '@/composables/author';

import TablePaginator from '@/components/TablePaginator.vue';
import SkeletonTableRow from '@/components/SkeletonTableRow.vue';

document.title = 'Authors';

const props = defineProps({
	sidebarCollapsed: Boolean,
});

const {
	authorDialog,
	author,
	authors,
	authorsMeta,
	queryAuthors,
	getAuthors,
	updateAuthor,
	changeSort,
	openAuthorDialog,
	closeDialog,
	parseQueryAuthorParams,
} = useAuthor();
queryAuthors.value.perPage = 20;
const mounted = ref(false);

function getAuthorsByPage(page: number) {
	queryAuthors.value.page = page;
	getAuthors();
}

function startCreateAuthor() {
	author.value = { name: '', url: '' };
	authorDialog.value?.showModal();
}
function updateLimit(size: number) {
	queryAuthors.value.perPage = size;
	getAuthors();
}

onMounted(() => {
	mounted.value = true;
});

parseQueryAuthorParams();
getAuthors();
</script>

<template>
	<main class="">
		<table class="w-full table-auto" v-table-nav>
			<thead>
				<tr>
					<th class="th sticky top-0">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryAuthors.sort.includes('id') }"
							@click.passive="changeSort('id')">
							<span class="mr-1">ID</span>
							<svg class="size-4">
								<use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="th sticky top-0">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryAuthors.sort.includes('name') }"
							@click.passive="changeSort('name')">
							<span class="mr-1">Name</span>
							<svg class="size-4">
								<use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="th sticky top-0">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryAuthors.sort.includes('url') }"
							@click.passive="changeSort('url')">
							<span class="mr-1">URL</span>
							<svg class="size-4">
								<use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="author in authors"
					:key="author.id"
					class="tr"
					@click.passive="openAuthorDialog(author)">
					<td class="td">
						<div>{{ author.id }}</div>
					</td>
					<td class="td">
						<div>{{ author.name }}</div>
					</td>
					<td class="td">
						<div class="w-32 md:w-auto truncate">{{ author.url }}</div>
					</td>
				</tr>
				<SkeletonTableRow v-if="!authors?.length" count="3" />
			</tbody>
		</table>
		<TablePaginator
			v-if="authorsMeta && authorsMeta.pageCount > 1"
			:meta="authorsMeta"
			@update-page="getAuthorsByPage"
			@update-limit="updateLimit" />
		<Teleport v-if="mounted" to="#menu-target">
			<button
				class="nav-btn border flex items-center px-2 py-1 hover:bg-gray-600"
				:class="{ 'w-full': !sidebarCollapsed, 'w-fit': sidebarCollapsed }"
				@click.passive="startCreateAuthor">
				<svg aria-hidden="true" role="status" class="inline size-6" fill="none">
					<use xlink:href="/icons/iconSprite.svg#add" />
				</svg>
				<span v-if="!sidebarCollapsed">Create Author</span>
			</button>
		</Teleport>
		<dialog
			ref="authorDialog"
			class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-80"
			@close="closeDialog">
			<form action="" method="dialog" class="flex flex-row flex-wrap p-4" @submit.prevent="updateAuthor">
				<header class="w-full flex flex-row justify-between items-center mb-4">
					<h2 class="filter-title">{{ author && author.id ? 'Update' : 'Create' }}</h2>
				</header>
				<label v-if="author" for="name" class="w-full label mb-3">
					<span>Name</span>
					<input type="text" name="name" class="w-full input mt-1" v-model="author.name" />
				</label>
				<label v-if="author" for="url" class="w-full label mb-3">
					<span>URL</span>
					<input type="url" name="url" class="w-full input mt-1" v-model="author.url" />
				</label>
				<footer class="w-full flex flex-row justify-between items-center">
					<button type="reset" class="btn-gray-outline" aria-label="close" formnovalidate @click.passive="closeDialog">
						Close
					</button>
					<button class="btn-green" value="default">Save</button>
				</footer>
			</form>
		</dialog>
	</main>
</template>
