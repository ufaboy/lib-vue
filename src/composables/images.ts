import { ref } from 'vue';
import { useRoutes } from './routes';
import { formRequest, deleteRequest, getRequest, getUrl, fetchData } from '@/utils/helper';
import type { Image, QueryImages, ImagesResponse } from '@/interfaces/images';
import type { ListMeta } from '@/interfaces/meta';

export function useImage() {
	const { updateQueryStringParameter } = useRoutes();
  
	const image = ref<Image>();
	const imageFileName = ref('');
	const images = ref<Image[]>([]);
	const imagesMeta = ref<ListMeta>();
	const queryImages = ref<QueryImages>({
		id: undefined,
		path: undefined,
		book_id: undefined,
		book_name: undefined,
		file_name: undefined,
		page: 1,
		perPage: 10,
		sort: 'id',
		expand: 'book',
	});
	const imageDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const isTableView = ref(true);
	const infinityState = ref(true);

	async function getImages(query?: BaseQuery) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/image`, {
				...queryImages.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<ImagesResponse>(request);
			images.value = data.items;
			imagesMeta.value = data._meta;
			updateQueryStringParameter(url.search);
		} catch (error) {
			console.log('getImages wrong', { error: error });
		}
	}

	async function getImagesAndPush(query: QueryImages) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/image`, {
				...queryImages.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<ImagesResponse>(request);
			if (data.items.length < queryImages.value.perPage) {
				infinityState.value = false;
			} else {
				queryImages.value.page++;
			}
			images.value = images.value.concat(data.items);
			imagesMeta.value = data._meta;
			updateQueryStringParameter(url.search);
		} catch (error) {
			console.log('getImages wrong', { error: error });
		}
	}

	async function deleteImages(images: Array<number>) {
		try {
			const promises = images.map((image) => {
				const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/image/delete?id=${image}`);
				const request = deleteRequest(url);
				return fetch(request);
			});
			return await Promise.allSettled(promises);
		} catch (error) {
			console.log('deleteImages wrong', { error: error });
		}
	}

	async function deleteAllImages(bookID: number) {
		try {
			const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/image/delete-all?bookId=${bookID}`);
			const request = deleteRequest(url);
			return await fetchData<Boolean>(request);
		} catch (error) {
			console.log('delete all Images wrong', { error: error });
		}
	}

	function getUploadedImageUrl(image: Image) {
		return import.meta.env.PROD
			? `/${image.path}/${image.file_name}`
			: `${import.meta.env.VITE_BACKEND_URL}/${image.path}/${image.file_name}`;
	}

	function getImageUrl(image: Blob) {
		return window.URL.createObjectURL(image);
	}

	async function copyImageUrl(image: Image) {
		const path = `${image.path}/${image.file_name}`;
		console.log('copyImageUrl', navigator, image, path);
		await navigator.clipboard.writeText(`<img class="picture" src="/${path}">`);
	}

	function changeSort(field: string) {
		queryImages.value.page = 1;
		const desc = queryImages.value.sort[0] === '-';
		queryImages.value.sort = `${desc ? '' : '-'}${field}`;
		getImages();
	}

	function closeDialog() {
		if (imageDialog.value) imageDialog.value.close();
		image.value = undefined;
	}

	function showImageDialog(img: Image) {
		image.value = img;
		imageFileName.value = img.file_name;
		if (imageDialog.value) imageDialog.value.showModal();
	}

	async function updateImage(event: Event) {
		try {
			if (!image.value) return false;
			const formElement = event.target as HTMLFormElement;
			const formData = new FormData(formElement);
			formData.append('id', image.value.id.toString());
			formData.append('path', image.value.path.toString());
			formData.append('book_id', image.value.book_id.toString());
			console.log('updateImage', formData);
			const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/image/update?id=${image.value.id}`);

			const request = formRequest(url, 'POST', formData);
			const data = await fetchData<Image>(request);
			image.value = data;
			const index = images.value.findIndex((item) => item.id === image.value?.id);
			if (index > -1) {
				images.value[index].file_name = image.value.file_name;
			}
			closeDialog();
		} catch (error) {
			console.log({ 'updateImage wrong': error });
		}
	}

	return {
		image,
		images,
		imagesMeta,
		queryImages,
		isTableView,
		imageDialog,
		imageFileName,
		infinityState,
		changeSort,
		getImages,
		getImagesAndPush,
		updateImage,
		deleteImages,
		deleteAllImages,
		getImageUrl,
		copyImageUrl,
		getUploadedImageUrl,
		closeDialog,
		showImageDialog,
	};
}
