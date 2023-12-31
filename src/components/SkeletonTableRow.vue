<script setup lang="ts">
export interface Props {
	count?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	count: 10,
});
</script>
<template>
	<tr
		class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
		<td v-for="item in Number(count)" :key="item" class="h-8 py-1 px-3">
			<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
		</td>
	</tr>
</template>
