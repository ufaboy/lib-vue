import LoaderModule from "./LoaderModule";
import mount from './helpers/mount-component'

const Api = (globalOptions = {}) => {
	return {
		show() {
			mount(LoaderModule)
			console.log({'show': globalOptions})
			globalOptions.methods.showLoader()
		},
		clear() {
			// eventBus.$emit('toast-clear')
			console.log('eventBus')
		},
	}
}

export default Api