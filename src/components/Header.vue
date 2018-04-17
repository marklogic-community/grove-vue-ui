<template>
  <nav class="navbar navbar-default navbar-fixed-top nav" role="navigation">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <router-link class="navbar-brand" to="/"><h1 id="logo">Sample App</h1></router-link>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav" role="tablist">
        <li v-for="(route, $index) in $router.options.routes" :key="$index" v-if="route.meta.navArea === 'header' && showRoute(route)">
          <router-link :to="{ name: route.name, params: { prev: $route.name } }">{{ route.meta.label }}</router-link>
        </li>
      </ul>
      <UserMenu/>
    </div><!-- /.navbar-collapse -->
  </nav>
</template>

<script>
import UserMenu from "@/components/UserMenu.vue";

export default {
  name: "Header",
  components: {
    UserMenu
  },
  methods: {
    showRoute(route) {
      if (this.$store.state.auth.isLoggedIn) {
        return (
          !route.meta.requiresUpdates ||
          !(this.$store.state.auth.profile && this.$store.state.auth.profile.disallowUpdates)
        );
      } else {
        return !(route.meta.requiresLogin || route.meta.requiresUpdates);
      }
    }
  }
};
</script>
