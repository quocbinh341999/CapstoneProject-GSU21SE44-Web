<template>
  <div>
    <notifications></notifications>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import LoginForm from "../src/pages/LoginPage/LoginForm.vue";
export default {
  // metaInfo: {
  //   title: 'Default App Title',
  //   titleTemplate: '%s | vue-meta Example App',
  //   htmlAttrs: {
  //     lang: 'en-US'
  //   },
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'description', content: 'An example Vue application with vue-meta.' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     {http-equiv: 'Content-Security-Policy', content: 'upgrade-insecure-requests'}
  //   ]
  // },
  data() {
    return {
      headerText: "Welcome Back",
    };
  },
  components: {
    LoginForm,
  },
  methods: {
    disableRTL() {
      if (!this.$rtl.isRTL) {
        this.$rtl.disableRTL();
      }
    },
    toggleNavOpen() {
      let root = document.getElementsByTagName("html")[0];
      root.classList.toggle("nav-open");
    },
  },
  mounted() {
    this.$watch("$route", this.disableRTL, { immediate: true });
    this.$watch("$sidebar.showSidebar", this.toggleNavOpen);
  },
};
</script>

<style lang="scss">
@import "@/scss/main.scss";
</style>
