<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBook } from '@/composables/book';
import { useMedia } from '@/composables/media';
import { PLAYER_INTERVALS } from '@/utils/constants';
import { useRoutes } from '@/composables/routes';
import { Book } from '@/interfaces/book';

document.title = 'Comics';

const route = useRoute();
const { updateQueryStringParameter } = useRoutes();
const bookID = Number(route.params.id);
const { readBook } = useBook();
const { getUploadedMediaUrl } = useMedia();

const book = ref<Book>();
const currentImageIndex = ref(0);
const mounted = ref(false);
const autoTurnPAgeON = ref(false);
const intervalSeconds = ref(5);
const renewIntervalID = ref();

const totalImages = computed(() => {
  return book.value && book.value.media ? book.value.media.length : '—';
});

const media = computed(() => {
  return book.value && book.value.media ? book.value.media[currentImageIndex.value] : null;
});

function increasePage() {
  if (book.value?.media && currentImageIndex.value < book.value.media.length - 1) {
    currentImageIndex.value++;
    updateQueryStringParameter(`page=${currentImageIndex.value + 1}`);
  }
}

function decreasePage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    updateQueryStringParameter(`page=${currentImageIndex.value + 1}`);
  }
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
  const queryPage = route.query.page;
  if (queryPage) currentImageIndex.value = Number(queryPage);
}

onMounted(async () => {
  mounted.value = true;
  book.value = await readBook(bookID);
});
onBeforeUnmount(() => clearInterval(renewIntervalID.value));
parseQuery();
</script>

<template>
  <main
    tabindex="0"
    class="h-[calc(100dvh_-_55px)] lg:h-auto"
    @keyup.left="decreasePage"
    @keyup.right="increasePage">
    <div class="relative flex size-full justify-center">
      <img
        v-if="media"
        :src="getUploadedMediaUrl(media)"
        class="h-full max-h-[calc(100dvh_-_55px)] max-w-full overflow-hidden rounded-lg object-contain lg:max-h-dvh">
      <button
        type="button"
        class="group absolute left-0 top-1/4 z-30 flex h-1/2 cursor-pointer items-center justify-center px-4 focus:outline-none lg:top-0 lg:h-full"
        data-carousel-prev
        @click.passive="decreasePage">
        <span
          class="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
          <svg>
            <use xlink:href="/icons/iconSprite.svg#arrowBackward" />
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        class="group absolute right-0 top-1/4 z-30 flex h-1/2 cursor-pointer items-center justify-center px-4 focus:outline-none lg:top-0 lg:h-full"
        data-carousel-next
        @click.passive="increasePage">
        <span
          class="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
          <svg>
            <use xlink:href="/icons/iconSprite.svg#arrowForward" />
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    </div>
    <Teleport v-if="mounted" to="#menu-target">
      <div class="flex flex-row lg:flex-wrap gap-2">
        <div class="max-w-[200px] truncate leading-8">
          {{ book?.name }}
        </div>
        <div class="whitespace-nowrap leading-8">
          {{ currentImageIndex + 1 }}/{{ totalImages }}
        </div>
        <div class="flex items-center gap-2">
        <button class="btn-header-green hidden sm:block p-1.5" @click.passive="autoTurnPage">
          Auto {{ autoTurnPAgeON ? 'ON' : 'OFF' }}
        </button>
        <input
          v-model="intervalSeconds"
          type="number"
          list="turn-second-list"
          class="hidden w-16 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:block sm:text-xs">
        <datalist id="turn-second-list">
          <option v-for="(item, index) in PLAYER_INTERVALS" :key="index" :value="item" />
        </datalist>
      </div>
      </div>
    </Teleport>
  </main>
</template>