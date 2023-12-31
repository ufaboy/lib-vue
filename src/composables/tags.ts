import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTagStore } from '@/store/tagStore';
import { getRequest, getUrl, formRequest, fetchData, dataRequest } from '@/utils/helper';
import { Tag } from '@/interfaces/tag';

export function useTag() {
	const tagStore = useTagStore();
	const tag = ref<Tag>();
	const tagName = ref('');
	const { tags } = storeToRefs(tagStore);
	const tagDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const showNewTag = ref(false);

	async function getTags(query?: BaseQuery) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/tag`, query);
			const request = getRequest(url);
			const data = await fetchData<Tag[]>(request);
			tagStore.setTags(data);
		} catch (error) {
			console.log('getTags wrong', { error: error });
		}
	}
	async function updateTag() {
		try {
			const method = tag.value && tag.value.id ? 'PUT' : 'POST'
			const url =
				tag.value && tag.value.id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/tag/update?id=${tag.value.id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/tag/create`);

			const request = dataRequest(url, method, tag.value);
			const data = await fetchData<Tag>(request);
			if (tags.value) {
				const index = tags.value.findIndex((item) => item.id === data.id);
				if (index > -1) {
					tags.value[index] = data;
				} else {
					tags.value.push(data);
				}
			}
			closeTagDialog();
		} catch (error) {
			console.log({ 'updateTag wrong': error });
		}
	}
	function convertTagToString(tags?: Tag[]) {
		return tags
			? tags.reduce((previousValue, currentValue, index: number, array: Tag[]) => {
					return (previousValue += index !== array.length - 1 ? `${currentValue.name}, ` : `${currentValue.name}`);
				}, '')
			: ' — ';
	}
	function isComic(tags: string[]) {
		return tags.includes('comics');
	}
	function closeTagDialog() {
		if (tagDialog.value) tagDialog.value.close();
		showNewTag.value = false;
	}

	return {
		tag,
		tags,
		tagName,
		tagDialog,
		showNewTag,
		getTags,
		updateTag,
		isComic,
		convertTagToString,
		closeTagDialog,
	};
}
