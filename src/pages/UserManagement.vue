<template>
  <div>
    <h1 style="color: #909399">QUẢN LÝ NGƯỜI DÙNG</h1>
    <el-table
      :data="searchResult ? searchResult : tableData"
      style="width: 100%"
    >
      <el-table-column label="STT" type="index" width="60"> </el-table-column>
      <el-table-column label="Hình ảnh" prop="image" width="200">
        <template slot-scope="scope">
          <img
            v-if="scope.row.imageURL != ''"
            :src="scope.row.imageURL"
            style="height: 150px; width: 300px"
          />
        </template>
      </el-table-column>
      <el-table-column label="Họ tên" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phonenumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
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
            type="primary"
            @click="viewDetail(scope.$index, scope.row)"
            style="margin-left: 10px"
            >Xem chi tiết</el-button
          >
          <el-dialog :visible.sync="dialogFormVisible1" width="55%">
            <label
              v-if="tableData2 != null"
              style="float: left; font-weight: bold"
              >Trạng thái: {{ tableData1.message }}</label
            >
            <el-table
              v-if="tableData2 != null"
              :data="tableData2"
              stripe
            >
              <el-table-column label="STT" type="index" width="60">
              </el-table-column>
              <el-table-column label="Hình ảnh" prop="image" width="200">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.imageURL != ''"
                    :src="scope.row.imageURL"
                    style="height: 150px; width: 250px"
                  />
                </template>
              </el-table-column>
              <el-table-column label="Họ và tên" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.fullName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Giới tính" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.gender }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Ngày dự sinh" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.estimatedBornDate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Trạng thái" width="100">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.bornFlag === true
                      ? "Em bé"
                      : scope.row.bornFlag === false
                      ? "Thai nhi"
                      : ""
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            style="margin-left: 10px"
            >Xóa</el-button
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
      dialogImage: { imageUrl: "" },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      tableData1: [],
      tableData2: [],
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
    axios
      .get(
        `https://service.mumbi.xyz/api/MomInfo/GetAllMomInfo`
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
    handleDelete(index, row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "Warning",
        message: h("p", null, [
          h("span", { style: "color: black" }, "Bạn có chắc chắn muốn xóa ? "),
        ]),
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy bỏ",
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
            this.userIdDelete = row.id;
            axios
              .put(
                `https://service.mumbi.xyz/api/MomInfo/DeleteMomInfo/` +
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
          message: `Xóa người dùng ${row.fullName} thành công !`,
        });
      });
    },
    async viewDetail(index, row) {
      this.NewsIdDelete = row.id;
      await axios
        .get(
          `https://service.mumbi.xyz/api/ChildInfo/GetChildInfoByMomId/` +
            this.NewsIdDelete
        )
        .then((rs) => {
          this.tableData1 = rs.data;
          this.tableData2 = rs.data.data;
        })
        .catch((e) => {
          console.error(e);
          console.log(e);
        });
      if (this.tableData2 === null) {
        this.$message({
          message: `Trạng thái: Không có người con nào !`,
        });
      } else {
        this.dialogFormVisible1 = true;
      }
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