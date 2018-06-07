<template>
  <div v-if="search.total > 0" class="ml-metrics search-metrics">
    Showing {{ pageStart }}-{{ pageEnd }} of {{ search.total }}<span v-if="!showDuration">.</span>
    <span v-if="showDuration && (seconds >= 0)">
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
    pageLength() {
      return this.search["page-length"] || this.search.pageLength || 10;
    },
    pageStart() {
      return (this.search.page !== undefined) ? ((this.search.page - 1) * this.pageLength + 1) : (this.search.start || 1);
    },
    pageEnd() {
      return Math.min(this.pageStart + this.pageLength - 1, this.search.total);
    },
    seconds() {
      return this.search.metrics && this.search.metrics['total-time'].substr(2,5) || -1;
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
