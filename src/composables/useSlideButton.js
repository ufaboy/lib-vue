import {ref} from 'vue'
export default function useSlideButton() {
    const startPos = ref({x: 0, y: 0});
    const endPos = ref({x: 0, y: 0});
    const showSortingModal = ref(false);
    const touchStart = (e) => {
        startPos.value = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
        endPos.value = {x: 0, y: 0}
    };
    const touchEnd = (e) => {
        endPos.value = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
        let difX = endPos.value.x - startPos.value.x
        let difY = startPos.value.y - endPos.value.y
        if (difX > 100 && difY < 50) showSortingModal.value = true
    };

    return {showSortingModal, touchStart, touchEnd}
}