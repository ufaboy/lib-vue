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
  <div class="table-paginator flex w-full items-center justify-around gap-2 py-3 md:justify-center">
    <div class="flex items-center gap-3">
      <label class="flex items-center gap-1">
        Limit:
        <select
          v-model="perPage"
          class="select"
          @change="$emit('updateLimit', perPage)">
          <option
            v-for="(size, index) in LIMIT"
            :key="index"
            :value="size">
            {{ size }}
          </option>
        </select>
      </label>
      <span>All: {{ meta.totalCount }}</span>
    </div>
    <nav
      class="flex flex-row flex-nowrap -space-x-px text-base"
      aria-label="Page navigation">
      <button
        class="btn-paginator"
        @click.passive="$emit('updatePage', meta.currentPage - 1)">
        <span class="sr-only relative">Previous</span>
        <svg class="size-6">
          <use xlink:href="/icons/iconSprite.svg#arrowBackward" />
        </svg>
      </button>
      <template v-if="meta.currentPage > 3">
        <button
          class="btn-paginator"
          @click.passive="$emit('updatePage', 1)">
          <span class="sr-only relative">First</span>
          <span>1</span>
        </button>
        <button
          class="btn-paginator"
          @click.passive="$emit('updatePage', meta.currentPage - 3)">
          <span class="sr-only relative">Previous cohort</span>
          <span>...</span>
        </button>
      </template>
      <button
        v-for="(page, index) in paginationArray"
        :key="index"
        class="btn-paginator"
        :class="{
          'btn-paginator-active': meta.currentPage === page,
          'btn-paginator-inactive': meta.currentPage !== page,
          '': meta.currentPage > 3,
        }"
        @click.passive="$emit('updatePage', page)">
        {{ page }}
      </button>
      <template v-if="meta.currentPage < meta.pageCount - 2">
        <button
          class="btn-paginator"
          @click.passive="$emit('updatePage', meta.currentPage + 3)">
          <span class="sr-only relative">Next cohort</span>
          <span>...</span>
        </button>
        <button
          class="btn-paginator"
          @click.passive="$emit('updatePage', meta.pageCount)">
          <span class="sr-only relative">Last</span>
          <span>{{ meta.pageCount }}</span>
        </button>
      </template>
      <button
        class="btn-paginator"
        @click.passive="$emit('updatePage', meta.currentPage + 1)">
        <span class="sr-only relative">Next</span>
        <svg class="size-6">
          <use xlink:href="/icons/iconSprite.svg#arrowForward" />
        </svg>
      </button>
    </nav>
  </div>
</template>
