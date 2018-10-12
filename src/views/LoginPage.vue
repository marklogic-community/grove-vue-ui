<template>
  <div class="row">
    <div class="col-md-6 col-md-offset-3">
      <div class="jumbotron login-box">
        <form v-on:submit.prevent="isLoggedIn ? doLogout() : doLogin()">
          <div class="alert alert-danger" v-show="hasLoginError" v-cloak>Username and/or Password Incorrect</div>
          <div class="alert alert-success" v-show="hasLoginSuccess" v-cloak>You successfully logged in</div>
          <div class="alert alert-danger" v-show="hasLogoutError" v-cloak>Logout failed</div>
          <div class="alert alert-success" v-show="hasLogoutSuccess" v-cloak>You successfully logged out</div>
          <div v-if="!isLoggedIn">
            <div class="form-group">
              <input type="text" placeholder="Username" class="form-control" v-model="user" autocomplete="@sample-app-name login username">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control" v-model="pass" autocomplete="@sample-app-name login current-pasword">
            </div>
          </div>
          <button v-if="showCancel" type="button" class="btn btn-default" v-on:click.prevent="doCancel()">Cancel</button>
          <button type="submit" class="btn btn-success">Sign {{ isLoggedIn ? 'out' : 'in' }} <i v-if="pending" class="fa fa-refresh fa-spin"/></button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  beforeRouteUpdate(to, from, next) {
    this.user = '';
    this.pass = '';
    this.pending = false;
    this.hasLoginSuccess = false;
    this.hasLoginError = false;
    this.hasLogoutSuccess = false;
    this.hasLogoutError = false;
    next();
  },
  data() {
    return {
      user: '',
      pass: '',
      pending: false,
      hasLoginSuccess: false,
      hasLoginError: false,
      hasLogoutSuccess: false,
      hasLogoutError: false
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.authenticated;
    },
    showCancel() {
      return this.$route.params && this.$route.params.state;
    }
  },
  methods: {
    doLogin() {
      var self = this;

      self.pending = true;

      self.hasLoginSuccess = false;
      self.hasLoginError = false;
      self.hasLogoutSuccess = false;
      self.hasLogoutError = false;

      self.$store
        .dispatch('auth/login', {
          user: self.user,
          pass: self.pass
        })
        .then(function(error) {
          self.pending = false;
          if (error) {
            self.hasLoginError = true;
          } else {
            self.hasLoginSuccess = true;
            if (self.$route.params && self.$route.params.state) {
              self.$router.push({
                name: self.$route.params.state,
                params: self.$route.params.params
              });
            }
          }
        });
    },
    doCancel() {
      var self = this;
      self.$store.dispatch('auth/cancelLogin').then(() => {
        if (self.$route.params && self.$route.params.state) {
          self.$router.push({
            name: self.$route.params.state,
            params: self.$route.params.params
          });
        } else {
          self.$router.push({ name: 'root.landing' });
        }
      });
    },
    doLogout() {
      var self = this;

      self.pending = true;

      self.hasLoginSuccess = false;
      self.hasLoginError = false;
      self.hasLogoutSuccess = false;
      self.hasLogoutError = false;

      self.$store.dispatch('auth/logout').then(function(error) {
        self.pending = false;
        if (error) {
          self.hasLogoutError = true;
        } else {
          self.hasLogoutSuccess = true;
        }
      });
    }
  }
};
</script>
