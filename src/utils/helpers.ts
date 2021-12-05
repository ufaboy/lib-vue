function throttle(func: { apply: (arg0: any, arg1: IArguments) => void; }, ms:number) {
  // console.log('throttle', {func:func, ms: ms})
  let isThrottled = false;
  // @ts-ignore
  let savedArgs;
  let savedThis: null;

  function wrapper(this: any): void {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;
    setTimeout(function() {
      isThrottled = false; // (3)
      // @ts-ignore
      if (savedArgs) {
        // @ts-ignore
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

function checkDevice(): string {
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(details);
  return isMobileDevice ? 'mobile': 'desktop'
}
function isMobile():boolean {
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  return regexp.test(details);
}
export {throttle, checkDevice, isMobile}