<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
	options?: IntersectionObserverInit;
}>();
const emit = defineEmits(['intersect']);

const observer = ref<IntersectionObserver>();
const observerElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
	observer.value = new IntersectionObserver(([entry]) => {
		if (entry && entry.isIntersecting) {
			emit('intersect');
		}
	}, props.options);
	if (observerElement.value) observer.value.observe(observerElement.value);
});
onBeforeUnmount(() => {
	observer.value?.disconnect();
});

</script>
<template>
	<div ref="observerElement" class="observer">
		<svg class="spinner" viewBox="0 0 50 50" width="24px" height="24px">
			<circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
		</svg>
	</div>
</template>

<style>
.observer {
	position: relative;
	width: 100%;
	height: 70px;
}

.spinner {
	animation: rotate 2s linear infinite;
	z-index: 2;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -25px 0 0 -25px;
	width: 50px;
	height: 50px;
}

.spinner .path {
	stroke: #93bfec;
	stroke-linecap: round;
	animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes dash {
	0% {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
	}

	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -35;
	}

	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -124;
	}
}
</style>
