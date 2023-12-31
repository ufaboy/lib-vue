import { ref } from 'vue';

export default function useScroll() {
	const isThrottledScroll = ref(false);
	const lastScrollTop = ref(0);
	const hideByScroll = ref(false);
	const currentScroll = ref(0);
	const scrollTop = ref(0);
	const scrollHeight = ref(0);
	const clientHeight = ref(0);
	const windowHeights = ref(0);
	const scrollingProgress = ref({
		progress: 0,
		countPages: 0,
		clientHeight: 0,
		currentPage: 0,
	});
	const throttleScroll = function () {
		if (isThrottledScroll.value) {
			return;
		}
		isThrottledScroll.value = true;
		setTimeout(() => {
			isThrottledScroll.value = false;
			handleScroll();
		}, 500);
	};
	const initHeights = function () {
		scrollHeight.value = Math.floor(document.documentElement.scrollHeight);
		clientHeight.value = Math.floor(document.documentElement.clientHeight);
		return scrollHeight.value - clientHeight.value;
	};
	const calcScrollingProgress = function () {
		const clientHeight = document.documentElement.clientHeight;
		const initHeightsNumber = initHeights();
		scrollingProgress.value = {
			progress: initHeightsNumber ? Math.round((scrollTop.value * 100) / initHeightsNumber) : 0,
			countPages: Math.ceil(windowHeights.value / clientHeight),
			clientHeight: clientHeight,
			currentPage: Math.ceil(scrollTop.value / clientHeight),
		};
	};
	const handleScroll = function () {
		scrollTop.value = Math.floor(document.documentElement.scrollTop);
		const res = scrollTop.value - lastScrollTop.value;
		if (scrollTop.value > lastScrollTop.value) {
			hideByScroll.value = scrollTop.value > 150 && res > 70;
		} else if (res < -100) {
			hideByScroll.value = false;
		}
		lastScrollTop.value = scrollTop.value <= 0 ? 0 : scrollTop.value;

		windowHeights.value = scrollHeight.value - clientHeight.value;
		calcScrollingProgress();
	};

	return {
		currentScroll,
		lastScrollTop,
		scrollTop,
		scrollHeight,
		clientHeight,
		windowHeights,
		hideByScroll,
		scrollingProgress,
		initHeights,
		throttleScroll,
	};
}
