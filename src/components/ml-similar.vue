<template>
  <div class="similar-items">
    <i class="fa fa-refresh fa-spin pull-right" v-if="loading"></i>
    <h3 v-if="title">{{ title }}</h3>
    <ul>
      <li v-for="(result, $index) in similar" :key="$index">
        <router-link :to="{ name: 'root.view', params: {id: result.id || encodeURIComponent(result) } }">{{ resultLabel(result) }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import SearchApi from "../api/SearchApi";

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

        SearchApi.getSimilar(this.uri).then(result => {
          console.log('getSimilar',result);

          if (result.response) {
            this.similar = result.response.results;
            this.loading = false;
          } else {
            // error
            this.loading = false;
            return result;
          }
        });

      }
    },
    resultLabel(result) {
      if (result.label || result.uri) {
        return result.label || result.uri.split('/').pop();
      } else {
        return result.split('/').pop();
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
