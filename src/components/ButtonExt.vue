<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg p-2 text-center text-sm font-medium focus:outline-none focus:ring-4"
  >
    <div class="aspect-square h-full">
      <slot name="prepend" />
    </div>
    <slot />
    <div class="aspect-square h-full">
      <slot name="prepend" />
    </div>
  </button>
</template>
