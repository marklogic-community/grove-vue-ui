<template>
  <div class="similar-items">
    <i class="fa fa-refresh fa-spin pull-right" v-if="loading"></i>
    <h3 v-if="title">{{ title }}</h3>
    <ul>
      <li v-for="(uri, $index) in similar" :key="$index">
        <router-link :to="{ name: 'root.view', params: {uri: uri} }">{{ uri }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ml-similar',
  props: {
    title: {
      type: String,
      default() {
        return '';
      }
    },
    uri: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      similar: []
    };
  },
  methods: {
    updateSimilar() {
      if (this.uri) {
        this.loading = true;
        this.$http({
          method: 'GET',
          url: '/v1/resources/extsimilar',
          params: {
            'rs:uri': this.uri
          },
          auth: {
            username: this.$store.state.auth.username,
            password: this.$store.state.auth.password,
            sendImmediately: true
          }
        }).then(
          response => {
            this.similar = response.data.similar;
            this.loading = false;
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        );
      }
    }
  },
  watch: {
    uri(newUri) {
      if (newUri) {
        this.updateSimilar();
      }
    }
  },
  mounted() {
    this.updateSimilar();
  }
};
</script>
