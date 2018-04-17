<template>
  <div class="chiclets">
    <div v-for="(facet, facetName, $index) in activeFacets" :key="$index">
      <div class="btn btn-primary chiclet" v-for="(value, $index) in facet.values" :key="$index" v-if="!value.negated">
        <span :title="value.value">{{ facetName }}: {{ value.value }}</span>
        <span class="glyphicon glyphicon-remove-circle icon-white" v-on:click.prevent="!!toggle && toggle(facetName, value.value)"></span>
      </div>
      <div class="btn btn-warning chiclet negated" v-for="(value, $index) in facet.values" :key="$index" v-if="value.negated">
        <span :title="value.value">{{ facetName }}: {{ value.value }}</span>
        <span class="glyphicon glyphicon-remove-circle icon-white" v-on:click.prevent="!toggle && toggle(facetName, value.value)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ml-chiclets",
  props: {
    activeFacets: {
      type: Object,
      required: true
    },
    toggle: {
      type: Function
    }
  }
};
</script>
