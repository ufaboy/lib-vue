function throttle(func, ms) {
  // console.log('throttle', {func:func, ms: ms})
  let isThrottled = false,
      savedArgs,
      savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;
    console.log('wrapper', {isThrottled: isThrottled, ms: ms})
    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

function checkDevice() {
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(details);
  return isMobileDevice ? 'mobile': 'desktop'
}
function isMobile() {
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  return regexp.test(details);
}
export {throttle, checkDevice, isMobile}