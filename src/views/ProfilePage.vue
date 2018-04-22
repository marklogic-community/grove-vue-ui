<template>
  <div v-if="user.isLoggedIn" class="profile">
    <div class="row">
      <div class="col-md-2"></div>
      <h2 class="col-md-10">Edit profile of {{ user.username }}</h2>
    </div>
    <form class="form-horizontal" name="profileForm">
      <div class="form-group">
        <div class="row">
          <div class="col-md-2">
            <label class="control-label">Full name</label>
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control" placeholder="Full name of user" v-model.trim="user.profile.fullname">
          </div>
        </div>
      </div>
      <div class="form-group" v-bind:class="{ 'has-error': $v.newEmail.$error }">
        <div class="row">
          <div class="col-md-2">
            <label class="control-label">E-mail(s)</label>
          </div>
          <div class="col-md-6">
            <input type="email" name="newEmail" class="form-control" placeholder="Email of user" v-model.trim="newEmail" v-on:input="$v.newEmail.$touch">
          </div>
          <div class="col-md-1">
            <button class="btn btn-primary" v-on:click.prevent="addEmail($v)">
              <span class="glyphicon glyphicon-plus"></span>
            </button>
          </div>
        </div>
        <div class="row valid-email">
          <div class="col-md-offset-2 col-md-6 error text-danger" v-if="$v.newEmail.$error">Not valid email!</div>
        </div>
      </div>
      <div class="form-group">
        <!-- always show add button -->
        <!-- repeat if there are emails -->
        <div class="row" v-for="(email, index) in user.profile.emails">
          <div class="col-md-offset-2 col-md-6">
            <div class="input-group additional-email">
              <input type="text" class="form-control" placeholder="e-mail of user" v-model="user.profile.emails[index]"/>
              <span class="input-group-addon btn-danger" v-on:click.prevent="removeEmail(index)">
                <span class="glyphicon glyphicon-remove"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-offset-7 col-md-5">
          <router-link to="/" class="btn btn-default">Cancel</router-link>
          <button class="btn btn-primary" v-on:click.prevent="submit($v.form)">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import { email } from 'vuelidate/lib/validators';

export default {
  name: "ProfilePage",
  data() {
    return {
      user: this.checkUser(this.$store.state.auth),
      newEmail: ""
    };
  },
  validations: {
    newEmail: {
      email
    },
    form: ['newEmail']
  },
  methods: {
    checkUser(newValue) {
        var user = Object.assign({}, newValue);
        if(user && user.profile && user.profile.emails && !user.profile.emails.length) {
            user.profile.emails = [user.profile.emails];
        }
        return user;
    },
    addEmail($v) {
      var self = this;
      if (self.user) {
        if (!self.newEmail || $v.form.newEmail.$error) {
          return;
        }
        self.user.profile = self.user.profile || {};
        if (!self.user.profile.emails) {
          self.user.profile.emails = [];
        }
        self.user.profile.emails.push(self.newEmail.trim());
        self.newEmail = '';
      }
    },
    removeEmail(index) {
      var self = this;
      if (self.user.profile && self.user.profile.emails) {
        self.user.profile.emails.splice(index, 1);
      }
    },
    submit(form) {
      var self = this;
      const toast = self.$parent.$refs.toast;
      if(!form.$invalid && self.user.profile) {
        self.addEmail();

        if (self.user.profile.emails) {
          _.pull(self.user.profile.emails, '');
        }

        toast.showToast('Success', { theme: 'success' });
      } else {
        toast.showToast('Fail!', { theme: 'error' });
      }
    }
  }
};
</script>
