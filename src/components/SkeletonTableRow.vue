<script setup lang="ts">
export interface Props {
	cells?: string | number;
	rows?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	cells: 10,
  rows: 10,
});
</script>
<template>
  <tr
    v-for="item in Number(rows)"
    :key="item"
    class="max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6">
    <td
      v-for="item in Number(cells)"
      :key="item"
      class="h-8 px-3 py-1">
      <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
    </td>
  </tr>
</template>
