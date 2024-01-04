<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBook } from '@/composables/book';
import { useImage } from '@/composables/images';
import { PLAYER_INTERVALS } from '@/utils/constants';
import { useRoutes } from '@/composables/routes';

document.title = 'Comics';

const route = useRoute();
const {updateQueryStringParameter} = useRoutes()
const bookID = Number(route.params.id);
const { book, getBook } = useBook();
const { getUploadedImageUrl } = useImage();
const currentImageIndex = ref(0);
const mounted = ref(false);

const autoTurnPAgeON = ref(false);
const intervalSeconds = ref(5);
const renewIntervalID = ref();

const totalImages = computed(() => {
	return book.value && book.value.images ? book.value.images.length : '—';
});

const image = computed(()=> {
  return book.value && book.value.images ? book.value.images[currentImageIndex.value] : null
})

function increasePage() {
	if (book.value?.images && currentImageIndex.value < book.value.images.length - 1) {
    currentImageIndex.value++;
    updateQueryStringParameter(`page=${currentImageIndex.value}`)
  }
}

function decreasePage() {
	if (currentImageIndex.value > 0) currentImageIndex.value--;
}

function autoTurnPage() {
	if (autoTurnPAgeON.value) {
		autoTurnPAgeON.value = false;
		clearInterval(renewIntervalID.value);
	} else {
		autoTurnPAgeON.value = true;
		renewIntervalID.value = setInterval(() => increasePage(), intervalSeconds.value * 1000);
	}
}

function parseQuery() {
  const queryPage = route.query.page
  if( queryPage ) currentImageIndex.value = Number(queryPage)
}

onMounted(() => {
  mounted.value = true
});
onBeforeUnmount(() => clearInterval(renewIntervalID.value));
parseQuery()
getBook(bookID);
</script>

<template>
  <main
    class="px-2 lg:px-4"
    tabindex="0"
    @keyup.left="decreasePage"
    @keyup.right="increasePage"
  >
    <div
      v-if="book && book.images"
      id="default-carousel"
      class="relative w-full"
      data-carousel="slide"
    >
      <img v-if="image"
        :src="getUploadedImageUrl(image)"
        class="max-h-[calc(100dvh_-_75px)] max-w-full overflow-hidden rounded-lg"
      >
      <!--       <div class="relative h-[calc(100dvh_-_75px)] overflow-hidden rounded-lg">
        <div
          v-for="(image, index) in book.images"
          :key="index"
          class="duration-700 ease-in-out"
          :class="{ hidden: currentImageIndex !== index }"
          data-carousel-item
        >
          <img v-if="index < currentImageIndex + 2 && index > currentImageIndex - 2"
            :src="getUploadedImageUrl(image)"
            class="absolute left-1/2 top-1/2 block h-full -translate-x-1/2 -translate-y-1/2 object-contain"
            alt="..."
          >
        </div>
      </div> -->
      <button
        type="button"
        class="group absolute left-0 top-1/2 z-30 flex h-1/2 cursor-pointer items-center justify-center px-4 focus:outline-none md:top-0 md:h-full"
        data-carousel-prev
        @click="decreasePage"
      >
        <span
          class="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
        >
          <svg><use xlink:href="/icons/iconSprite.svg#arrowBackward" /></svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        class="group absolute right-0 top-1/2 z-30 flex h-1/2 cursor-pointer items-center justify-center px-4 focus:outline-none md:top-0 md:h-full"
        data-carousel-next
        @click="increasePage"
      >
        <span
          class="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
        >
          <svg><use xlink:href="/icons/iconSprite.svg#arrowForward" /></svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    </div>
    <Teleport
      v-if="mounted"
      to="#header-target"
    >
      <div class="flex flex-row">
        <div class="mr-3 max-w-[200px] truncate leading-8">
          {{ book?.name }}
        </div>
        <div class="mr-3 whitespace-nowrap leading-8">
          {{ currentImageIndex + 1 }}/{{ totalImages }}
        </div>
        <button
          class="btn-header-green mr-2 hidden sm:block"
          @click="autoTurnPage"
        >
          Auto {{ autoTurnPAgeON ? 'ON' : 'OFF' }}
        </button>
        <input
          v-model="intervalSeconds"
          type="number"
          list="turn-second-list"
          class="hidden w-16 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:block sm:text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
        <datalist id="turn-second-list">
          <option
            v-for="(item, index) in PLAYER_INTERVALS"
            :key="index"
            :value="item"
          />
        </datalist>
      </div>
    </Teleport>
  </main>
</template>
