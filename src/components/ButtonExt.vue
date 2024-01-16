<template>
	<button
		class="inline-flex items-center gap-2 rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-4">
		<div class="aspect-square h-full flex items-center justify-center">
			<slot name="prepend" />
		</div>
		<slot />
		<div class="aspect-square h-full flex items-center justify-center">
			<slot name="append" />
		</div>
	</button>
</template>
