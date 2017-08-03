let store;
let routes;
let route404;

const initCanCan = (reduxStore, ability, f0fRoute = '/404') => {
  store = reduxStore;
  routes = ability.default;
  route404 = f0fRoute;
};

const canManage = route => route == route404 || routes(store).includes(route);

export { initCanCan, canManage };
