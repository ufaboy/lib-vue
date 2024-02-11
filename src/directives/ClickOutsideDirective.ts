import { DirectiveBinding } from 'vue';

export default {
	beforeMount(el: HTMLElement, binding: DirectiveBinding) {
		document.addEventListener('click', (event: MouseEvent) => {
			if (!(el === event.target || el.contains(event.target as Node))) {
				binding.value(event);
			}
		});
	},
	unmounted(el: HTMLElement, binding: DirectiveBinding) {
		document.removeEventListener('click', (event: MouseEvent) => {
			if (!(el === event.target || el.contains(event.target as Node))) {
				binding.value(event);
			}
		});
	},
};
