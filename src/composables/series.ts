import { ref } from 'vue';
import { useSeriesStore } from '@/store/seriesStore';
import { formRequest, getUrl, fetchData, getRequest, dataRequest } from '@/utils/helper';
import type { QuerySeries, Series, SeriesResponse } from '@/interfaces/series';
import type { ListMeta } from '@/interfaces/meta';

export function useSeries() {
	const seriesStore = useSeriesStore();
	const seriesDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const seria = ref<Series>();
	const series = ref<Series[]>();
	const seriesMeta = ref<ListMeta>();
	const querySeries = ref<QuerySeries>({
		id: undefined,
		name: undefined,
		url: undefined,
		page: 1,
		perPage: 10,
		sort: 'id',
	});

	async function getSeries(query?: BaseQuery) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/series`, {
				...querySeries.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<SeriesResponse>(request);
			series.value = data.items;
			seriesMeta.value = data._meta;
			seriesStore.setSeries(data.items);
		} catch (error) {
			console.log('getSeries wrong', { error: error });
		}
	}
	async function updateSeries() {
		try {
			const method = seria.value && seria.value.id ? 'PUT' : 'POST';
			const url =
				seria.value && seria.value.id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/series/update?id=${seria.value.id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/series/create`);

			const request = dataRequest(url, method, { name: seria.value?.name, url: seria.value?.url });
			const data = await fetchData<Series>(request);
			if (series.value) {
				const seriesIndex = series.value.findIndex((item) => item.id === data.id);
				if (Number.isInteger(seriesIndex) && series.value) series.value[seriesIndex] = data;
			}
			closeDialog();
		} catch (error) {
			console.log({ 'updateSeries wrong': error });
		}
	}
	function changeSort(field: string) {
		querySeries.value.page = 1;
		const desc = querySeries.value.sort[0] === '-';
		querySeries.value.sort = `${desc ? '' : '-'}${field}`;
		getSeries();
	}
	function openSeriesDialog(seriesData?: Series) {
		seria.value = seriesData || { name: '', url: '' };
		seriesDialog.value?.showModal();
	}
	function closeDialog() {
		if (seriesDialog.value) seriesDialog.value.close();
	}

	return {
		seriesDialog,
		seria,
		series,
		seriesMeta,
		querySeries,
		getSeries,
		changeSort,
		updateSeries,
		openSeriesDialog,
		closeDialog,
	};
}
