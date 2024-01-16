<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useScroll } from '@/composables/scroll';
import TheSidebar from '@/components/TheSidebar.vue';
import BtnScrollToTop from '@/components/BtnScrollToTop.vue';

const sidebarCollapsed = ref(false);

const { btnTopShow, scrollingProgress, observedElement, scrollTo, throttleScroll } = useScroll();

onMounted(() => {
	const bookElement = document.getElementById('bookText');
	if (bookElement) {
		observedElement.value = bookElement;
		bookElement.addEventListener('scroll', throttleScroll, { passive: true });
	}
});
onBeforeUnmount(() => {
	document.getElementById('bookText')?.removeEventListener('scroll', throttleScroll);
});
</script>
<template>
	<div id="layout" class="flex gap-2">
		<TheSidebar v-model="sidebarCollapsed" />
		<router-view
			:sidebar-collapsed="sidebarCollapsed"
			:progress="scrollingProgress.progress"
			class="h-dvh overflow-x-auto scrollbar flex-1" />
		<BtnScrollToTop
			v-if="btnTopShow"
			@click="scrollTo()"
			class="fixed bottom-20 right-10 z-10 flex size-10 items-center justify-center" />
	</div>
</template>
