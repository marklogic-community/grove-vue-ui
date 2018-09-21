import Vue from 'vue';
import Router from 'vue-router';
import { sync } from 'vuex-router-sync';

import $store from './store';

Vue.use(Router);

const checkLogin = (to, from, next) => {
  if (!$store.state.initialized) {
    $store.dispatch('init').then(function() {
      redirectBasedOnAuth(to, from, next);
    });
  } else {
    redirectBasedOnAuth(to, from, next);
  }
};

const redirectBasedOnAuth = (to, from, next) => {
  if (
    $store.state.auth.authenticated ||
    !(to.meta.requiresLogin || to.meta.requiresUpdates)
  ) {
    next();
  } else {
    next({
      replace: true,
      name: 'root.login',
      params: { state: to.name, params: to.params }
    });
  }
};

const $router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root.landing',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "landing" */ './views/LandingPage.vue'),
      meta: {
        label: 'Home',
        navArea: 'header'
      }
    },
    {
      path: '/upload/all',
      name: 'root.upload',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "upload" */ './views/UploadPage.vue'),
      props: {
        type: 'all'
      },
      meta: {
        label: 'Upload',
        navArea: 'header',
        requiresUpdates: true,
        checkLogin
      }
    },
    {
      path: '/search/all',
      name: 'root.search',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "search" */ './views/SearchPage.vue'),
      props: {
        type: 'all'
      },
      meta: {
        label: 'Search',
        navArea: 'header',
        requiresLogin: true,
        checkLogin
      }
    },
    {
      path: '/create/all',
      name: 'root.create',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "create" */ './views/CreatePage.vue'),
      props: {
        type: 'all'
      },
      meta: {
        label: 'Create',
        navArea: 'header',
        requiresUpdates: true
      }
    },
    {
      path: '/login',
      name: 'root.login',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "login" */ './views/LoginPage.vue'),
      meta: {
        label: 'Login',
        navArea: 'usermenu'
      }
    },
    {
      path: '/profile',
      name: 'root.profile',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "profile" */ './views/ProfilePage.vue'),
      meta: {
        label: 'Profile',
        navArea: 'usermenu',
        requiresLogin: true
      }
    },
    {
      path: '/edit/all/:id',
      name: 'root.edit',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "create" */ './views/CreatePage.vue'),
      props($route) {
        return {
          type: 'all',
          id: $route.params.id
        };
      },
      meta: {
        label: 'Edit',
        navArea: 'document',
        requiresUpdates: true
      }
    },
    {
      path: '/detail/all/:id',
      name: 'root.view',
      // lazy-loading of page
      component: () =>
        import(/* webpackChunkName: "detail" */ './views/DetailPage.vue'),
      props($route) {
        return {
          type: 'all',
          id: $route.params.id
        };
      },
      meta: {
        label: 'View',
        navArea: 'document',
        requiresLogin: true
      }
    }
  ]
});

// Keep the router in sync with vuex store
sync($store, $router);

// Protect all protected routes, redirecting to login if needed
$router.beforeEach(checkLogin);

export default $router;
