import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Series } from '@/interfaces/series';

export const useSeriesStore = defineStore('series', () => {
	const series = ref<Series[]>();

	function setSeries(data: Series[]) {
		series.value = data;
	}

	return { series, setSeries };
});