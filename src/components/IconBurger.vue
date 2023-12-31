<template>
	<svg class="icon-burger" viewBox="0 0 24 24" aria-hidden="true">
		<rect class="rect" width="18" height="1.5" fill="currentColor" ry="0.75" x="3" y="6.25" />
		<rect class="rect" width="18" height="1.5" fill="currentColor" ry="0.75" x="3" y="11.25" />
		<rect class="rect" width="18" height="1.5" fill="currentColor" ry="0.75" x="3" y="16.25" />
	</svg>
</template>

<style>
.icon-burger {
	.rect {
		transform-box: fill-box;
		transform-origin: 50% 50%;
		fill: hsl(0 0% 98%);
	}

	.rect {
		transition:
			rotate 0.2s 0s,
			translate 0.2s 0.2s;
	}
}

.icon-burger.active {
	rotate: 90deg;
	transition: rotate 500ms 0.4s;

	.rect {
		transition:
			translate 0.2s,
			rotate 0.2s 0.3s;
	}

	.rect:nth-of-type(1) {
		translate: 0 333%;
		rotate: -45deg;
	}

	.rect:nth-of-type(2) {
		rotate: 45deg;
	}

	.rect:nth-of-type(3) {
		translate: 0 -333%;
		rotate: 45deg;
	}
}
</style>
