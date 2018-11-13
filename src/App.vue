<template>
  <div id="app">
    <vue-toast ref="toast"></vue-toast>

    <Header/>

    <div class="content">
      <div class="container">
        <BreadCrumbs/>
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </div>

    <ml-footer/>
  </div>
</template>

<script>
import 'vue-toast/dist/vue-toast.min.css';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import Header from '@/components/Header.vue';
import mlFooter from '@/components/ml-footer.vue';
import VueToast from 'vue-toast';

export default {
  name: 'app',
  mounted() {
    this.$refs.toast.setOptions({
      position: 'right top'
    });
  },
  components: {
    BreadCrumbs,
    Header,
    mlFooter,
    VueToast
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
