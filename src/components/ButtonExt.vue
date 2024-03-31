<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-4">
    <div class="flex aspect-square h-full items-center justify-center">
      <slot name="prepend" />
    </div>
    <slot />
    <div class="flex aspect-square h-full items-center justify-center">
      <slot name="append" />
    </div>
  </button>
</template>
