import {ref} from "vue";

export default function useScroll() {
  const isThrottledScroll = ref(false);
  const lastScrollTop = ref(0);
  const hideByScroll = ref(false);
  const currentScroll = ref(0);
  const scrollTop = ref(0);
  const scrollHeight = ref(0);
  const clientHeight = ref(0);
  const windowHeights = ref(0);
  const progress = ref(0);
  const throttleScroll = function () {
    if (isThrottledScroll.value) {
      return
    }
    isThrottledScroll.value = true
    setTimeout(() => {
      isThrottledScroll.value = false
      handleScroll()
    }, 300)
  };
  const initHeights = function () {
    scrollHeight.value = Math.floor(document.documentElement.scrollHeight)
    clientHeight.value = Math.floor(document.documentElement.clientHeight)
    return scrollHeight.value - clientHeight.value
  }
  const handleScroll = function () {
    // const st = Math.floor(window.pageYOffset || document.documentElement.scrollTop);
    scrollTop.value = Math.floor(document.documentElement.scrollTop)
    const res = scrollTop.value - lastScrollTop.value


    // console.log('handleScroll', {
    //   st: st,
    //   res: res,
    //   lastScrollTop: lastScrollTop.value,
    //   scrollTop: scrollTop,
    //   scrollHeight: scrollHeight,
    //   clientHeight: clientHeight,
    //   progress: progress.value
    // })
    if (scrollTop.value > lastScrollTop.value) {
      hideByScroll.value = scrollTop.value > 150 && res > 70
    } else if (res < -70) {
      hideByScroll.value = false
    }
    lastScrollTop.value = scrollTop.value <= 0 ? 0 : scrollTop.value; // For Mobile or negative scrolling
    progress.value = Math.round((scrollTop.value * 100) / initHeights())
    windowHeights.value = scrollHeight.value - clientHeight.value;
  }

  return {currentScroll, lastScrollTop, scrollTop, scrollHeight, clientHeight, windowHeights, hideByScroll, progress, initHeights, throttleScroll}
}