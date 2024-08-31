import { ref } from 'vue';
import { useSeriesStore } from '@/store/seriesStore';
import { getUrl, fetchData, getRequest, dataRequest } from '@/utils/helper';
import type { QuerySeries, Series, SeriesResponse } from '@/interfaces/series';
import type { BaseQuery, ListMeta } from '@/interfaces/meta';

export function useSeries() {
	const seriesStore = useSeriesStore();
	const seriesDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const series = ref<Partial<Series>>();
	const seriesList = ref<Series[]>();
	const seriesMeta = ref<ListMeta>();
	const querySeries = ref<QuerySeries>({
		id: undefined,
		name: undefined,
		url: undefined,
		page: 1,
		perPage: window.innerHeight > 1000 ? 20 : 10,
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
			seriesList.value = data.items;
			seriesMeta.value = data._meta;
			seriesStore.setSeries(data.items);
		} catch (error) {
			console.log('getSeries wrong', { error: error });
		}
	}

	async function updateSeries(seriesData: Partial<Series>) {
		try {
			const method = seriesData.id ? 'PUT' : 'POST';
			const url =
			seriesData.id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/series/update?id=${seriesData.id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/series/create`);

			const request = dataRequest(url, method, { name: seriesData?.name, url: seriesData?.url });
			const data = await fetchData<Series>(request);
			if (seriesList.value) {
				const seriesIndex = seriesList.value.findIndex((item) => item.id === data.id);
				if (seriesIndex > -1) {
					seriesList.value[seriesIndex] = data;
				} else {
					seriesList.value.push(data);
				}
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
		if(seriesData) {
			series.value = seriesData;
		}
		seriesDialog.value?.showModal();
	}

	function closeDialog() {
		if (seriesDialog.value) {
			seriesDialog.value.close();
			series.value = undefined
		}
	}

	return {
		seriesDialog,
		series,
		seriesList,
		seriesMeta,
		querySeries,
		getSeries,
		changeSort,
		updateSeries,
		openSeriesDialog,
		closeDialog,
	};
}
