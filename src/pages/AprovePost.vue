<template>
  <div>
    <h1 style="color: #909399">DUYỆT BÀI ĐĂNG</h1>
    <el-table
      :data="searchResult ? searchResult : tableData"
      style="width: 100%"
    >
      <el-table-column label="Id" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Người tạo" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Hình ảnh" prop="image" width="200">
        <template slot-scope="scope">
          <img
            v-if="scope.row.imageURL != ''"
            :src="scope.row.imageURL"
            style="height: 150px; width: 300px"
          />
        </template>
      </el-table-column>
      <el-table-column label="Nội dung" width="750">
        <template slot-scope="scope">
          <span>{{ scope.row.diaryContent }}</span>
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
          <!-- <el-button
            size="mini"
            type="primary"
            @click="viewDetail(scope.$index, scope.row)"
            style="margin-left: 10px"
            >Xem chi tiết</el-button> -->
          <el-button
            size="mini"
            @click="handleApprove(scope.$index, scope.row)"
            :disabled="disabledFlag"
            >Duyệt</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDeny(scope.$index, scope.row)"
            :disabled="disabledFlag"
            style="margin-left: 10px"
            >Không duyệt</el-button
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
import * as firebase from "firebase/app";
import "firebase/firebase-storage";
import Request from "../services/RequestBase.js";
import baseConfig from "../config";
const backendIp = baseConfig.backendIp;
export default {
  data() {
    return {
      tableData: [],
      imageDialogVisible: false,
      dialogImage: { imageUrl: "" },
      uploadingImage: "",
      formLabelWidth: "120px",
      formLabelWidth1: "180px",
      search: "",
      editedIndex: -1,
      NewsIdDelete: "",
      listtype: [],
      pagination: [],
      totalPages: 0,
      searchResult: null,
      rsPage: 0,
      disabledFlag: false,
    };
  },
  created: function () {
    axios
      .get(
        `http://service.mumbi.xyz/api/Diaries/GetDiaryToApprove`
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
    handleImage(imageUrl) {
      this.imageDialogVisible = true;
      this.dialogImage.imageUrl = imageUrl;
      console.log(imageUrl, this.dialogImage);
    },
    paginationLoad(pageNumber) {
      const req = Request();
      let pageSize = 5;
      let NewsRepository = this.$repository.get("Newss");
      new NewsRepository(req)
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
    async handleApprove(index, row) {
      this.editedIndex = this.tableData.indexOf(row);
      let diaryId = this.tableData[this.editedIndex].id;
      let childIdApprove = this.tableData[this.editedIndex].childId;
      let content = this.tableData[this.editedIndex].diaryContent;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios
        .put(
          `http://service.mumbi.xyz/api/Diaries/UpdateDiary/${diaryId}?childID=${childIdApprove}`,
          {
            id: diaryId,
            approvedFlag: true,
            publicFlag: true,
            diaryContent: content,
            childId: childIdApprove,
            lastModifiedBy: userInfo.id,
            publicDate: new Date()
          }
        )
        .then((rs) => {
          this.$message({
            type: "success",
            message: `Duyệt bài đăng id{${diaryId}} thành công !`,
          });
        });
      await axios
        .get(
          `http://service.mumbi.xyz/api/Diaries/GetDiaryToApprove`
        )
        .then((rs) => {
          this.tableData = rs.data.data;
        })
        .catch((e) => {
          console.error(e);
          console.log(e);
        });
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
      this.form.imageUrl = resultData;
      this.form.imageFile = file;
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
    removeImage: function (e) {
      this.addNews.image = "";
    },
    async handleDeny(index, row) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.editedIndex = this.tableData.indexOf(row);
      let diaryId = this.tableData[this.editedIndex].id;
      let childIdApprove = this.tableData[this.editedIndex].childId;
      let content = this.tableData[this.editedIndex].diaryContent;
      await axios
        .put(
          `http://service.mumbi.xyz/api/Diaries/UpdateDiary/${diaryId}?childID=${childIdApprove}`,
          {
            id: diaryId,
            approvedFlag: false,
            publicFlag: false,
            diaryContent: content,
            childId: childIdApprove,
            lastModifiedBy: userInfo.id
          }
        )
        .then((rs) => {
          this.$message({
            type: "success",
            message: `Không duyệt bài đăng id{${diaryId}} thành công !`,
          });
        });
      await axios
        .get(
          `http://service.mumbi.xyz/api/Diaries/GetDiaryToApprove`
        )
        .then((rs) => {
          this.tableData = rs.data.data;
        })
        .catch((e) => {
          console.error(e);
          console.log(e);
        });
    },
    viewDetail(index, row) {
      localStorage.setItem("ChildId", row.childId);
      this.$router.push({
        name: "NHẬT KÝ CHI TIẾT",
      });
    },
    async onSearchInput(e) {
      if (this.search === "") {
        this.rsPage = 1;
      } else {
        this.rsPage = 0;
      }
      try {
        let result = await axios.get(`${backendIp}/api/Newss?query=${e}`);
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
