<template>
  <div>
    <h1>QUẢN LÝ TIN TỨC</h1>
    <el-button
      type="primary"
      @click="dialogFormAddVisible = true"
      style="margin-bottom: 15px"
      plain
      >Thêm tin mới</el-button
    >
    <el-dialog title="Thêm tin mới" :visible.sync="dialogFormAddVisible">
      <el-form :model="addNews">
        <el-row type="flex" class="row-bg" justify="center">
          <el-form-item style="width: 50%">
            <el-image
              style="width: 100%"
              :fit="fit"
              v-if="addNews.imageUrl === ''"
            >
              <div slot="error" class="image-slot text-center">
                <i style="font-size: 3rem" class="el-icon-picture-outline"></i>
              </div>
            </el-image>

            <img style="width: 100%" :src="addNews.imageUrl" />
          </el-form-item>
        </el-row>
        <label class="file-select" style="margin-left: 80%">
          <!-- We can't use a normal button element here, as it would become the target of the label. -->
          <div class="select-button">
            <!-- Display the filename if a file has been selected. -->
            <span
              v-if="uploadingImage"
              style="
                padding: 1rem;
                color: white;
                background-color: #2ea169;
                border-radius: 0.3rem;
                text-align: center;
                font-weight: bold;
              "
              >Selected image: {{ uploadingImage.name }}</span
            >
            <span v-else style="cursor: pointer">Select File</span>
          </div>
          <!-- Now, the file input that we hide. -->
          <input
            id="createNewsimageupload"
            ref="createNewsimageupload"
            accept="image/png,image/jpeg,image/jpg"
            style="display: none"
            type="file"
            v-on:change="handleFileChangeOnCreateNews"
          />
        </label>
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input v-model="addNews.newsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="News Content" :label-width="formLabelWidth">
          <el-input v-model="addNews.NewsContent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Type" :label-width="formLabelWidth">
          <el-select
            v-model="addNews.typeName"
            placeholder="Please select a type"
            style="float: left"
          >
            <el-option
              v-for="item in listtype"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmAdd()">Confirm</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="searchResult ? searchResult : tableData"
      style="width: 100%"
    >
      <el-table-column label="Id" width="260px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" width="260px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Content" :min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.newsContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.typeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Image" prop="image">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleImage(scope.row.image)"
            >Show</el-button
          >
          <el-dialog title="User Image" :visible.sync="imageDialogVisible">
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-dialog title="News Detail" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-row type="flex" class="row-bg" justify="center">
                <el-form-item style="width: 50%">
                  <el-image
                    style="width: 100%"
                    :fit="fit"
                    v-if="form.imageUrl === ''"
                  >
                    <div slot="error" class="image-slot text-center">
                      <i
                        style="font-size: 3rem"
                        class="el-icon-picture-outline"
                      ></i>
                    </div>
                  </el-image>

                  <img style="width: 100%" :src="form.imageUrl" />
                </el-form-item>
              </el-row>
              <label class="file-select" style="margin-left: 80%">
                <!-- We can't use a normal button element here, as it would become the target of the label. -->
                <div class="select-button">
                  <!-- Display the filename if a file has been selected. -->
                  <span
                    v-if="uploadingImage"
                    style="
                      padding: 1rem;
                      color: white;
                      background-color: #2ea169;
                      border-radius: 0.3rem;
                      text-align: center;
                      font-weight: bold;
                    "
                    >Selected image: {{ uploadingImage.name }}</span
                  >
                  <span v-else style="cursor: pointer">Select File</span>
                </div>
                <!-- Now, the file input that we hide. -->
                <input
                  id="Newsimageupload"
                  ref="Newsimageupload"
                  accept="image/png,image/jpeg,image/jpg"
                  style="display: none"
                  type="file"
                  v-on:change="handleFileChange"
                />
              </label>
              <el-form-item label="Title" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="News Content" :label-width="formLabelWidth">
                <el-input
                  v-model="form.NewsContent"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Type" :label-width="formLabelWidth">
                <el-select
                  v-model="form.typeName"
                  placeholder="Please select a type"
                  style="float: left"
                >
                  <el-option
                    v-for="item in listtype"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">Cancel</el-button>
              <el-button
                type="primary"
                @click="confirm(scope.$index, scope.row)"
                >Confirm</el-button
              >
            </span>
          </el-dialog>
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
import * as firebase from "firebase/app";
import "firebase/firebase-storage";
import Request from "../services/RequestBase.js";
import baseConfig from "../config";
const backendIp = baseConfig.backendIp;
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      dialogFormAddVisible: false,
      dialogCommentAddVisible: false,
      imageDialogVisible: false,
      dialogImage: { imageUrl: "" },
      form: {
        typeName: "",
        NewsContent: "",
        imageUrl: "",
        title: "",
      },
      addNews: {
        NewsContent: "",
        typeId: "",
        imageUrl: "",
        imageFile: "",
        newsTitle: "",
      },
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
        `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/GetAllNews`
      )
      .then((rs) => {
        this.tableData = rs.data.data;
      })
      .catch((e) => {
        console.error(e);
        console.log(e);
      });
    axios
      .get(
        `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/NewsType/GetAllNewsType`
      )
      .then((res) => {
        this.listtype = res.data.data;
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
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.editedIndex = this.tableData.indexOf(row);
      this.form.title = row.title;
      this.form.NewsContent = row.newsContent;
      this.form.typeName = row.typeId;
      this.form.imageUrl = row.image;
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
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/UpdateNews/` +
              NewsId,
            {
              id: NewsId,
              title: this.form.title,
              newsContent: this.form.NewsContent,
              image: imageUrl1,
              typeId: this.form.typeName,
            }
          );
          this.tableData[this.editedIndex].title = this.form.title;
          this.tableData[this.editedIndex].newsContent = this.form.NewsContent;
          this.tableData[this.editedIndex].typeId = this.form.typeName;
          this.tableData[this.editedIndex].image = this.form.imageUrl;
        } else {
          await axios.put(
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/UpdateNews/` +
              NewsId,
            {
              image: this.form.imageUrl,
              id: NewsId,
              title: this.form.title,
              newsContent: this.form.NewsContent,
              typeId: this.form.typeName,
            }
          );
          this.tableData[this.editedIndex].image = this.form.imageUrl;
          this.tableData[this.editedIndex].title = this.form.title;
          this.tableData[this.editedIndex].newsContent = this.form.NewsContent;
          this.tableData[this.editedIndex].typeId = this.form.typeId;
        }

        this.$message({
          message: `Update News ${NewsId} successfully`,
          type: "success",
        });
      } catch (e) {
        console.log(e);
        this.$message({
          message: `Fail to update News ${NewsId} `,
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
    async confirmAdd() {
      this.dialogFormAddVisible = false;

      let type = this.addNews.typeName;
      let NewsContent = this.addNews.NewsContent;
      let titleNews = this.addNews.newsTitle;

      try {
        if (this.addNews.imageFile) {
          var ref = firebase
            .storage()
            .refFromURL("gs://mumbi-app-84d15.appspot.com")
            .child(`News/${this.addNews.imageFile.name}`);

          await ref.put(this.addNews.imageFile);
          let imageUrl = await ref.getDownloadURL();

          await axios.post(
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/AddNews`,
            {
              title: titleNews,
              newsContent: NewsContent,
              image: imageUrl,
              typeId: type,
            }
          );
        } else {
          await axios.post(
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/AddNews`,
            {
              title: titleNews,
              newsContent: NewsContent,
              typeId: type,
            }
          );
        }
        this.$message({
          type: "success",
          message: `Create new News successfully!`,
        });
        axios
          .get(
            `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/GetAllNews`
          )
          .then((rs) => {
            this.tableData = rs.data.data;
          })
          .catch((e) => {
            console.error(e);
            console.log(e);
          });
      } catch (e) {
        console.log(e);
        this.$message({
          message: `Fail to create new News`,
        });
      }
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
    handleDelete(index, row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "Warning",
        message: h("p", null, [
          h(
            "span",
            { style: "color: black" },
            "This will permanently delete this news. Are you sure ? "
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
            this.NewsIdDelete = row.id;
            axios
              .put(
                `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/News/DeleteNews/` +
                  this.NewsIdDelete
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
