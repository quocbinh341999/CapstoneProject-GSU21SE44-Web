<template>
  <div>
    <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
    <el-table
      :data="searchResult ? searchResult : tableData"
      style="width: 100%"
    >
      <el-table-column label="Account Id" :min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Full name">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone number">
        <template slot-scope="scope">
          <span>{{ scope.row.phonenumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Image" prop="image">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleImage(scope.row.image)"
            >Hiển thị</el-button
          >
          <el-dialog title="Hình ảnh" :visible.sync="imageDialogVisible">
            <el-form :model="dialogImage">
              <el-form-item>
                <el-image
                  style="width: 100%"
                  :fit="fit"
                  v-if="dialogImage.imageUrl === ''"
                >
                  <div slot="error" class="image-slot text-center">
                    <i
                      style="font-size: 3rem"
                      class="el-icon-picture-outline"
                    ></i>
                  </div>
                </el-image>

                <img style="width: 100%" :src="dialogImage.imageUrl" />
                <span slot="title">adasdasd</span>
              </el-form-item>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            v-on:change="onSearchInput(search)"
            size="mini"
            placeholder="Type to search"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            style="margin-left: 10px"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row
      style="margin-top: 10px"
      v-if="searchResult == null || this.rsPage === 1"
    >
      <el-col :span="6" :offset="11">
        <el-button
          v-for="item in pagination"
          :key="item.pageId"
          :label="item.pageId"
          :value="item.pageId"
          circle
          @click="paginationLoad(item.pageId)"
          type="success"
          >{{ item.pageId }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import Request from "../services/RequestBase.js";
import * as firebase from "firebase/app";
import "firebase/firebase-storage";
import baseConfig from "../config";
const backendIp = baseConfig.backendIp;
export default {
  data() {
    return {
      searchResult: null,

      uploadingImage: null,
      tableData: [],
      // addUser: {
      //   userId: "",
      //   fullName: "",
      //   email: "",
      //   role: "",
      //   avatarUrl:"",

      //   avatarFile:null,
      // },
      dialogImage: { imageUrl: "" },
      dialogFormVisible: false,
      imageDialogVisible: false,
      dialogFormAddVisible: false,
      formLabelWidth: "120px",
      search: "",
      editedIndex: -1,
      userIdDelete: "",
      pagination: [],
      totalPages: 0,
      rsPage: 0,
    };
  },
  created: function () {
    const req = Request({
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    axios
      .get(
        `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/Moms/GetAllMom`
      )
      .then((rs) => {
        this.tableData = rs.data.data;
      })
      .catch((e) => {
        console.error(e);
        console.log(e);
      });
  },
  methods: {
    async handleFileChange() {
      let file = this.$refs.userimageupload.files[0];
      let resultData = await this.readAsync(file);
      this.form.avatarUrl = resultData;
      this.form.avatarFile = file;
    },
    async handleFileChangeOnCreateUser() {
      let file = this.$refs.createuserimageupload.files[0];
      let resultData = await this.readAsync(file);
      this.addUser.avatarUrl = resultData;
      this.addUser.avatarFile = file;
    },
    paginationLoad(pageNumber) {
      const req = Request();
      let pageSize = 5;
      let UserRepository = this.$repository.get("users");
      new UserRepository(req)
        .get({ pageSize, pageNumber })
        .then((rs) => {
          if (this.searchResult === null) {
            this.tableData = rs.data.data;
          } else {
            this.searchResult = rs.data.data;
          }
          console.log(this.tableData);
        })
        .catch((e) => console.error(e));
    },
    handleImage(imageUrl) {
      this.imageDialogVisible = true;
      this.dialogImage.imageUrl = imageUrl;
      console.log(imageUrl, this.dialogImage);
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
    removeImage: function (e) {
      this.addUser.image = "";
    },
    handleDelete(index, row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "Warning",
        message: h("p", null, [
          h(
            "span",
            { style: "color: black" },
            "This will permanently delete this user. Are you sure ? "
          ),
        ]),
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "Loading...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
            this.userIdDelete = row.accountId;
            axios
              .put(
                `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/Moms/DeleteMom/` +
                  this.userIdDelete
              )
              .then((response) => {});
              setTimeout(() => {
              this.tableData.splice(index, 1);
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        },
      }).then((action) => {
        this.$message({
          type: "success",
          message: "Delete completed",
        });
      });
    },
    async onSearchInput(e) {
      if (this.search === "") {
        this.rsPage = 1;
      } else {
        this.rsPage = 0;
      }
      try {
        let result = await axios.get(`${backendIp}/api/users?query=${e}`);

        console.log(result);
        this.searchResult = result.data.data;
      } catch (error) {
        this.searchResult = null;
        console.log(error);
      }
    },
  },
};
</script>