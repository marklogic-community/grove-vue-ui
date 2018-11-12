<template>
  <div class="facet" v-if="nonSelectedValues.length && !facet.hide">
    <h3>{{ facet.name }}</h3>
    <div v-for="(value, $index) in nonSelectedValues" :key="$index">
      <span v-on:click.prevent="toggle(facet.name, facet.type, value.name)">
        <i class="fa fa-plus-circle facet-add-pos"></i>
        <span v-if="!!value.name" :title="value.name"> {{ value.name }}</span>
        <em v-if="!value.name">blank</em>
        <span> ({{ value.count }}) </span>
      </span>
      <i v-if="!!negate" class="fa fa-ban facet-add-neg" v-on:click.prevent="negate(facet.name, facet.type, value.name)" :title="value.name"></i>
    </div>
    <!--div v-if="!!showMore && !facet.displayingAll">
      <a href v-on:click.prevent="showMore(facetName)">see more ...</a>
    </div-->
    <ml-facet-suggestions v-if="suggest" :facet="facet" :toggle="toggle" :suggest="suggest">
    </ml-facet-suggestions>
  </div>
</template>

<script>
import mlFacetSuggestions from '@/components/ml-search/ml-facet-suggestions.vue';

export default {
  name: 'ml-facet',
  components: {
    mlFacetSuggestions
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
    negate: {
      type: Function
    }/*,
    showMore: {
      type: Function
    }*/,
    suggest: {
      type: Function
    }
  },
  computed: {
    facetValues() {
      return this.facet.facetValues || [];
    },
    nonSelectedValues() {
      return this.facetValues.filter(value => {
        return !value.selected;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.facet-list {
  .facet-add-pos,
  .facet-add-neg {
    visibility: hidden;
  }
  span:hover > .facet-add-pos,
  div:hover > .facet-add-neg {
    visibility: visible !important;
  }
}
</style>
