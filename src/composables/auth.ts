import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { errorHandler } from '@/utils/helper';
import Toast from '@/plugins/toaster/toast';

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
				const userData: { name: string; access_token: string } = result;
				if (userData.access_token) {
					sessionStorage.setItem('lib-token', userData.access_token);
					await router.push({ name: 'books' });
				} else {
					console.log({ 'response.not token': response });
				}
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			errorHandler(error as Error);
		} finally {
			loading.value = false;
		}
	}
  
	function createRequest(username: string, password: string) {
		const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${signIn.value ? 'signin' : 'login'}`;
		return new Request(url, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({username, password}),
		});
	}

	return { signIn, loading, username, password, submitHandler };
}
