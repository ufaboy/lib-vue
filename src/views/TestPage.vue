<script setup lang="ts">
import ButtonExt from '@/components/ButtonExt.vue';

document.title = 'Test Page';
</script>

<template>
  <main class="p-3">
    <h1>TestPage</h1>
    <div class="mt-8 flex flex-wrap items-center gap-4">
      <h2 class="w-full">
        Form Elements
      </h2>
      <ButtonExt
        class="btn-yellow h-10">
        Save
        <template #append>
          <svg
            aria-hidden="true"
            role="status"
            class="inline size-6 animate-spin text-white">
            <use xlink:href="/icons/iconSprite.svg#loadingRing" />
          </svg>
        </template>
      </ButtonExt>
      <button
        disabled
        type="button"
        class="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg
          aria-hidden="true"
          role="status"
          class="mr-3 inline size-4 animate-spin text-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor" />
        </svg>
        Loading...
      </button>
      <button
        disabled
        type="button"
        class="mr-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        <svg
          aria-hidden="true"
          role="status"
          class="mr-3 inline size-4 animate-spin text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2" />
        </svg>
        Loading...
      </button>
    </div>
    <fieldset class="flex flex-wrap gap-2">
      <legend>Icons</legend>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#add" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#arrowBackward" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#arrowDownward" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#arrowForward" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#arrowUpward" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#close" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#delete" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#done" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#menu" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#edit" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#photoLibrary" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#ascending" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#descending" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#loadingRing" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#sidebarOpen" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#sidebarClose" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#books" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#tag" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#series" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#authors" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#bookAdd" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#gallery" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#openBook" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#spellcheck" /></svg>
      <svg class="inline size-5 text-white"><use xlink:href="/icons/iconSprite.svg#save" /></svg>
    </fieldset>
  </main>
</template>
