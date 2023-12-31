import Toast from './toast';
export default {
	install: (app: any, options = { duration: 3 }) => {
		const toaster = new Toast(options);
		app.provide('toast', toaster);
	},
};
