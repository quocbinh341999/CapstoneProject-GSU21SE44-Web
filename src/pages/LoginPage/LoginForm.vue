<template>
  <div>
    <div class="loginForm">
      <div class="a-heroImage"></div>
      <div class="m-formContainer">
        <form class="m-loginForm" style="margin-top: 18vh">
          <!-- <img src="mumbi.png" alt="hinhh" width="100px" height="100px">  -->
          <Header :title="headerText" />
          <base-button
            class="d-block align-middle mx-auto"
            native-type="submit"
            type="primary"
            @click.prevent="googleSignin"
            ><font-awesome-icon :icon="ggIcon" style="margin-right: 15px" />
            Đăng nhập qua Google</base-button
          >
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/Inputs/Header";
// import SubmitButton from "../../components/buttons/SubmitButton.vue";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import * as firebase from "firebase/app";
import "firebase/auth";
import Request from "../../services/RequestBase";
import axios from "axios";
import baseConfig from "../../config";
const backendIp = baseConfig.backendIp;
export default {
  data() {
    return {
      headerText: "Welcome to Mumbi",
    };
  },
  components: {
    Header,
  },
  props: {
    title: String,
  },
  computed: {
    fbIcon() {
      return faFacebook;
    },
    ggIcon() {
      return faGoogle;
    },
  },
  methods: {
    pressed() {
      this.$message({
        type: "warning",
        message: "Not yet implemented",
        showClose: true,
      });
    },
    googleSignin() {
      const req = Request({
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      // let AuthRepository = this.$repository.get("auth");
      // let authRepoInstance = new AuthRepository(req);

      const provider = new firebase.auth.GoogleAuthProvider();
      let _this = this;
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          let token = await result.user.getIdToken();
          let loginResult = await axios.post(
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/Accounts/Authenticate`,
            {
              idToken: token,
            }
          );
          console.log(loginResult);
          if (loginResult.data.data.role === "role01") {
            _this.$message({
              type: "warning",
              message: "You do not have permission to log in.",
            });
          } else {
            _this.$router.replace({
              name: "dashboard",
            });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/scss/components/forms/_loginForm.scss";
@import "@/scss/main.scss";
// VARIABLES
.loginForm {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: left;
}
.a-heroImage {
  width: 50vw;
  height: 100vh;
  background-image: url(1.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
