import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardGroupManager from "@/layout/dashboard/DashboardGroupManager.vue"
import LoginPageLayout from "@/layout/LoginPage/LoginPageLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

const LoginPage = () => import("@/pages/LoginPage.vue");
// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
const Profile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Notifications = () => import(/* webpackChunkName: "common" */"@/pages/Notifications.vue");
const UserManagement = () => import(/* webpackChunkName: "common" */ "@/pages/UserManagement.vue");
const ActivityManagement = () => import(/* webpackChunkName: "common" */ "@/pages/ActivityManagement.vue");
const NewsManagement = () => import(/* webpackChunkName: "common" */ "@/pages/NewsManagement.vue");
const GuidebookManagement = () => import(/* webpackChunkName: "common" */ "@/pages/GuidebookManagement.vue");
const ApprovePost = () => import(/* webpackChunkName: "common" */ "@/pages/AprovePost.vue");
const EditProfile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile/EditProfileForm.vue")
const NewsDetail = () => import(/* webpackChunkName: "common" */ "@/pages/NewsDetail.vue")
const GuidebookDetail = () => import(/* webpackChunkName: "common" */ "@/pages/GuidebookDetail.vue")
const DiaryDetail = () => import(/* webpackChunkName: "common" */ "@/pages/DiaryDetail.vue")
const routes = [
  {
    path: "/",
    component: LoginPageLayout,
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage
      },
    ]
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "/profile",
        name: "PROFILE",
        component: Profile
      },
      {
        path: "/usermanagement",
        name: "QUẢN LÝ NGƯỜI DÙNG",
        component: UserManagement
      },
      {
        path: "/newsmanagement",
        name: "QUẢN LÝ TIN TỨC",
        component: NewsManagement
      },
      {
        path: "/guidebookmanagement",
        name: "QUẢN LÝ CẨM NANG",
        component: GuidebookManagement
      },
      {
        path: "/activitymanagement",
        name: "QUẢN LÝ HOẠT ĐỘNG",
        component: ActivityManagement
      },
      {
        path: "/approvepost",
        name: "DUYỆT BÀI ĐĂNG",
        component: ApprovePost
      },
      {
        path: "/newsdetail",
        name: "TIN TỨC CHI TIẾT",
        component: NewsDetail
      },
      {
        path: "/guidebookdetail",
        name: "CẨM NANG CHI TIẾT",
        component: GuidebookDetail
      },
      {
        path: "/diarydetail",
        name: "NHẬT KÝ CHI TIẾT",
        component: DiaryDetail
      }
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
