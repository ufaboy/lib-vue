<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const PARTICLE_NUM = 500;
const PARTICLE_BASE_RADIUS = 0.5;
const FL = 500;
const DEFAULT_SPEED = 2;
const BOOST_SPEED = 300;

const canvas = ref<HTMLCanvasElement>();
const canvasWidth = ref<number>(0);
const canvasHeight = ref<number>(0);
const context = ref<CanvasRenderingContext2D | null>(null);
const centerX = ref<number>(0);
const centerY = ref<number>(0);
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);

const speed = ref(DEFAULT_SPEED);
const targetSpeed = ref(DEFAULT_SPEED);
const particles = ref<Particle[]>([]);

function resize() {
	if (canvas.value) {
		canvasWidth.value = canvas.value.width = window.innerWidth;
		canvasHeight.value = canvas.value.height = window.innerHeight;
		centerX.value = canvasWidth.value * 0.5;
		centerY.value = canvasHeight.value * 0.5;
		context.value = canvas.value.getContext('2d') as CanvasRenderingContext2D;
		context.value.fillStyle = 'rgb(255, 255, 255)';
	}
}

function generateCanvas() {
	canvas.value = document.getElementById('canvas') as HTMLCanvasElement;
	resize();

	mouseX.value = centerX.value;
	mouseY.value = centerY.value;

	for (let i = 0, p; i < PARTICLE_NUM; i++) {
		particles.value[i] = randomizeParticle(new Particle());
		particles.value[i].z -= 500 * Math.random();
	}
	setInterval(loop, 1000 / 60);
}

function loop() {
	if (!context.value) return null;
	context.value.save();
	context.value.fillStyle = 'rgb(0, 0, 0)';
	context.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
	context.value.restore();

	speed.value += (targetSpeed.value - speed.value) * 0.01;

	let p;
	let cx, cy;
	let rx, ry;
	let f, x, y, r;
	let pf, px, py, pr;
	let a, a1, a2;

	let halfPi = Math.PI * 0.5;
	let atan2 = Math.atan2;
	let cos = Math.cos;
	let sin = Math.sin;

	context.value.beginPath();
	for (let i = 0; i < PARTICLE_NUM; i++) {
		p = particles.value[i];

		p.pastZ = p.z;
		p.z -= speed.value;

		if (p.z <= 0) {
			randomizeParticle(p);
			continue;
		}

		cx = centerX.value - (mouseX.value - centerX.value) * 1.25;
		cy = centerY.value - (mouseY.value - centerY.value) * 1.25;

		rx = p.x - cx;
		ry = p.y - cy;

		f = FL / p.z;
		x = cx + rx * f;
		y = cy + ry * f;
		r = PARTICLE_BASE_RADIUS * f;

		pf = FL / p.pastZ;
		px = cx + rx * pf;
		py = cy + ry * pf;
		pr = PARTICLE_BASE_RADIUS * pf;

		a = atan2(py - y, px - x);
		a1 = a + halfPi;
		a2 = a - halfPi;

		context.value.moveTo(px + pr * cos(a1), py + pr * sin(a1));
		context.value.arc(px, py, pr, a1, a2, true);
		context.value.lineTo(x + r * cos(a2), y + r * sin(a2));
		context.value.arc(x, y, r, a2, a1, true);
		context.value.closePath();
	}
	context.value.fill();
}

function randomizeParticle(p: Particle) {
	p.x = Math.random() * canvasWidth.value;
	p.y = Math.random() * canvasHeight.value;
	p.z = Math.random() * 1500 + 500;
	return p;
}

class Particle {
	x: number;
	y: number;
	z: number;
	pastZ: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.pastZ = 0;
	}
}

function mouseMoveHandler(e: MouseEvent) {
	mouseX.value = e.clientX;
	mouseY.value = e.clientY;
}

function mouseDownHandler(e: MouseEvent) {
	const element = e.target as HTMLElement;
	const formElement = element.closest('form');
	if (formElement) return null;
	targetSpeed.value = BOOST_SPEED;
}

function mouseUpHandler(e: MouseEvent) {
	targetSpeed.value = DEFAULT_SPEED;
}

onMounted(() => {
	generateCanvas();
	document.addEventListener('resize', resize, { passive: true });
	document.addEventListener('mousemove', mouseMoveHandler, { passive: true });
	document.addEventListener('mousedown', mouseDownHandler, { passive: true });
	document.addEventListener('mouseup', mouseUpHandler, { passive: true });
});
onBeforeUnmount(() => {
	document.removeEventListener('resize', resize);
	document.removeEventListener('mousemove', mouseMoveHandler);
	document.removeEventListener('mousedown', mouseDownHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
});
document.documentElement.classList.remove('scrollbar-gutter');
</script>

<template>
  <div class="layout h-full">
    <router-view />
    <canvas
      id="canvas"
      class="fixed left-0 top-0 -z-10" />
  </div>
</template>
