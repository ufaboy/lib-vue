<template>
  <div class="login">
    <form class="form" @submit.prevent="login">
      <label class="label label-username">
        <base-icon class="icon"><icon-username/></base-icon>
        <input type="text" class="input" v-model.trim="username" placeholder="username" autocomplete="off">
      </label>
      <label class="label label-password">
        <base-icon class="icon"><icon-password/></base-icon>
        <input type="password" class="input" v-model.trim="password" placeholder="password" autocomplete="off">
      </label>
      <button class="login-btn">{{signIn ? 'sign in' : 'log in'}}</button>
    </form>
  </div>
</template>

<script>
import IconUsername from "@/components/icons/IconUsername";
import IconPassword from "@/components/icons/IconPassword";
export default {
  name: "login",
  components: {IconPassword, IconUsername},
  props: {},
  data: () => ({
    username: '',
    password: '',
    signIn: false,
  }),
  methods: {
    async login() {
      const formData = {username: this.username, password: this.password};
      const result = await fetch(`${process.env.VUE_APP_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        }
      })
      const res = await result.json()
      sessionStorage.setItem('lib-token', res.token)
      this.$store.commit('user/setUser', res)
      this.$router.push('/')
    }
  },
  computed: {},
  watch: {},
  created() {
    document.title = 'Login';
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-image: url('/img/view_of_moon.jpg');
  background-size: cover;
  background-position-y: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 57%;
  }
  .label {
    display: flex;
    align-items: center;
  }

  .input {
    background-color: transparent;
    border: none;
    outline: none;
    padding: 1rem;
    color: #ffffff;
  }
  .label-username {
    .input {
      border-bottom: 1px solid;
    }
  }
  .label-password {
    margin-bottom: 1rem;
  }
  .login-btn {
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 1rem;
    color: #ffffff;
    height: 2rem;
    cursor: pointer;
    text-transform: capitalize;
    outline: none;
  }
  .login-btn:hover {
    background-color: #cccccc10;
  }
  .login-btn:active {
    transform: translateY(4px);
  }
  .icon {
    height: 2rem;
    width: 2rem;
    margin-right: 1rem;
  }
}
@media (max-width: 1100px) {
  .login {
    background-position-x: center;
  }
}
</style>