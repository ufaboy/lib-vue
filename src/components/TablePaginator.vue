<script setup lang="ts">
import { ref, watch } from 'vue';
import { LIMIT } from '@/utils/constants';
import { ListMeta } from '@/interfaces/meta';

const props = defineProps<{
	meta: ListMeta;
}>();
const emit = defineEmits<{
	updatePage: [id: number];
	updateLimit: [size: number];
}>();
const perPage = ref<number>(0);
const paginationArray = ref<number[]>();

function createPagination(meta: ListMeta) {
	let minPage = Math.max(1, meta.currentPage - 2);
	let maxPage = Math.min(meta.pageCount, minPage + 4);
	minPage = Math.max(1, maxPage - 4);

	const pagination: number[] = [];
	for (let i = minPage; i <= maxPage; i++) {
		pagination.push(i);
	}
	paginationArray.value = pagination;
}

watch(
	() => props.meta,
	() => createPagination(props.meta),
);

perPage.value = props.meta.perPage;
createPagination(props.meta);
</script>

<template>
	<div class="table-paginator w-full flex justify-around md:justify-center items-center py-3 gap-2">
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-1">
				Limit:
				<select v-model="perPage" class="select" @change="$emit('updateLimit', perPage)">
					<option v-for="(size, index) in LIMIT" :key="index" :value="size">
						{{ size }}
					</option>
				</select>
			</label>
			<span>All: {{ meta.totalCount }}</span>
		</div>
		<nav class="flex flex-row flex-nowrap -space-x-px text-base" aria-label="Page navigation">
			<button @click="$emit('updatePage', meta.currentPage - 1)" class="btn-paginator">
				<span class="sr-only">Previous</span>
				<svg class="size-6">
					<use xlink:href="/icons/iconSprite.svg#arrowBackward" />
				</svg>
			</button>
			<template v-if="meta.currentPage > 3">
				<button @click="$emit('updatePage', 1)" class="btn-paginator">
					<span class="sr-only">First</span>
					<span>1</span>
				</button>
				<button @click="$emit('updatePage', meta.currentPage - 3)" class="btn-paginator">
					<span class="sr-only">Previous cohort</span>
					<span>...</span>
				</button>
			</template>
			<button
				v-for="page in paginationArray"
				@click="$emit('updatePage', page)"
				class="btn-paginator"
				:class="{
					'btn-paginator-active': meta.currentPage === page,
					'btn-paginator-inactive': meta.currentPage !== page,
					'': meta.currentPage > 3,
				}">
				{{ page }}
			</button>
			<template v-if="meta.currentPage < meta.pageCount - 2">
				<button @click="$emit('updatePage', meta.currentPage + 3)" class="btn-paginator">
					<span class="sr-only">Next cohort</span>
					<span>...</span>
				</button>
				<button @click="$emit('updatePage', meta.pageCount)" class="btn-paginator">
					<span class="sr-only">Last</span>
					<span>{{ meta.pageCount }}</span>
				</button>
			</template>
			<button @click="$emit('updatePage', meta.currentPage + 1)" class="btn-paginator">
				<span class="sr-only">Next</span>
				<svg class="size-6">
					<use xlink:href="/icons/iconSprite.svg#arrowForward" />
				</svg>
			</button>
		</nav>
	</div>
</template>
