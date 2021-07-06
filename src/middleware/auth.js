export const authMiddleware = async (to, from, next) => {
  // if (store.state.user) {
  //   next();
  // } else {
  //   try {
  //     const user = await apiRequest();
  //     await store.dispatch("setUser", user);
  //     if (to.path === "/login") {
  //       next("/");
  //     } else {
  //       next();
  //     }
  //   } catch (error) {
  //     if (to.path !== "/login") {
  //       next("/login");
  //     } else {
  //       next();
  //     }
  //   }
  // }
  const token = sessionStorage.getItem('lib-token') ?? false
  const routeWithoutToken = ['login', 'error']
  if (!routeWithoutToken.includes(to.name) && !token) next({ name: 'login' })
  else next()
};