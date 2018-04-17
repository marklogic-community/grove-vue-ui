<template>
  <div class="row">
    <div class="col-md-6 col-md-offset-3">
      <div class="jumbotron login-box">
        <div>
          <form v-on:submit.prevent="doLogin()">
            <div class="alert alert-danger" v-show="hasError" v-cloak>Username and/or Password Incorrect</div>
            <div class="alert alert-success" v-show="hasSuccess" v-cloak>You successfully logged in</div>
            <div class="form-group">
              <input type="text" placeholder="Username" class="form-control" v-model="user" autocomplete="@sample-app-name login username">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control" v-model="pass" autocomplete="@sample-app-name login current-pasword">
            </div>
            <button v-if="showCancel" type="button" class="btn btn-default" v-on:click.prevent="doCancel()">Cancel</button>
            <button type="submit" class="btn btn-success">Sign in <i v-if="pending" class="fa fa-refresh fa-spin"/></button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  beforeRouteUpdate (to, from, next) {
    this.user = "";
    this.pass = "";
    this.pending = false;
    this.hasSuccess = false;
    this.hasError = false;
    next();
  },
  data() {
    return {
      user: "",
      pass: "",
      pending: false,
      hasSuccess: false,
      hasError: false
    };
  },
  computed: {
    showCancel() {
      return this.$route.params && this.$route.params.state;
    }
  },
  methods: {
    doLogin() {
      var self = this;

      self.pending = true;
      self.hasSuccess = false;
      self.hasError = false;

      self.$store.dispatch({
        type: "auth/login",
        user: self.user,
        pass: self.pass
      }).then(error => {
        self.pending = false;
        if (error) {
          self.hasError = true;
        } else {
          self.hasSuccess = true;
          if (self.$route.params && self.$route.params.state) {
            self.$router.push({ name: self.$route.params.state, params: self.$route.params.params });
          }
        }
      });
    },
    doCancel() {
      var self = this;
      self.$store.dispatch("auth/cancelLogin").then(() => {
        if (self.$route.params && self.$route.params.state) {
          self.$router.push({ name: self.$route.params.state, params: self.$route.params.params });
        } else {
          self.$router.push({ name: "root.landing" });
        }
      });
    }
  }
};
</script>
