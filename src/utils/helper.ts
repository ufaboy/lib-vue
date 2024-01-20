import Toast from '@/plugins/toaster/toast';
import { REDIRECT_LOGIN_URL } from '@/utils/constants';

function getHeaders(): Headers {
	const token = sessionStorage.getItem('lib-token');
	if (!token) {
		window.location.href = REDIRECT_LOGIN_URL;
		throw new Error(`Token Error: token: ${token}`);
	}
	return new Headers({
		Authorization: `Bearer ${token}`,
	});
}

function getUrl(baseUrl: string, query?: { [key: string]: string | number | undefined | null }): URL {
	const url = new URL(baseUrl);
	for (const key in query) {
		const value = query[key];

		if (value !== '' && value !== undefined && value !== null) {
			let stringValue: string;
			if (['updated_at', 'last_read'].includes(key) && typeof value === 'number') {
				stringValue = (new Date(value).getTime() / 1000).toString();
			} else if (typeof value === 'string') {
				stringValue = value;
			} else stringValue = value.toString();
			url.searchParams.append(key, stringValue);
		}
	}
	return url;
}

function getRequest(url: URL): Request {
	return new Request(url, {
		method: 'GET',
		headers: getHeaders(),
	});
}

function dataRequest(url: URL, method = 'POST', data: unknown): Request {
	const headers = getHeaders()
	headers.append('Content-Type', 'application/json')
	console.log('dataRequest', headers)
	return new Request(url, {
		method: method,
		headers: headers,
		body: JSON.stringify(data),
	});
}

function formRequest(url: URL, method = 'POST', data: FormData): Request {
	return new Request(url, {
		method: method,
		headers: getHeaders(),
		body: data,
	});
}

function deleteRequest(url: URL): Request {
	return new Request(url, {
		method: 'DELETE',
		headers: getHeaders(),
	});
}
async function fetchData<T>(request: Request): Promise<T> {
	const response = await fetch(request);
	if (!response.ok) {
		if (response.status === 401) {
			// window.location.href = REDIRECT_LOGIN_URL;
		} else throw new Error(response.statusText);
	}
	return await response.json();
}

function convertTimestampToDate(timestamp?: string): string {
	return timestamp ? new Intl.DateTimeFormat('en-GB').format(new Date(timestamp)) : '—';
}

function errorHandler(error: Error) {
	console.error({ error: error });
	Toast.error(error.message);
}

function calcTextSize(size: number):number {
	return Math.floor(size / 1024);
}

function isMobile(): boolean {
	return /android/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isSmallDevice() {
	const width = Math.floor(document.documentElement.clientWidth);
	return width < 1024
}

function getRandomColor(): string {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function generateRandomNumber(min = 1, max = 10): string {
	const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	return randomNumber.toString().padStart(3, '0');
}

export {
	getHeaders,
	getUrl,
	getRequest,
	dataRequest,
	formRequest,
	deleteRequest,
	fetchData,
	convertTimestampToDate,
	errorHandler,
	calcTextSize,
	isMobile,
	isSmallDevice,
	getRandomColor,
	generateRandomNumber,
};
