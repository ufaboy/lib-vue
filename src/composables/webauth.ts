import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import Toast from '@/plugins/toaster/toast';

export function useWebAuth() {
	const router = useRouter();

	const loading = ref(false);
	const signIn = ref(false);
	const username = ref<string>();

	async function signInUser() {
		const optionsRequest = createRequest('generate-registration-options', {username: username.value})
		const resp = await fetch(optionsRequest);
		const attResp = await startRegistration(await resp.json());
		const verificationRequest = createRequest('verify-registration', attResp)
		const verificationResp = await fetch(verificationRequest);
		const verificationJSON = await verificationResp.json();
		if (verificationJSON && verificationJSON.verified) {
			Toast.success('Success signInUser');
		} else {
			Toast.error('Error signInUser');
		};
	}

	async function logInUser() {
		const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/generate-authentication-options`);
		const asseResp = await startAuthentication(await resp.json());
		const verificationAuthRequest = createRequest('verify-authentication', asseResp)
		const verificationResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-authentication`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(asseResp),
		});
		const verificationJSON = await verificationResp.json();
		if (verificationJSON && verificationJSON.verified) {
			sessionStorage.setItem('lib-token', 'userData.access_token');
			await router.push({ name: 'books' });
		} else {
			Toast.error('Error logInUser');
		}
	}

	function createRequest(requestURL: string, data: Object) {
		const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${requestURL}`;
		const headers = new Headers({
			'Content-Type': 'application/json',
		})
		return new Request(url, {
			method: 'POST',
			headers: {
				
			},
			body: JSON.stringify(data),
		});
	}

	return { signIn, loading, username, signInUser, logInUser };
}
