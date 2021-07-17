<template>
  <div class="row">
    <div class="col-md-8">
      <!-- <edit-profile-form :model="model">
      </edit-profile-form> -->
      <card>
        <h5 slot="header" class="title">Profile</h5>
        <div class="row">
          <div class="col-md-6 pr-md-1">
            <base-input
              label="Project"
              placeholder="Mumbi"
              disabled
              id="testColor"
            >
            </base-input>
          </div>
          <div class="col-md-6 pl-md-1">
            <base-input
              label="Email"
              type="email"
              v-model="model.mail"
              disabled
              id="testColor"
            >
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 pr-md-3">
            <base-input
              label="Họ và tên"
              v-model="model.fullName"
              placeholder="Fullname"
              disabled
              id="testColor"
            >
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 pr-md-1">
            <base-input
              label="Số điện thoại"
              v-model="model.phoneNumber"
              disabled
              id="testColor"
            >
            </base-input>
          </div>
          <div class="col-md-6 pl-md-1">
            <base-input
              id="testColor"
              label="Ngày sinh"
              v-model="model.birthDay"
              disabled
            >
            </base-input>
          </div>
        </div>
        <!-- <base-button slot="footer" type="primary" @click="editProfile"
          >Chỉnh sửa hồ sơ</base-button
        > -->
      </card>
    </div>
    <div class="col-md-4">
      <user-card :user="user"></user-card>
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./Profile/EditProfileForm";
import UserCard from "./Profile/UserCard";
import axios from "axios";
import Request from "../services/RequestBase.js";
import { mapGetters } from "vuex";
export default {
  components: {
    EditProfileForm,
    UserCard,
  },
  methods: {
    getUserInfo() {
      return this.$store.getters.getUserInfo;
    },
    handleImage(imageUrl) {
      this.imageDialogVisible = true;
      this.dialogImage.imageUrl = imageUrl;
      console.log(imageUrl, this.dialogImage);
    },
    editProfile() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let userInfo1 = JSON.parse(localStorage.getItem("userInfo1"));
      this.dialogFormVisible = true;
      this.formEdit.name = userInfo1.fullName;
      this.formEdit.date = userInfo1.birthday;
      this.formEdit.phonenumber = userInfo1.phonenumber;
      this.formEdit.imageUrl = userInfo.photo;
    },
    async confirm(index, row) {
      this.dialogFormVisible = false;
      let NewsId = this.tableData[this.editedIndex].id;
      try {
        if (this.form.imageFile) {
          var ref = firebase
            .storage()
            .refFromURL("gs://mumbi-app-84d15.appspot.com")
            .child(`News/${this.form.imageFile.name}`);

          await ref.put(this.form.imageFile);
          let imageUrl1 = await ref.getDownloadURL();
          await axios.put(
            `https://service.mumbi.xyz/api/News/UpdateNews/` +
              NewsId,
            {
              id: NewsId,
              title: this.form.title,
              newsContent: this.form.NewsContent,
              imageURL: imageUrl1,
              typeId: this.form.typeName,
            }
          );
          this.tableData[this.editedIndex].title = this.form.title;
          this.tableData[this.editedIndex].newsContent = this.form.NewsContent;
          this.tableData[this.editedIndex].typeId = this.form.typeName;
          this.tableData[this.editedIndex].imageURL = this.form.imageUrl;
        } else {
          await axios.put(
            `https://service.mumbi.xyz/api/News/UpdateNews/` +
              NewsId,
            {
              imageURL: this.form.imageUrl,
              id: NewsId,
              title: this.form.title,
              newsContent: this.form.NewsContent,
              typeId: this.form.typeName,
            }
          );
          this.tableData[this.editedIndex].imageURL = this.form.imageUrl;
          this.tableData[this.editedIndex].title = this.form.title;
          this.tableData[this.editedIndex].newsContent = this.form.NewsContent;
          this.tableData[this.editedIndex].typeId = this.form.typeId;
        }

        this.$message({
          message: `Cập nhật tin tức thành công !`,
          type: "success",
        });
      } catch (e) {
        console.log(e);
        this.$message({
          message: `Cập nhật tin tức không thành công ! `,
        });
      }
    },
    readAsync(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.onerror = () => {
          reject(new Error("Unable to read.."));
        };
        reader.readAsDataURL(blob);
      });
    },
    async handleFileChange() {
      let file = this.$refs.Newsimageupload.files[0];
      let resultData = await this.readAsync(file);
      this.formEdit.imageUrl = resultData;
      this.formEdit.imageFile = file;
    },
    async handleFileChangeOnCreateNews() {
      let file = this.$refs.createNewsimageupload.files[0];
      let resultData = await this.readAsync(file);
      this.addNews.imageUrl = resultData;
      this.addNews.imageFile = file;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
  computed: {
    // getFullName1(){
    //   return "abcdef"
    // }
  },
  async created() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let result = await axios.get(
      `https://service.mumbi.xyz/api/UserInfo/GetStaffInfoBy/${userInfo.id}`
    );
    let user1 = result.data.data;
    localStorage.setItem("userInfo1", JSON.stringify(user1));
    let userInfo1 = JSON.parse(localStorage.getItem("userInfo1"));
    this.user = {
      fullName: userInfo.fullname,
      title: "Nhân viên",
      avatarUrl: userInfo.photo,
    };
    this.model = {
      mail: userInfo.email,
      fullName: userInfo.fullname,
      birthDay: userInfo1.birthday,
      phoneNumber: userInfo1.phonenumber,
    };
  },
  data() {
    return {
      formLabelWidth: "120px",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      value2: "",
      tableData: [],
      birthDay1: "",
      phoneNumber1: "",
      uploadingImage: "",
      model: {
        company: "",
        mail: "",
        fullName: "",
        address: "",
        city: "",
        country: "",
        about: "",
      },
      user: {
        fullName: "",
        title: "",
        description: ``,
      },
      form: {
        name: "",
        phone: "",
        date: "",
        email: "",
      },
      formEdit: {
        name: "",
        phone: "",
        date: "",
      },
      dialogFormVisible: false,
    };
  },
};
</script>
<style>
#testColor {
  color: black;
  background-color: white;
}
#testColor1{
  color: black;
  background-color: white;
}
</style>
