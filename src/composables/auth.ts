import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { errorHandler } from '@/utils/helper';

export function useAuth() {
	const router = useRouter();

	const loading = ref(false);
	const signIn = ref(false);
	const username = ref<string>();
	const password = ref<string>();

	async function submitHandler(event: Event) {
		try {
			if (loading.value || !username.value || !password.value) {
				return null;
			} else loading.value = true;
			const request = createRequest(username.value, password.value);
			const response = await fetch(request);
			const result = await response.json();
			if (response.ok) {
				// const userData: { name: string; access_token: string } = result;
				// if (userData.access_token) {
				// 	sessionStorage.setItem('lib-token', userData.access_token);
				// } else {
				// 	console.log({ 'response.not token': response });
				// }
				if (signIn.value) {
					const credentials = await createCredentials(result as string, username.value);
					if (credentials) {
						const registrationData = {
							id: credentials.id,
							// @ts-ignore:next-line
							rawId: arrayBufferToBase64(credentials.rawId),
							response: {
								// @ts-ignore:next-line
								attestationObject: arrayBufferToBase64(credentials.response.attestationObject),
								// @ts-ignore:next-line
								clientDataJSON: arrayBufferToBase64(credentials.response.clientDataJSON),
							},
						};
						const user = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(registrationData),
						});
						console.log('user', user);
					}

					console.log('createCredentials', { creds: credentials });
				} else {
				}
				await router.push({ name: 'books' });
			} else {
				throw new Error(result);
			}
		} catch (error) {
			errorHandler(error as Error);
		} finally {
			loading.value = false;
		}
	}
	async function register() {
		try {
			if (loading.value || !username.value || !password.value) {
				return null;
			} else loading.value = true;
			const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
			const request = new Request(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: username.value, password: password.value }),
			});
			const response = await fetch(request);
			const result = await response.json();
			if (response.ok) {
				// const userData: { name: string; access_token: string } = result;
				// if (userData.access_token) {
				// 	sessionStorage.setItem('lib-token', userData.access_token);
				// } else {
				// 	console.log({ 'response.not token': response });
				// }
				const publicKeyCredentialCreationOptions = {
					...result,
					challenge: base64ToArrayBuffer(result.challenge),
					user: { ...result.user, id: base64ToArrayBuffer(result.user.id) },
				};
				const credentials = await navigator.credentials.create({
					publicKey: publicKeyCredentialCreationOptions,
				});
				if (credentials) {
					const registrationData = {
						username: username.value,
						id: credentials.id,
						// @ts-ignore:next-line
						rawId: arrayBufferToBase64(credentials.rawId),
						response: {
							// @ts-ignore:next-line
							attestationObject: arrayBufferToBase64(credentials.response.attestationObject),
							// @ts-ignore:next-line
							clientDataJSON: arrayBufferToBase64(credentials.response.clientDataJSON),
						},
					};
					const user = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(registrationData),
					});
					console.log('user', user);
				}

				console.log('createCredentials', { creds: credentials });

				await router.push({ name: 'books' });
			} else {
				throw new Error(result);
			}
		} catch (error) {
			errorHandler(error as Error);
		} finally {
			loading.value = false;
		}
	}

	async function createCredentials(challenge: string, username: string) {
		const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
			rp: {
				name: 'Library', // имя надежной стороны (Relying Party)
				id: 'localhost', // идентификатор надежной стороны (Домен)
			},
			user: {
				id: Uint8Array.from(username, (c) => c.charCodeAt(0)), // преобразование userId в Uint8Array
				name: username, // имя пользователя
				displayName: username, // отображаемое имя пользователя
			},
			challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)), // преобразование challenge в Uint8Array
			pubKeyCredParams: [
				// предпочтительные параметры для криптографического алгоритма
				{
					type: 'public-key', // тип ключа
					alg: -7, // алгоритм ECDSA с кривой P-256
				},
				{
					type: 'public-key',
					alg: -257, // алгоритм RSA с ограничением SHA-256
				},
			],
			timeout: 60000, // таймаут ожидания ответа (в миллисекундах)
			excludeCredentials: [], // список учетных данных, которые следует исключить
			authenticatorSelection: {
				// критерии выбора аутентификатора
				requireResidentKey: false,
			},
			extensions: {
				// расширения
				credProps: true, // если true, возвращаются свойства учетных данных
			},
		};
		// API вызов для создания новых учетных данных с помощью переданных опций.
		return await navigator.credentials.create({
			publicKey: publicKeyCredentialCreationOptions,
		});
	}

	function createRequest(username: string, password: string) {
		const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${signIn.value ? 'register' : 'login'}`;
		return new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
	}
	function arrayBufferToBase64(arrayBuffer: Uint8Array) {
		return btoa(String.fromCharCode(...arrayBuffer));
	}

	function base64ToArrayBuffer(base64: string) {
		let binaryString = window.atob(base64);
		let len = binaryString.length;
		let bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		return bytes.buffer;
	}

	return { signIn, loading, username, password, submitHandler, register };
}
