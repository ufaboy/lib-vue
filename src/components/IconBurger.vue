<template>
  <svg
    class="icon-burger"
    viewBox="0 0 24 24"
    aria-hidden="true">
    <rect
      class="rect"
      width="18"
      height="1.5"
      fill="currentColor"
      ry="0.75"
      x="3"
      y="6.25" />
    <rect
      class="rect"
      width="15"
      height="1.5"
      fill="currentColor"
      ry="0.75"
      x="6"
      y="11.25" />
    <rect
      class="rect"
      width="18"
      height="1.5"
      fill="currentColor"
      ry="0.75"
      x="3"
      y="16.25" />
  </svg>
</template>

<style>
.icon-burger {
	.rect {
		transform-box: fill-box;
		transform-origin: 50% 50%;
	}

	.rect {
      transition:  transform 0.5s, opacity 0.5s;
	}
}

.active .rect:nth-of-type(1) {
  transform: rotate(45deg) translate(20%, 230%) scaleX(1.25);
}

.active .rect:nth-of-type(2) {
  opacity: 0;
  transform: translate(0, 0) scale(0.01);
}

.active .rect:nth-of-type(3) {
  transform: rotate(-45deg) translate(20%, -230%) scaleX(1.25);
}
</style>
