<template>
  <div v-if="search.total > 0" class="ml-metrics search-metrics">
    Showing {{ search.start }}-{{ pageEnd }} of {{ search.total }}<span v-if="!showDuration">.</span>
    <span v-if="showDuration">
      <span> in {{ seconds }} seconds.</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "ml-metrics",
  props: {
    search: {
      type: Object,
      default: () => {
        return {};
      }
    },
    showDuration: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    pageEnd() {
      return this.search.start + this.search["page-length"] - 1;
    },
    seconds() {
      return this.search.metrics['total-time'].substr(2,5);
    }
  }
};
</script>

<style lang="less" scoped>
.ml-metrics {
  padding-bottom: 10px;
  font-style: italic;
}
</style>
