import observer from './observer.vue';
export default {
	install(app: any) {
		app.component('observer', observer);
	},
};
