<template>
  <div class="user pull-right">
    <!-- form to log in -->
    <div class="navbar-form navbar-right" v-if="!isLoggedIn" >
      <span class="profile-link"><router-link :to="{ name: 'root.login', params: { state: $route.name, params: $route.params }}" class="btn btn-primary btn-sm">Login</router-link></span>
    </div>
    <!-- display the logged in user -->
    <div class="welcome" v-if="isLoggedIn">
      <div class="navbar-collapse collapse">
        <span class="glyphicon glyphicon-user"></span> {{ profile && profile.fullname || username }} | <span class="profile-link"><router-link :to="{ name: 'root.profile' }">Account</router-link></span>

        <button class="btn btn-danger btn-xs" type="button" v-on:click.prevent="logout()">Logout</button>

      </div><!--/.navbar-collapse -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserMenu',
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.authenticated;
    },
    profile() {
      return this.$store.state.auth.profile;
    },
    username() {
      return this.$store.state.auth.username;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout').then(() => {
        if (
          this.$route.meta.requiresLogin ||
          this.$route.meta.requiresUpdates
        ) {
          this.$router.push({ name: 'root.landing' });
        }
      });
    }
  }
};
</script>
