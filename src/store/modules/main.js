const state = () => ({
	layout: 'LayoutDefault',
	isMobile: false,
	isDesktop: true,
	activeGenre: {},
	activeBook: {},
})

// getters
const getters = {
	layout(state) {
		return state.layout
	},
	isMobile(state) {
		return state.isMobile
	},
	isDesktop(state) {
		return state.isDesktop
	},
	activeGenre(state) {
		return state.activeGenre
	},
	activeBook(state) {
		return state.activeBook
	},
}

// actions
const actions = {}

// mutations
const mutations = {
	setLayout(state, payload) {
		state.layout = payload
	},
	setIsMobile(state) {
		state.isMobile = true;
		state.isDesktop = false;
	},
	setIsDesktop(state) {
		state.isMobile = false;
		state.isDesktop = true;
	},
	setActiveGenre(state, data) {
		state.activeGenre = data
	},
	setActiveBook(state, data) {
		state.activeBook = data
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}