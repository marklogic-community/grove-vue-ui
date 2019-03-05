<template>
  <nav class="navbar navbar-default navbar-fixed-top nav" role="navigation">
    <div class="navbar-header">
      <!-- Brand and toggle get grouped, and shown as 'hamburger' button on small screens for better mobile display -->
      <!-- TODO: convert data attributes to regular vue directives -->
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <router-link class="navbar-brand" to="/"><h1 id="logo">Sample App</h1></router-link>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav" role="tablist">
        <li v-for="(route, $index) in visibleHeaderRoutes" :key="$index">
          <router-link :to="{ name: route.name, params: { prev: currentRoute.name } }">{{ route.meta.label }}</router-link>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li class="topbar-icon right-margin-30">
          <span class="fa fa-warning center-top-icon white" ></span>
          <span class="warning-count">{{warningCount}}</span>
        </li>
        <li class="navbar-right">
          <UserMenu/>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </nav>
</template>

<script>
import UserMenu from '@/components/UserMenu.vue';

export default {
  name: 'Header',
  components: {
    UserMenu
  },
  data() {
    return {
      warningCount: 32
    };
  },
  computed: {
    currentRoute() {
      return this.$route;
    },
    visibleHeaderRoutes() {
      return this.$router.options.routes.filter(function(route) {
        if (this.$store.state.auth.authenticated) {
          return (
            !route.meta.requiresUpdates ||
            !(
              this.$store.state.auth.profile &&
              this.$store.state.auth.profile.disallowUpdates
            )
          );
        } else {
          return !(route.meta.requiresLogin || route.meta.requiresUpdates);
        }
      }, this).filter(function(route) {
        return route.meta.navArea === 'header' && (!route.meta.route || this.routeMatches(route.meta.route));
      }, this);
    }
  },
  methods: {
    routeMatches(route) {
      return this.currentRoute.name && this.currentRoute.name.startsWith(route);
    }
  }
};
</script>
