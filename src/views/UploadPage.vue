<template>
  <section class="upload">
    <h1>Upload page</h1>
    <file-dropzone
        button="false"
        multiple="multiple"
        v-on:drop="sendFile"
        v-on:drop-all="sendAllFiles"
        v-on:file-dblclick="openFile">
      <div slot="intro">
        <p><strong>Drop files here or click to select files.</strong></p>
        <em>(Files will be uploaded automatically)</em>
      </div>
    </file-dropzone>
  </section>
</template>

<script>
export default {
  name: "UploadPage",
  components: {},
  props: ['type'],
  computed: {},
  methods: {
    sendFile(e) {
      var progress = e.detail;
      console.log(["sendFile", progress]);
      progress.update(0);
      this.$store.dispatch('crud/' + this.type + '/create', {
        id: encodeURIComponent('/upload/' + progress.file.name),
        data: progress.file,
        format: 'binary'
      }).then(function(response) {
        if (!response.isError) {
          progress.update(100);
        } else {
          progress.error(response.error);
        }
      })
    },
    sendAllFiles(e) {
      var all = e.detail;
      console.log(["sendAllFiles", all]);
    },
    openFile(e) {
      var progress = e.detail;
      console.log(["openFile", progress]);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
