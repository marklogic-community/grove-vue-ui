<template>
    <div class="facet-list-suggestion">
        <multiselect v-if="suggestions.length && (current.length || (suggestions.length > facet.facetValues.length))"
                :v-model="selected"
                :options="suggestions"
                :multiple="false"
                :searchable="true"
                :customLabel="nameWithCount"
                placeholder="Search more.."
                label="name"
                track-by="name"
                open-direction="bottom"
                v-on:search-change.prevent="getSuggestions"
                v-on:select="onSelected"
        >
        </multiselect>
    </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import Vue from 'vue';

  export default {
    name: 'ml-facet-suggestions',
    components: {
      Multiselect
    },
    props: {
      facet: {
        type: Object,
        required: true
      },
      toggle: {
        type: Function,
        required: true
      },
      suggest: {
        type: Function,
        reqiured: true
      }
    },
    data() {
      return {
        current: '',
        selected: null,
        suggestions: []
      };
    },
    created() {
      this.getSuggestions('');
    },
    methods: {
      onSelected(option) {
        this.selected = option;
        this.toggle(this.facet.name, this.facet.type, option.name)
        .then(() => this.getSuggestions(''));
      },
      getSuggestions(current) {
        var self = this;
        this.current = current;
        this.suggest(this.facet.name, current)
        .then(suggestions => {
          self.suggestions = suggestions;
        });
      },
      nameWithCount(option) {
        return '' + option.name + ' ' + (option.count?'('+option.count+')':'');
      },
    }
  };
</script>

<style lang="less" scoped>
</style>
