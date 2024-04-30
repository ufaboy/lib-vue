<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSeries } from '@/composables/series';

import SeriesForm from '@/components/forms/SeriesForm.vue';
import TablePaginator from '@/components/TablePaginator.vue';
import SkeletonTableRow from '@/components/SkeletonTableRow.vue';

document.title = 'Series';

const props = defineProps({
  sidebarCollapsed: Boolean,
});

const {
  seriesDialog,
  series,
  seriesList,
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
  series.value = { name: '', url: '' };
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
  <main class="">
    <Teleport v-if="mounted" to="#menu-target">
      <button
        class="nav-btn flex items-center border px-2 py-1 hover:bg-gray-600"
        :class="{ 'w-full': !sidebarCollapsed, 'w-fit': sidebarCollapsed }"
        @click.passive="startCreateSeries">
        <svg
          aria-hidden="true"
          role="status"
          class="inline size-6"
          fill="none">
          <use xlink:href="/icons/iconSprite.svg#add" />
        </svg>
        <span v-if="!sidebarCollapsed">Create Series</span>
      </button>
    </Teleport>
    <table v-table-nav class="w-full table-auto">
      <thead>
        <tr>
          <th class="th">
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
          <th class="th">
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
          <th class="th">
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
          v-for="part in seriesList"
          :key="part.id"
          class="tr"
          @click="openSeriesDialog(part)">
          <td class="td">
            <span>{{ part.id }}</span>
          </td>
          <td class="td">
            <span>{{ part.name }}</span>
          </td>
          <td class="td">
            <div class="w-32 max-w-[300px] truncate md:w-auto">
              {{ part.url }}
            </div>
          </td>
        </tr>
        <SkeletonTableRow v-if="!seriesList?.length" count="3" />
      </tbody>
    </table>
    <TablePaginator
      v-if="seriesMeta && seriesMeta.pageCount > 1"
      :meta="seriesMeta"
      @update-page="getSeriesByPage"
      @update-limit="updateLimit" />
    <dialog
      ref="seriesDialog"
      class="dialog w-80 rounded-lg bg-neutral-300 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
      @close="closeDialog">
      <SeriesForm
        v-if="series"
        :series="series"
        @update:series="updateSeries"
        @close="closeDialog" />
    </dialog>
  </main>
</template>
