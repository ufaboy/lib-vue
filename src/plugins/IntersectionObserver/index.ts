import observer from "@/plugins/IntersectionObserver/observer.vue";
export default {
  // @ts-expect-error
  install(app) {
    app.component('observer', observer)
  }
}
