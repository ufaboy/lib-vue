import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthorStore } from '@/store/authorStore';
import { dataRequest, fetchData, getRequest, getUrl } from '@/utils/helper';
import type { Author, QueryAuthor, AuthorResponse } from '@/interfaces/author';
import type { ListMeta } from '@/interfaces/meta';

export function useAuthor() {
	const route = useRoute();
	const authorStore = useAuthorStore();
	const authorDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const authorName = ref('');
	const authorUrl = ref('');
	const author = ref<Author>();
	const authors = ref<Author[]>();
	const authorsMeta = ref<ListMeta>();
	const queryAuthors = ref<QueryAuthor>({
		id: undefined,
		name: undefined,
		url: undefined,
		page: 1,
		perPage: 10,
		sort: 'id',
	});

	async function getAuthors(query?: BaseQuery) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/author`, {
				...queryAuthors.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<AuthorResponse>(request);
			authors.value = data.items;
			authorsMeta.value = data._meta;
			authorStore.setAuthors(data.items);
		} catch (error) {
			console.log('getAuthors wrong', { error: error });
		}
	}

	async function updateAuthor() {
		try {
			const method = author.value && author.value.id ? 'PUT' : 'POST';
			const url =
				author.value && author.value.id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/author/update?id=${author.value.id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/author/create`);

			const request = dataRequest(url, method, { name: author.value?.name, url: author.value?.url });
			const data = await fetchData<Author>(request);
			if (authors.value) {
				const authorIndex = authors.value.findIndex((item) => item.id === data.id);
				if (Number.isInteger(authorIndex) && authors.value) authors.value[authorIndex] = data;
			}
			closeDialog();
		} catch (error) {
			console.log({ 'updateAuthor wrong': error });
		}
	}

	function changeSort(field: string) {
		queryAuthors.value.page = 1;
		const desc = queryAuthors.value.sort[0] === '-';
		queryAuthors.value.sort = `${desc ? '' : '-'}${field}`;
		getAuthors();
	}
	function openAuthorDialog(authorData?: Author) {
		author.value = authorData
			? { id: authorData.id, name: authorData.name, url: authorData.url }
			: { name: '', url: '' };
		authorDialog.value?.showModal();
	}
	function closeDialog() {
		if (authorDialog.value) authorDialog.value.close();
	}
	async function parseQueryAuthorParams() {
		const { id, name, url, sort, page, perPage } = route.query;
		if (id) queryAuthors.value.id = Number(id);
		if (name) queryAuthors.value.name = String(name);
		if (url) queryAuthors.value.url = String(url);
		if (sort) queryAuthors.value.sort = String(sort);
		if (page) queryAuthors.value.page = Number(page);
		if (perPage) queryAuthors.value.perPage = Number(perPage);
	}

	return {
		authorDialog,
		authorName,
		authorUrl,
		author,
		authors,
		authorsMeta,
		queryAuthors,
		getAuthors,
		updateAuthor,
		changeSort,
		openAuthorDialog,
		closeDialog,
		parseQueryAuthorParams,
	};
}
