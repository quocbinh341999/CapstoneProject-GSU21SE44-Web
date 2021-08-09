<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <!-- <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/> -->
        <sidebar-link to="/usermanagement" :name="$t('Quản lý người dùng')" icon="tim-icons icon-single-02"/>
        <!-- <sidebar-link to="/eventmanagement" :name="$t('event management')" icon="tim-icons icon-pin"/> -->
        <sidebar-link to="/newsmanagement" :name="$t('Quản lý tin tức')" icon="tim-icons icon-paper"/>
        <sidebar-link to="/guidebookmanagement" :name="$t('Quản lý cẩm nang')" icon="tim-icons icon-book-bookmark"/>
        <sidebar-link to="/activitymanagement" :name="$t('Quản lý hoạt động')" icon="tim-icons icon-pencil"/>
        <sidebar-link to="/approvepost" :name="$t('Duyệt bài đăng')" icon="tim-icons icon-pin"/>
        <!-- <sidebar-link to="/newsdetail" :name="$t('Duyệt bài đăng')" icon="tim-icons icon-single-02"/> -->
        <!-- <sidebar-link to="/notifications" :name="$t('Duyệt bài đăng2')" icon="tim-icons icon-single-02"/> -->
        <sidebar-link to="/profile" :name="$t('profile')" icon="tim-icons icon-badge"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
<style>
.nav p{
  font-size: 11px;
}
</style>
