<template>
  <div class="login-page">
    <div class="login-box">
      <header class="login-header">
        <button class="login-type" @click="signIn = !signIn">
          <transition name="fade" mode="out-in">
            <div v-if="signIn" key="SignIn">SignIn</div>
            <div v-else key="LogIn">LogIn</div>
          </transition>
        </button>
      </header>
      <form class="login-form" @submit.prevent="login">
        <div class="user-box">
          <input id="login-username" type="text" class="input" required v-model.trim="username" autocomplete="off">
          <label class="label" for="login-username">Username</label>
        </div>
        <div class="user-box">
          <input id="login-pass" type="password" class="input" required v-model.trim="password" autocomplete="off">
          <label class="label" for="login-pass">Password</label>
        </div>
        <button class="login-btn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </button>
      </form>
    </div>
    <CanvasSpace :count-dots="countDots"/>
  </div>

</template>

<script setup lang="ts">
import {ref, computed, inject} from 'vue';
import {useRouter} from 'vue-router'
import {API_URL} from "../../runtimeEnv";
import {setUser} from '../utils/userData';
import {isMobile} from "../utils/helpers";
import CanvasSpace from "../components/CanvasSpace.vue";
import User from '../interfaces/user';

document.title = 'Login';
const router = useRouter()
const printToast = inject('printToast')
const username = ref('')
const password = ref('')
const signIn = ref(false)
const countDots = computed(() => {
  return isMobile() ? 100 : 500
});

async function login() {
  const formData = {username: username.value, password: password.value};
  const url = `${API_URL}/auth/${signIn.value ? 'signin' : 'login'}`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  })
  const result:User = await response.json();
  if (response.ok) {
    if (result.token) {
      setUser(result)
      await router.push({name: 'list-categories'})
    } else {
      console.log({'response.not token': response})
    }
  } else {
    console.log({'response.notOk': response})
    // @ts-expect-error
    printToast(result.message, 'danger')
  }
}

</script>

<style lang="scss">
.login-page {
  height: 100%;
  width: 100%;
  //background: linear-gradient(#141e30, #243b55);
  background: linear-gradient(#020120, #243b55);
  overflow: hidden;
  position: absolute;
  z-index: 0;
}

.login-box {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  width: 22rem;
  padding: 2rem;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;

  //.header-title {
  //  margin: 0 0 30px;
  //  padding: 0;
  //  color: #fff;
  //  text-align: center;
  //}
  .login-header {
    text-align: center;

    .login-type {
      width: 100px;
      padding: 10px 20px;
      color: #03e9f4;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s ease
    }

    .fade-enter-from, .fade-leave-to {
      opacity: 0
    }

  }

  .login-form {
    text-align: center;
  }

  .user-box {
    position: relative;

    .input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      margin-bottom: 30px;
      border: none;
      border-bottom: 1px solid #fff;
      outline: none;
      background: transparent;
    }

    .label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      pointer-events: none;
      transition: .5s;
    }

    .input:focus ~ .label, .input:valid ~ .label {
      top: -20px;
      left: 0;
      color: #03e9f4;
      font-size: 12px;
    }
  }

  .user-box:last-of-type {
    margin-bottom: 2rem;
  }

  .login-btn {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: #03e9f4;
    background: transparent;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    letter-spacing: 4px
  }

  .login-btn:hover {
    background: #03e9f4;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #03e9f4,
    0 0 25px #03e9f4,
    0 0 50px #03e9f4,
    0 0 100px #03e9f4;
  }

  .login-btn span {
    position: absolute;
    display: block;
  }

  .login-btn span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #03e9f4);
    animation: btn-anim1 1s linear infinite;
  }

  .login-btn span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #03e9f4);
    animation: btn-anim2 1s linear infinite;
    animation-delay: .25s
  }

  .login-btn span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #03e9f4);
    animation: btn-anim3 1s linear infinite;
    animation-delay: .5s
  }

  .login-btn span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #03e9f4);
    animation: btn-anim4 1s linear infinite;
    animation-delay: .75s
  }
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}

@media only screen and (max-width: 892px) {
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .login-box {
    width: 80%;

  }
}
</style>