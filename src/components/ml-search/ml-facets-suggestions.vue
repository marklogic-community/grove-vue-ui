<template>
  <div class="facet-list">

    <div class="facet" v-for="(facet, facetName, $index) in facets" :key="$index"
        v-show="!facet.hide">
      <h3>{{ facetName }}</h3>
      <ml-facets-suggestions-auto :facetName="facetName" :facet="facet" :toggle="toggle" v-on:toggle-facet="toggle" :type="type">
      </ml-facets-suggestions-auto>

    </div>
  </div>
</template>

<script>
import mlChiclets from '@/components/ml-search/ml-chiclets.vue';
import mlFacetsSuggestionsAuto from '@/components/ml-search/ml-facets-suggestions-auto.vue';

export default {
  name: 'ml-facets-suggestions',
  components: {
    mlChiclets,
    mlFacetsSuggestionsAuto
  },
  props: {
    facets: {
      type: Object,
      required: true
    },
    activeFacets: {
      type: Object,
      default() {
        return {};
      }
    },
    toggle: {
      type: Function,
      required: true
    },
    negate: {
      type: Function
    },
    type: {
      type: String,
      required: true,
    },
    showMore: {
      type: Function
    }
  },
  methods: {
    hasNonSelectedValues(facet) {
      return (facet.facetValues || []).filter(value => {
        return !value.selected;
      }).length;
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
