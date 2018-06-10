<template>
  <div class="row detail">
    <div class="col-sm-8 content-col">
      <h3>{{ fileName }} ({{ contentType }})</h3>
      <view-binary :src="viewUri" :type="contentType" :title="fileName">
        <a slot="fallback" class="btn btn-default" :href="downloadUri" target="_blank" download>Download</a>
      </view-binary>
      <!--h3>{{ fileName }}</h3>
      <simple-view-file :uri="viewUri" :content-type="contentType"
        :download-uri="downloadUri" :file-name="fileName">
      </simple-view-file- ->
      <h3>{{ fileName }}</h3>
      <view-file :uri="viewUri" :content-type="contentType"
        :allow-modal="true" :controls="true" :download-uri="downloadUri"
        :file-name="fileName" :show-code="false" :trust-uri="false">
      </view-file-->
    </div>
    <div class="col-sm-4 right-col">
      <div id="buttons-detail">
        <button class="btn btn-default" ui-sref="root.search">Search</button>
        <button class="btn btn-primary"
                v-show="!profile.disallowUpdates"
                ui-sref="root.edit({uri: uri})">Edit</button>
        <button class="btn btn-primary"
                v-show="!profile.disallowUpdates"
                v-on:click.prevent="deleteDoc()">Delete</button>
      </div>
      <br>
      <!-- show (links to) similar documents -->
      <div class="panel panel-default similar">
        <div class="panel-heading">Similar</div>
        <div class="panel-body">
          <ml-similar :uri="uri" limit="5"></ml-similar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mlSimilar from "@/components/ml-similar.vue";
import viewFile from "@/components/view-file.vue";
import simpleViewFile from "@/components/simple-view-file.vue";

export default {
  name: "DetailPage",
  components: {
    mlSimilar,
    simpleViewFile,
    viewFile
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile || {};
    },
    id() {
      return this.$route.params.id;
    },
    uri() {
      return decodeURIComponent(this.id);
    },
    fileName() {
      return this.uri.split('/').pop();
    },
    contentType() {
      return "application/" + this.uri.split('.').pop();
    },
    viewUri() {
      return "/api/all/" + this.id;
    },
    downloadUri() {
      return this.viewUri + "?download=true";
    },
    json() {
      return {};
    }
  },
  methods: {
    deleteDoc() {
      if (window.confirm("This will permanently delete " + this.fileName + ", are you sure?")) {
        const toast = self.$parent.$refs.toast;
        const self = this;
        self.$store.dispatch("document/delete",self.uri).then(error => {
          if (error) {
            toast.showToast('Failed to delete the document', { theme: 'error' });
          } else {
            toast.showToast('Successfully deleted the document', { theme: 'success' });
            self.$router.push({ name: self.previousRoute.name, params: self.previousRoute.params });
          }
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
  view-binary {
    display: block;
    height: 600px;
  }
</style>
