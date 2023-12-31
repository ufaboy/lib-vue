import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Tag } from '@/interfaces/tag';

export const useTagStore = defineStore('tag', () => {
	const tags = ref<Array<Tag>>();

	function setTags(data: Tag[]) {
		tags.value = data;
	}

	return { tags, setTags };
});
