import Vue from "vue";
import Router from "vue-router";
import { sync } from "vuex-router-sync";

import CreatePage from "./views/CreatePage.vue";
import DetailPage from "./views/DetailPage.vue";
import LandingPage from "./views/LandingPage.vue";
import LoginPage from "./views/LoginPage.vue";
import ProfilePage from "./views/ProfilePage.vue";
import SearchPage from "./views/SearchPage.vue";
import UploadPage from "./views/UploadPage.vue";

import $store from "./store";

Vue.use(Router);

const checkLogin = (to, from, next) => {
  if (!$store.state.auth.initialized) {
    $store.dispatch("auth/getStatus").then(function() {
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
      name: "root.login",
      params: { state: to.name, params: to.params }
    });
  }
};

const $router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "root.landing",
      component: LandingPage,
      meta: {
        label: "Home",
        navArea: "header"
      }
    },
    {
      path: "/upload",
      name: "root.upload",
      component: UploadPage,
      meta: {
        label: "Upload",
        navArea: "header",
        requiresUpdates: true,
        checkLogin
      }
    },
    {
      path: "/search",
      name: "root.search",
      component: SearchPage,
      meta: {
        label: "Search",
        navArea: "header",
        requiresLogin: true,
        checkLogin
      }
    },
    {
      path: "/create",
      name: "root.create",
      component: CreatePage,
      meta: {
        label: "Create",
        navArea: "header",
        requiresUpdates: true
      }
    },
    {
      path: "/login",
      name: "root.login",
      component: LoginPage,
      meta: {
        label: "Login",
        navArea: "usermenu"
      }
    },
    {
      path: "/profile",
      name: "root.profile",
      component: ProfilePage,
      meta: {
        label: "Profile",
        navArea: "usermenu",
        requiresLogin: true
      }
    },
    {
      path: "/edit:uri",
      name: "root.edit",
      component: CreatePage,
      meta: {
        label: "Edit",
        navArea: "document",
        requiresUpdates: true
      }
    },
    {
      path: "/detail:uri",
      name: "root.view",
      component: DetailPage,
      meta: {
        label: "View",
        navArea: "document",
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
