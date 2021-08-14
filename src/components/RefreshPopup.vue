<template>
  <div class="sw-update-popup">
    Доступен новый контент.
    <button class="sw-update-popup__btn" @click="refreshApp">Обновить</button>
  </div>
</template>

<script>
export default {
  name: "RefreshPopup",
  components: {},
  props: {},
  data: () => ({
    registration: null,
    updateExists: false,
  }),
  computed: {},
  watch: {},
  created() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log({controllerchange: navigator.serviceWorker})
      // We'll also need to add 'refreshing' to our data originally set to false.
      if (this.refreshing) return
      this.refreshing = true
      // Here the actual reload of the page occurs
      window.location.reload()
    })
  },
  mounted() {
  },
  methods: {
    updateAvailable(event) {
      console.log({updateAvailable: event})
      this.registration = event.detail
      this.updateExists = true
    },
    refreshApp() {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return
      // Send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      this.$emit('sw-update')
    }
  },
}
</script>

<style scoped lang="scss">
.sw-update-popup {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 1em;
  bottom: 1em;
  padding: 1em;
  border: 1px solid #3eaf7c;
  border-radius: 5px;
  background: #484343;
  box-shadow: 0 4px 16px rgb(0 0 0 / 50%);
  text-align: center;
  z-index: 2;

  .sw-update-popup__btn {
    border: none;
    border-radius: 5px;
    margin-top: .5em;
    padding: .25em 2em;
    cursor: pointer;
    background-color: hsla(162, 100%, 26%, 1);
    color: #ffffff;
  }

}
</style>