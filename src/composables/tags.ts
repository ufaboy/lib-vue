import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTagStore } from '@/store/tagStore';
import { getRequest, getUrl, formRequest, fetchData, dataRequest } from '@/utils/helper';
import { Tag } from '@/interfaces/tag';
import { BaseQuery } from '@/interfaces/meta';

export function useTag() {
	const tagStore = useTagStore();
	const tag = ref<Tag>();
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

	async function updateTag(event: Event) {
		try {
			const target = event.target as HTMLFormElement;
			const formData = new FormData(target);
			const id = formData.get('id') as string;
			const name = formData.get('name') as string;

			const method = id ? 'PUT' : 'POST'
			const url = id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/tag/update?id=${id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/tag/create`);

			const request = dataRequest(url, method, { name });
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
		tag.value = undefined;
		showNewTag.value = false;
		if (tagDialog.value) tagDialog.value.close();
	}

	return {
		tag,
		tags,
		tagDialog,
		showNewTag,
		getTags,
		updateTag,
		isComic,
		convertTagToString,
		closeTagDialog,
	};
}
