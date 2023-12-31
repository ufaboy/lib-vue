export default class Toast {
	static duration = 3;
	// static duration: number; // duration in seconds
	constructor(options: { duration: number }) {
		// this.duration = options.duration;
	}

	static createToastElement(message: string, type: string): void {
		const toastElement = document.createElement('div');
		toastElement.textContent = message;
		toastElement.classList.add(...this.getClassNames(type));
		document.body.appendChild(toastElement);

		// setTimeout(() => {
		// 	document.body.removeChild(toastElement);
		// }, this.duration * 1000);
	}

	static success(message: string): void {
		this.createToastElement(message, 'success');
	}

	static error(message: string): void {
		this.createToastElement(message, 'error');
	}

	static info(message: string): void {
		this.createToastElement(message, 'info');
	}

	static getClassNames(type: string) {
		let result = ['p-4', 'rounded-md', 'w-72', 'fixed', 'bottom-8', 'right-8']
		if(type === 'error') {
			result.push(...['text-white', 'bg-red-500'])
		} else if(type === 'success') {
			result.push(...['text-white', 'bg-green-500'])
			
		} else if(type === 'info') {
			result.push(...['text-white', 'bg-blue-500'])
		} else {
			result.push('bg-transparent')
		}

		return result
	}
}
