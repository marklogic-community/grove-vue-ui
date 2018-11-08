<template>
    <div class="facet-list-suggestion">
        <multiselect
                v-model="selected"
                :options="suggestions"
                :multiple="true"
                @search-change="getList"
                :searchable="true"
                placeholder="Type to search"
                label="name"
                track-by="name"
                @select="onSelected"
                open-direction="bottom"
                @remove="onRemove"
                :customLabel="customLabel"
        >
        </multiselect>
    </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import Vue from 'vue';
  import SearchApi from '@/api/SearchApi.js';

  export default {
    props: {
      facetName: {
        type: String,
        required: true
      },
      facet: {
        type: Object,
        required: true
      },
      toggle: {
        type: Function,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      negate: {
        type: Function
      }
    },
    data() {
      return {
        selected: '',
        suggestions: this.facet.facetValues || [],
        //options: Vue.util.extend({}, this.facet).facetValues,
        debounceMilliseconds: 50,
        limit: 10
      };
    },
    watch: {
      facet () {
        if (this.facet) {
          this.suggestions = this.facet.facetValues || [];
        }
      }
    },
    name: 'ml-facets-suggestions-auto',
    components: {
      Multiselect
    },
    methods: {
      onSelected(option) {
        this.selected = option;
        this.toggle(this.facetName, this.facet.type, option.name);
      },
      getList(current) {
        if (current === '' || current === undefined) {
          return;
        }

        let qtext = this.facetName + ':' + current;

        const suggestPromise = SearchApi.suggest(this.type, qtext);

        suggestPromise.then(response => {
          let newVal = response.suggestions.map(
            (suggestion) => {
              let name = suggestion.split(':')[1];
              return {name: name, value: name};
            }
          );
          this.suggestions = newVal;
          return newVal;
        });
      },
      onRemove(option) {
        this.suggestions = this.options;
        this.toggle(this.facetName, this.facet.type, option.name);
      },
      customLabel (option) {
        return '' + option.name + ' ' + (option.count?'('+option.count+')':'');
      },
    }
  };
</script>

<style lang="less" scoped>
</style>
