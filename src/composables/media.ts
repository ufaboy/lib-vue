import { ref } from 'vue';
import { formRequest, deleteRequest, getRequest, getUrl, fetchData } from '@/utils/helper';
import type { Media, QueryMedia, MediaResponse, StorageMedia } from '@/interfaces/media';
import type { ListMeta } from '@/interfaces/meta';

export function useMedia() {
	const media = ref<Media>();
	const mediaFileName = ref('');
	const mediaList = ref<Media[]>([]);
	const mediaMeta = ref<ListMeta>();
	const queryMedia = ref<QueryMedia>({
		id: undefined,
		path: undefined,
		book_id: undefined,
		book_name: undefined,
		file_name: undefined,
		page: undefined,
		perPage: undefined,
		sort: 'id',
		expand: 'book',
	});
	const mediaDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const isTableView = ref(true);
	const infinityState = ref(true);
	const storageMedia = ref<Array<StorageMedia>>([]);

	async function getMediaByName(bookID: number, mediaName: string) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/media/view-by-name`, { bookID, mediaName });
			const request = getRequest(url);
			return await fetchData<Media>(request);
		} catch (error) {
			console.log('getMediaByName wrong', { error: error });
		}
	}

	async function getMediaList(query?: BaseQuery) {
		try {
			if (!queryMedia.value.book_id && !queryMedia.value.book_name) {
				return null;
			}
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/media`, {
				...queryMedia.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<MediaResponse>(request);
			mediaList.value = data.items;
			mediaMeta.value = data._meta;
		} catch (error) {
			console.log('getMediaList wrong', { error: error });
		}
	}

	async function getMediaListAndPush(query: QueryMedia) {
		try {
			if (!queryMedia.value.perPage || !queryMedia.value.page) {
				return;
			}
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/media`, {
				...queryMedia.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<MediaResponse>(request);
			if (data.items.length < queryMedia.value.perPage) {
				infinityState.value = false;
			} else {
				queryMedia.value.page++;
			}
			mediaList.value = mediaList.value.concat(data.items);
			mediaMeta.value = data._meta;
		} catch (error) {
			console.log('getMediaList wrong', { error: error });
		}
	}

	async function deleteMedia(mediaList: Array<number>) {
		try {
			const promises = mediaList.map((media) => {
				const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/media/delete?id=${media}`);
				const request = deleteRequest(url);
				return fetch(request);
			});
			return await Promise.allSettled(promises);
		} catch (error) {
			console.log('deleteMedia wrong', { error: error });
		}
	}

	async function deleteAllMedia(bookID: number) {
		try {
			const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/media/delete-all?bookId=${bookID}`);
			const request = deleteRequest(url);
			return await fetchData<Boolean>(request);
		} catch (error) {
			console.log('delete all Media wrong', { error: error });
		}
	}

	function getUploadedMediaUrl(media: Media) {
		return import.meta.env.PROD
			? `/${media.path}/${media.file_name}`
			: `${import.meta.env.VITE_BACKEND_URL}/${media.path}/${media.file_name}`;
	}
	function getStorageMediaUrl(mediaName: string, dirID: number) {
		const bookPath = `book_${String(dirID).padStart(3, '0')}`;
		return import.meta.env.PROD
			? `/media/${bookPath}/${mediaName}`
			: `${import.meta.env.VITE_BACKEND_URL}/media/${bookPath}/${mediaName}`;
	}

	function getMediaUrl(media: Blob) {
		return window.URL.createObjectURL(media);
	}

	async function copyMediaUrl(media: Media) {
		const path = `${media.path}/${media.file_name}`;
		// console.log('copyMediaUrl', navigator, media, path);
		const code = getMediaType(media) === 'image' ? `<img class="picture" src="/${path}">` : `<video autoplay loop muted playsinline class="picture" src="/${path}" type="video/mp4"></video>\r`
		await navigator.clipboard.writeText(code);
	}

	function changeSort(field: string) {
		if (queryMedia.value.page) {
			queryMedia.value.page = 1;
		}
		const desc = queryMedia.value.sort[0] === '-';
		queryMedia.value.sort = `${desc ? '' : '-'}${field}`;
		getMediaList();
	}

	function closeDialog() {
		if (mediaDialog.value) mediaDialog.value.close();
		media.value = undefined;
	}

	async function showMediaDialog(bookID: number, mediaName: string) {
		const img = await getMediaByName(bookID, mediaName);
		if (img) {
			media.value = img;
			mediaFileName.value = img.file_name;
		}
		if (mediaDialog.value) mediaDialog.value.showModal();
	}

	async function updateMedia(event: Event) {
		try {
			if (!media.value) return false;
			const formElement = event.target as HTMLFormElement;
			const formData = new FormData(formElement);
			formData.append('id', media.value.id.toString());
			formData.append('path', media.value.path.toString());
			formData.append('book_id', media.value.book_id.toString());
			const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/media/update?id=${media.value.id}`);
			const request = formRequest(url, 'POST', formData);
			const data = await fetchData<Media>(request);
			media.value = data;
			const index = mediaList.value.findIndex((item) => item.id === media.value?.id);
			if (index > -1) {
				mediaList.value[index].file_name = media.value.file_name;
			}
			closeDialog();
		} catch (error) {
			console.log({ 'updateMedia wrong': error });
		}
	}

	async function getTotal() {
		try {
			const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/media/total`);
			const request = getRequest(url);
			const data = await fetchData<Array<StorageMedia>>(request);
			storageMedia.value = data;
		} catch (error) {}
	}

	function getMediaType(media: Media) {
		return media.file_name.includes('.mp4') ? 'video' : 'image';
	}

	return {
		media,
		mediaList,
		storageMedia,
		mediaMeta,
		queryMedia,
		isTableView,
		mediaDialog,
		mediaFileName,
		infinityState,
		changeSort,
		getTotal,
		getMediaByName,
		getMediaList,
		getMediaListAndPush,
		updateMedia,
		deleteMedia,
		deleteAllMedia,
		getMediaUrl,
		copyMediaUrl,
		getStorageMediaUrl,
		getUploadedMediaUrl,
		closeDialog,
		showMediaDialog,
	};
}
