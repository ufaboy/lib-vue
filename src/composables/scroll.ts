import { ref } from 'vue';

export function useScroll() {
	const observedElement = ref<HTMLElement>(document.documentElement);
	const isThrottledScroll = ref(false);
	const progress = ref(0);
	const btnTopShow = ref(false);
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
		scrollHeight.value = Math.floor(observedElement.value.scrollHeight);
		clientHeight.value = Math.floor(observedElement.value.clientHeight);
		return scrollHeight.value - clientHeight.value;
	};
	const calcScrollingProgress = function () {
		const clientHeight = observedElement.value.clientHeight;
		const initHeightsNumber = initHeights();
		scrollingProgress.value = {
			progress: initHeightsNumber ? Math.round((scrollTop.value * 100) / initHeightsNumber) : 0,
			countPages: Math.ceil(windowHeights.value / clientHeight),
			clientHeight: clientHeight,
			currentPage: Math.ceil(scrollTop.value / clientHeight),
		};
	};
	const handleScroll = function () {
		scrollTop.value = Math.floor(observedElement.value.scrollTop);
		const res = scrollTop.value - lastScrollTop.value;
		if (scrollTop.value > lastScrollTop.value) {
			hideByScroll.value = scrollTop.value > 150 && res > 70;
		} else if (res < -100) {
			hideByScroll.value = false;
		}
		lastScrollTop.value = scrollTop.value <= 0 ? 0 : scrollTop.value;
		windowHeights.value = scrollHeight.value - clientHeight.value;
		btnTopShow.value = scrollTop.value > 100;
		calcScrollingProgress();
	};

	function scrollTo(top = 0, left = 0) {
		observedElement.value.scrollTo({
			top,
			left,
			behavior: 'smooth',
		});
	}

	return {
		isThrottledScroll,
		observedElement,
		progress,
		btnTopShow,
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
		scrollTo,
	};
}
