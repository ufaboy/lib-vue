import { ref } from 'vue';

export function useSwipe() {
	const startPos = ref({ x: 0, y: 0 });
	const endPos = ref({ x: 0, y: 0 });
	const slideLeftRight = ref(false);
	const slideRightLeft = ref(false);
	const touchStart = (e: TouchEvent) => {
		startPos.value = {
			x: e.changedTouches[0].clientX,
			y: e.changedTouches[0].clientY,
		};
		endPos.value = { x: 0, y: 0 };
	};
	const touchEnd = (e: TouchEvent) => {
		endPos.value = {
			x: e.changedTouches[0].clientX,
			y: e.changedTouches[0].clientY,
		};
		let difX = endPos.value.x - startPos.value.x;
		let difY = startPos.value.y - endPos.value.y;
		if (difX > 100 && difY < 50) {
			slideLeftRight.value = true;
		} else if (difX < -100 && difY < 50) {
			slideRightLeft.value = true;
		}
	};

	return { slideLeftRight, slideRightLeft, touchStart, touchEnd };
}
