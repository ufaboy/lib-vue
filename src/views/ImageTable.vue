<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useImage } from '@/composables/images';

import SkeletonTableRow from '@/components/SkeletonTableRow.vue';
import ImageForm from '@/components/forms/ImageForm.vue';

document.title = 'Images Table';

const { image, images, queryImages, imageDialog, totalBooks, getImages, changeSort, closeDialog, showImageDialog, getTotal } =
	useImage();

const commonCheckbox = ref<HTMLInputElement | null>(null);
const checkedArray = ref<Array<boolean>>([]);
const mounted = ref(false);

const allchecked = computed({
	get() {
		return calcChecked(checkedArray.value);
	},
	set(newValue) {
		checkedArray.value.fill(newValue);
	},
});

const skeletonShow = computed(() => {
	return images.value ? !images.value.length : true;
});

watch(
	() => images.value,
	() => {
		checkedArray.value.length = images.value.length;
		checkedArray.value.fill(false);
	},
);

function calcChecked(arr: Array<boolean>) {
	if (arr.includes(false) && arr.includes(true)) {
		if (commonCheckbox.value) commonCheckbox.value.indeterminate = true;
		return false;
	} else if (arr.includes(false)) {
		if (commonCheckbox.value) commonCheckbox.value.indeterminate = false;
		return false;
	} else if (arr.includes(true)) {
		if (commonCheckbox.value) commonCheckbox.value.indeterminate = false;
		return true;
	} else return false;
}

onMounted(() => {
	mounted.value = true;
});
getTotal()
</script>

<template>
	<main class="px-2 lg:px-4">
		<table v-table-nav class="table-auto">
			<thead>
				<tr>
					<th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<input ref="commonCheckbox" v-model="allchecked" type="checkbox" class="size-4 align-middle" />
					</th>
					<!-- <th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryImages.sort.includes('id') }"
							@click="changeSort('id')">
							<span class="mr-1">ID</span>
							<svg class="size-4">
								<use v-if="queryImages.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th> -->
					<th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryImages.sort.includes('book_id') }"
							@click="changeSort('book_id')">
							<span class="mr-1">Book ID</span>
							<svg class="size-4">
								<use v-if="queryImages.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryImages.sort.includes('book_name') }"
							@click="changeSort('book_name')">
							<span class="mr-1">Book Name</span>
							<svg class="size-4">
								<use v-if="queryImages.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryImages.sort.includes('file_name') }"
							@click="changeSort('file_name')">
							<span class="mr-1">Name</span>
							<svg class="size-4">
								<use v-if="queryImages.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="sticky top-[50px] rounded-tl border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<button
							class="flex flex-row flex-nowrap items-center"
							:class="{ 'text-emerald-300': queryImages.sort.includes('path') }"
							@click="changeSort('path')">
							<span class="mr-1">Path</span>
							<svg class="size-4">
								<use v-if="queryImages.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
								<use v-else xlink:href="/icons/iconSprite.svg#ascending" />
							</svg>
						</button>
					</th>
					<th class="sticky top-[50px] rounded-tr border-b border-transparent bg-white p-1 dark:bg-gray-700">
						<span>Actions</span>
					</th>
				</tr>
				<tr>
					<th class="rounded-bl p-1 dark:bg-gray-700" />
					<th class="p-1 dark:bg-gray-700">
						<input
							v-model="queryImages.book_id"
							form="searchForm"
							name="book_id"
							type="search"
							list="totalBooksId"
							class="input w-20 text-center"
							aria-label="Search"
							@search="getImages" />
							<datalist id="totalBooksId">
							<option v-for="item in totalBooks" :value="item.book_id">
								Count: {{ item.images_count }}
							</option>
						</datalist>
					</th>
					<th class="p-1 dark:bg-gray-700">
						<input
							v-model="queryImages.bookName"
							form="searchForm"
							name="bookName"
							type="search"
							class="input"
							aria-label="Search"
							@search="getImages" />
					</th>
					<!-- <th class="p-1 dark:bg-gray-700" /> -->
					<th class="p-1 dark:bg-gray-700" />
					<th class="p-1 dark:bg-gray-700" />
					<th class="rounded-br p-1 dark:bg-gray-700" />
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(file, index) in images"
					:key="file.id"
					class="cursor-pointer border-b border-slate-600"
					:class="{ 'bg-slate-500': file === image }">
					<td class="text-center">
						<input v-model="checkedArray[index]" type="checkbox" class="h-4 w-4 align-middle" />
					</td>
					<td class="text-center">
						<span>{{ file.book?.id }}</span>
					</td>
					<td class="text-center">
						<span class="whitespace-nowrap">{{ file.book?.name }}</span>
					</td>
					<!-- <td class="text-center">
						<span>{{ file.id }}</span>
					</td> -->
					<td class="text-center">
						<span class="whitespace-nowrap">{{ file.file_name }}</span>
					</td>
					<td class="text-center">
						<span>{{ file.path }}</span>
					</td>
					<td class="text-center">
						<button class="align-middle" @click="image = file">
							<svg class="size-6" @click="showImageDialog(file)"><use xlink:href="/icons/iconSprite.svg#edit" /></svg>
						</button>
					</td>
				</tr>
				<SkeletonTableRow v-if="skeletonShow" count="5" />
			</tbody>
		</table>
		<dialog
			ref="imageDialog"
			class="dialog max-w-sm rounded-lg bg-neutral-300 p-4 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
			@close="closeDialog">
			<ImageForm v-if="image" :image="image" @close="closeDialog" />
		</dialog>
		<Teleport v-if="mounted" to="#header-target">
			<RouterLink :to="{ name: 'images-gallery' }" class="whitespace-nowrap"> Gallery View </RouterLink>
		</Teleport>
	</main>
</template>
