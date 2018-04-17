<template>
  <section>
    <div class="row">
      <div class="col-xs-12 search-row">
        <ml-input :qtext="qtext" :search="search" :suggest="suggest" class="search"></ml-input>
      </div>
    </div>
    <div class="search row">
      <div class="col-xs-12 col-sm-4 col-md-3 facets-col">
        <ml-facets v-if="response.facets" :facets="response.facets" :toggle="toggleFacet" :active-facets="activeFacets" :negate="toggleNegatedFacet"></ml-facets>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-9 results-col">
        <i class="fa fa-refresh pull-right" :class="searchPending ? 'fa-spin' : ''"
          v-on:click.prevent="$forceUpdate()"></i>
        <transition name="fade" mode="out-in">
          <h4 v-if="!response.total">Do a search to get results</h4>
          <h4 v-else-if="response.total === 0">No results to show</h4>
          <div v-else class="results">
            <div class="pagination-ctrls">
              <b-pagination size="sm" v-model="page" v-on:change="pageChanged" :limit="10" boundary-links="true" :total-rows="response.total" :per-page="response['page-length']">
              </b-pagination>
              <!--div class="col-sm-12 col-lg-5" id="search-operator-dropdowns">
                <ml-select label="'Snippet Size'" current-selection="mlSearch.getSnippet() || 'compact'" selection-list="snippetList" on-select="setSnippet(selectionName)"></ml-select>
                <ml-select label="'Sort'" current-selection="mlSearch.getSort() || 'score'" selection-list="sortList" on-select="setSort(selectionName)"></ml-select>
              </div-->
            </div>
            <ml-metrics :search="response"></ml-metrics>
            <ml-results :results="response.results"></ml-results>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import mlFacets from "@/components/ml-search/ml-facets.vue";
import mlInput from "@/components/ml-search/ml-input.vue";
import mlMetrics from "@/components/ml-search/ml-metrics.vue";
import mlResults from "@/components/ml-search/ml-results.vue";
import mlSelect from "@/components/ml-select.vue";

export default {
  name: "SearchPage",
  data() {
    return {
      mode: "all",
      qtext: "",
      page: 1,
      searchPending: false
    }
  },
  components: {
    mlFacets,
    mlInput,
    mlMetrics,
    mlResults,
    mlSelect
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    response() {
      return this.$store.state.search[this.mode].response || {};
    },
    activeFacets() {
      return this.$store.state.search[this.mode].activeFacets || {};
    }
  },
  activated: () => {
    if (this.isLoggedIn && !this.$store.state.search[this.mode].response) {
      this.search();
    }
  },
  watch: {
    isLoggedIn: function(isLoggedIn) {
      if (isLoggedIn) {
        this.search();
      }
    }
  },
  methods: {
    toggleFacet(facet, value) {
      console.log("Toggle " + facet + " " + value);
    },
    toggleNegatedFacet(facet, value) {
      console.log("Negate " + facet + " " + value);
    },
    pageChanged(p) {
      console.log("Changing to page " + p);
      this.page = p;
      this.search();
    },
    search(qtext) {
      this.searchPending = true;
      this.qtext = qtext !== undefined ? qtext : this.qtext;
      console.log("Search " + this.qtext);
      this.$store.dispatch({
        type: "search/search",
        mode: this.mode,
        qtext: this.qtext,
        page: this.page,
        length: this.response['page-length'] || 10
      }).then(() => {
        this.searchPending = false;
      });
    },
    suggest(val) {
      console.log("Suggest " + val);
      return new Promise(resolve => {
        resolve([val + " abc", "def " + val]);
      });
    }
  }
};
</script>
