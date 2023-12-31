<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSeries } from '@/composables/series';

import TablePaginator from '@/components/TablePaginator.vue';
import SkeletonTableRow from '@/components/SkeletonTableRow.vue';

document.title = 'Series';

const {
	seriesDialog,
	seria,
	series,
	seriesMeta,
	querySeries,
	getSeries,
	changeSort,
	openSeriesDialog,
	updateSeries,
	closeDialog,
} = useSeries();
querySeries.value.perPage = 20;
const mounted = ref(false);

function getSeriesByPage(page: number) {
	querySeries.value.page = page;
	getSeries();
}

function startCreateSeries() {
	seria.value = { name: '', url: '' };
	seriesDialog.value?.showModal();
}

function updateLimit(size: number) {
	querySeries.value.perPage = size;
	getSeries();
}

onMounted(() => {
	mounted.value = true;
});

getSeries();
</script>

<template>
	<main class="px-2 lg:px-4">
		<Teleport v-if="mounted" to="#header-target">
			<button class="btn-header-green" @click="startCreateSeries">Create Series</button>
		</Teleport>
		<table class="w-full table-auto" v-table-nav>
			<thead>
				<tr>
					<th class="p-1">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': querySeries.sort.includes('id') }"
							@click="changeSort('id')">
							<span class="mr-1">ID</span>
							<svg class="size-4">
								<use v-if="querySeries.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="p-1">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': querySeries.sort.includes('name') }"
							@click="changeSort('name')">
							<span class="mr-1">Name</span>
							<svg class="size-4">
								<use v-if="querySeries.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="p-1">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': querySeries.sort.includes('url') }"
							@click="changeSort('url')">
							<span class="mr-1">URL</span>
							<svg class="size-4">
								<use v-if="querySeries.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="part in series"
					:key="part.id"
					class="border-b border-slate-600 cursor-pointer"
					@click="openSeriesDialog(part)">
					<td class="p-1">
						<span>{{ part.id }}</span>
					</td>
					<td class="p-1">
						<span>{{ part.name }}</span>
					</td>
					<td class="p-1">
						<div class="w-32 md:w-auto max-w-[300px] truncate">
							{{ part.url }}
						</div>
					</td>
				</tr>
				<SkeletonTableRow v-if="!series?.length" count="3" />
			</tbody>
		</table>
		<TablePaginator
			v-if="seriesMeta && seriesMeta.pageCount > 1"
			:meta="seriesMeta"
			@update-page="getSeriesByPage"
			@update-limit="updateLimit" />
		<dialog
			ref="seriesDialog"
			class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-80"
			@close="closeDialog">
			<form action="" method="dialog" class="flex flex-row flex-wrap p-4" @submit.prevent="updateSeries">
				<header class="w-full flex flex-row justify-between items-center mb-4">
					<h2 class="filter-title">
						{{ seria && seria.id ? 'Update' : 'Create' }}
					</h2>
				</header>
				<label v-if="seria" for="name" class="label w-full mb-3">
					<span>Name</span>
					<input type="text" name="name" class="w-full input mt-1" v-model="seria.name" />
				</label>
				<label v-if="seria" for="url" class="label w-full mb-3">
					<span>URL</span>
					<input type="url" name="url" class="w-full input mt-1" v-model="seria.url" />
				</label>
				<footer class="w-full flex flex-row justify-between items-center">
					<button type="reset" class="btn-gray-outline" aria-label="close" formnovalidate @click="closeDialog">
						Close
					</button>
					<button class="btn-green" value="default">Save</button>
				</footer>
			</form>
		</dialog>
	</main>
</template>
