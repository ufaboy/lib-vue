<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '@/composables/auth';

document.title = 'Login';

const passwordLength = computed(()=> {
	return password.value ? password.value.length : 0
})

const { signIn, loading, username, password, submitHandler } = useAuth();
</script>

<template>
  <main class="flex h-full bg-gradient-to-br from-cyan-500 to-blue-500 dark:bg-none">
    <div class="m-auto">
      <header class="mb-3 text-center">
        <button @click="signIn = !signIn">
          <transition name="fade" mode="out-in">
            <div v-if="signIn" key="SignIn">
              Sign In
            </div>
            <div v-else key="LogIn">
              Log In
            </div>
          </transition>
        </button>
      </header>
      <form class="flex flex-col flex-nowrap" name="user-form" @submit.prevent="submitHandler">
        <label class="label mb-2" for="login-username">
          Username
        </label>
        <input
          id="login-username"
          v-model="username"
          name="username"
          type="text"
          class="input mb-4 p-3 text-xl"
          required
          autocomplete="off"
          autofocus>
        <label class="label mb-2 flex items-center justify-between" for="login-pass">
          <span>Password</span>
          <meter
            v-if="signIn"
            min="0"
            max="15"
            low="6"
            optimum="10"
            :value="passwordLength"
            class="h-5 w-32" />
        </label>
        <input
          id="login-pass"
          v-model="password"
          type="password"
          name="password"
          class="input mb-6 p-3 text-xl"
          required
          autocomplete="off">
        <button
          class="relative flex flex-row items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-blue-600 p-3 text-xl font-medium text-white transition-colors hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
          :class="{ 'cursor-progress': loading }">
          Submit
          <svg
            v-if="loading"
            aria-hidden="true"
            role="status"
            class="absolute ml-40 inline size-5 animate-spin text-gray-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <use xlink:href="/icons/iconSprite.svg#loadingRing" />
          </svg>
        </button>
      </form>
    </div>
  </main>
</template>
