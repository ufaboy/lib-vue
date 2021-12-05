import {computed} from "vue";

export default function useDevice() {
    const isMobile = computed(()=>{
        return screen.width <= 900;
    });
    const isDesktop = computed(()=>{
        return screen.width > 900;
    });

    return {isMobile, isDesktop}
}