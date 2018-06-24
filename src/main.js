import Vue from 'vue';
import VueHttp from './vue-http';
import BootstrapVue from 'bootstrap-vue';
import Vuelidate from 'vuelidate';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './styles/main.less';

//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueHttp);
Vue.use(BootstrapVue);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

// Configure Vue to ignore custom elements preloaded from index.html
Vue.config.ignoredElements = ['file-dropzone', 'view-binary'];

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
