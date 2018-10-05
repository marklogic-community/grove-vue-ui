import $http from 'axios';

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }

  plugin.installed = true;

  Object.defineProperties(Vue.prototype, {
    $http: {
      get() {
        return $http;
      }
    }
  });
}

export default plugin;
