<script setup lang="ts">
import { useImage } from '@/composables/images';
import { Image } from '@/interfaces/images';

const { imageFileName, updateImage, getUploadedImageUrl, closeDialog } = useImage();

const props = defineProps<{
	image: Image;
}>();
const emit = defineEmits(['close']);

function reset() {
	imageFileName.value = props.image.file_name;
}

reset();
</script>

<template>
	<form id="Image" method="dialog" name="Image" class="flex flex-row flex-wrap" @submit.prevent="updateImage">
		<header class="mb-4 flex w-full flex-row items-center justify-between">
			<h2 class="filter-title">
				{{ props.image.file_name }}
			</h2>
			<button class="close-btn hover:animate-spin" type="reset" @click.passive="$emit('close')">
				<svg class="size-6"><use xlink:href="/icons/iconSprite.svg#close" /></svg>
			</button>
		</header>
		<img :src="getUploadedImageUrl(props.image)" alt="" class="mx-auto mb-4 max-h-96 max-w-xs" />
		<label class="mb-4">
			<span>File name</span>
			<input
				v-model="imageFileName"
				type="text"
				name="file_name"
				class="mt-1 w-full rounded-md p-2 dark:bg-slate-700" />
		</label>
		<footer class="flex w-full flex-row items-center justify-between">
			<button type="reset" class="btn-gray-outline" @click.passive.prevent="reset">Reset</button>
			<button class="btn-green" value="default">Save</button>
		</footer>
	</form>
</template>
