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
  computed: {},
  methods: {
    sendFile(e) {
      var progress = e.detail;
      console.log(["sendFile", progress]);
      progress.update(0);
      setTimeout(function() {
        progress.update(Math.random() * 100);
        setTimeout(function() {
          if (Math.random() > 0.5) {
            progress.update(100);
          } else {
            progress.error("upload failed");
          }
        }, Math.random() * 5000);
      }, Math.random() * 5000);
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
