<template>
  <div>
    <h1 style="color: #909399">QUẢN LÝ TIN TỨC</h1>
    <el-button
      type="primary"
      @click="addNewNews()"
      style="margin-bottom: 15px; color: white; background-color: #67c23a"
      plain
      >Thêm tin mới</el-button
    >
    <el-button
      type="primary"
      @click="dialogFormAddVisible1 = true"
      style="margin-bottom: 15px; color: white; background-color: #67c23a"
      plain
      >Quản lý loại tin tức</el-button
    >
    <el-dialog
      title="LOẠI TIN TỨC"
      :visible.sync="dialogFormAddVisible1"
      :lock-scroll="true"
    >
      <label :label-width="formLabelWidth" style="margin-left: 3px"
        >Loại tin tức</label
      >
      <el-input
        v-model="typeNews"
        autocomplete="off"
        style="width: 70%; margin-left: 10px"
      ></el-input>
      <el-button type="success" style="margin-left: 10px" @click="addType">
        Thêm
      </el-button>
      <el-table :data="tableData1" style="width: 70%; margin-left: 15%">
        <el-table-column label="STT" type="index" width="60"> </el-table-column>
        <el-table-column label="Loại tin tức" width="240">
          <template slot-scope="scope">
            <!-- <el-input
              v-model="scope.row.type"
              :disabled="!scope.row.edited"
            ></el-input> -->
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit1(scope.$index, scope.row)"
              >Chỉnh sửa</el-button
            >
            <el-dialog
              :visible.sync="dialogFormVisible1"
              :lock-scroll="true"
              width="60%"
              append-to-body
            >
              <el-form
                :model="form1"
                :rules="rulesForm1"
                ref="form1"
                class="demo-ruleForm"
              >
                <el-form-item
                  label="Loại tin tức"
                  :label-width="formLabelWidth"
                  prop="typeNews"
                >
                  <el-input
                    v-model="form1.typeNews"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false"
                  >Hủy bỏ</el-button
                >
                <el-button
                  type="primary"
                  @click="confirm1(scope.$index, scope.row, 'form1')"
                  >Xác nhận</el-button
                >
              </span>
            </el-dialog>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete1(scope.$index, scope.row)"
              style="margin-left: 10px"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="Thêm tin mới"
      :visible.sync="dialogFormAddVisible"
      :lock-scroll="true"
      width="80%"
    >
      <el-form
        :model="addNews"
        status-icon
        :rules="rules"
        ref="addNews"
        class="demo-ruleForm"
      >
        <el-row type="flex" class="row-bg" justify="center">
          <el-form-item style="width: 50%" prop="imageUrl">
            <el-image style="width: 100%" v-if="addNews.imageUrl === ''">
              <div slot="error" class="image-slot text-center">
                <i style="font-size: 3rem" class="el-icon-picture-outline"></i>
              </div>
            </el-image>

            <img :src="addNews.imageUrl" />
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
            <span v-else style="cursor: pointer">Chọn File</span>
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
        <el-form-item
          label="Tiêu đề"
          :label-width="formLabelWidth"
          prop="newsTitle"
        >
          <el-input v-model="addNews.newsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="Nội dung"
          :label-width="formLabelWidth"
          prop="NewsContent"
        >
          <mumbi-editor v-model="addNews.NewsContent"></mumbi-editor>
        </el-form-item>
        <el-form-item
          label="Thời gian đọc (phút)"
          :label-width="formLabelWidth"
          prop="estimateTime"
        >
          <el-input v-model.number="addNews.estimateTime"></el-input>
        </el-form-item>
        <el-form-item
          label="Loại tin tức"
          :label-width="formLabelWidth"
          prop="typeName"
        >
          <el-select
            v-model="addNews.typeName"
            placeholder="Vui lòng lựa chọn loại tin tức"
            style="float: left"
            :min-width="180"
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
        <el-button @click="cancel('addNews')">Hủy bỏ</el-button>
        <el-button type="primary" @click="confirmAdd('addNews')"
          >Xác nhận</el-button
        >
      </span>
    </el-dialog>
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
      <el-table-column label="Tiêu đề" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Loại tin tức" :min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thời gian đọc (phút)" :min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.estimatedFinishTime }}</span>
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >Chỉnh sửa</el-button
          >
          <el-dialog
            :visible.sync="dialogFormVisible"
            :lock-scroll="true"
            width="60%"
          >
            <el-form
              :model="form"
              :rules="rulesForm"
              ref="form"
              class="demo-ruleForm"
            >
              <el-row type="flex" class="row-bg" justify="center">
                <el-form-item style="width: 50%">
                  <el-image style="width: 100%" v-if="form.imageUrl === ''">
                    <div slot="error" class="image-slot text-center">
                      <i
                        style="font-size: 3rem"
                        class="el-icon-picture-outline"
                      ></i>
                    </div>
                  </el-image>

                  <img :src="form.imageUrl" />
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
                  <span v-else style="cursor: pointer">Chọn File</span>
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
              <el-form-item label="Tiêu đề" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" :label-width="formLabelWidth">
                <!-- <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="form.NewsContent"
                >
                </el-input> -->
                <!-- <ckeditor v-model="form.NewsContent" :config="editorConfig"></ckeditor> -->
                <mumbi-editor v-model="form.NewsContent"></mumbi-editor>
              </el-form-item>
              <el-form-item
                label="Thời gian đọc (phút)"
                :label-width="formLabelWidth"
                prop="estimateTime1"
              >
                <el-input
                  v-model.number="form.estimateTime1"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Loại tin tức" :label-width="formLabelWidth">
                <el-select
                  v-model="form.typeName"
                  placeholder="Vui lòng lựa chọn loại tin tức"
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
              <el-button @click="dialogFormVisible = false">Hủy bỏ</el-button>
              <el-button
                type="primary"
                @click="confirm(scope.$index, scope.row, 'form')"
                >Xác nhận</el-button
              >
            </span>
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
import * as firebase from "firebase/app";
import "firebase/firebase-storage";
import Request from "../services/RequestBase.js";
import baseConfig from "../config";
import CkEditor from "../components/Inputs/CkEditor.vue";
const backendIp = baseConfig.backendIp;
export default {
  components: {
    "mumbi-editor": CkEditor,
  },
  data() {
    var checkTime = (rule, value, callback) => {
      if (!value) {
        return callback(
          new Error("Vui lòng nhập thời gian để đọc hết tin tức !")
        );
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Thời gian đọc hết tin tức phải là một số !"));
        } else {
          if (value < 0) {
            callback(new Error("Thời gian đọc hết tin tức phải lớn hơn 0 !"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var checkTitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng nhập tiêu đề !"));
      } else {
        callback();
      }
    };
    var checkContent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng nhập nội dung !"));
      } else {
        callback();
      }
    };
    var checkImg = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng chọn hình ảnh !"));
      } else {
        callback();
      }
    };
    var checkType = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng chọn loại tin tức !"));
      } else {
        callback();
      }
    };
    var checkTypeNews = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng nhập loại tin tức !"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        estimateTime: [{ validator: checkTime, trigger: "blur" }],
        NewsContent: [{ validator: checkContent, trigger: "blur" }],
        newsTitle: [{ validator: checkTitle, trigger: "blur" }],
        imageUrl: [{ validator: checkImg, trigger: "blur" }],
        typeName: [{ validator: checkType, trigger: "blur" }],
      },
      rulesForm: {
        estimateTime1: [{ validator: checkTime, trigger: "blur" }],
      },
      rulesForm1: {
        typeNews: [{ validator: checkTypeNews, trigger: "blur" }],
      },
      typeNews: "",
      tableData: [],
      tableData1: [],
      dialogFormVisible: false,
      dialogFormAddVisible: false,
      dialogCommentAddVisible: false,
      imageDialogVisible: false,
      dialogFormVisible1: false,
      dialogFormAddVisible1: false,
      form1: {
        typeNews: "",
      },
      dialogImage: { imageUrl: "" },
      form: {
        typeName: "",
        NewsContent: "",
        imageUrl: "",
        title: "",
        estimateTime1: "",
      },
      addNews: {
        NewsContent: "",
        typeId: "",
        imageUrl: "",
        imageFile: "",
        newsTitle: "",
        estimateTime: "",
        typeName: "",
      },
      uploadingImage: "",
      formLabelWidth: "130px",
      formLabelWidth1: "180px",
      search: "",
      editedIndex: -1,
      NewsIdDelete: "",
      listtype: [],
      pagination: [],
      totalPages: 0,
      searchResult: null,
      rsPage: 0,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
  created: function () {
    axios
      .get(`https://service.mumbi.xyz/api/News/GetAllNews`)
      .then((rs) => {
        this.tableData = rs.data.data;
      })
      .catch((e) => {
        console.error(e);
        console.log(e);
      });
    axios
      .get(`https://service.mumbi.xyz/api/NewsType/GetAllNewsType`)
      .then((res) => {
        this.listtype = res.data.data;
        this.tableData1 = res.data.data;
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
      this.form.imageUrl = row.imageURL;
      this.form.estimateTime1 = row.estimatedFinishTime;
    },
    handleEdit1(index, row) {
      this.dialogFormVisible1 = true;
      this.editedIndex = this.tableData1.indexOf(row);
      this.form1.typeNews = row.type;
    },
    async confirm1(index, row, formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible1 = false;
          let NewsId = this.tableData1[this.editedIndex].id;
          try {
            await axios.put(
              `https://service.mumbi.xyz/api/NewsType/UpdateNewsType/` + NewsId,
              {
                id: NewsId,
                type: this.form1.typeNews,
              }
            );
            await axios
              .get(`https://service.mumbi.xyz/api/NewsType/GetAllNewsType`)
              .then((rs) => {
                this.tableData1 = rs.data.data;
              })
              .catch((e) => {
                console.error(e);
                console.log(e);
              });
            await axios
              .get(`https://service.mumbi.xyz/api/News/GetAllNews`)
              .then((rs) => {
                this.tableData = rs.data.data;
              })
              .catch((e) => {
                console.error(e);
                console.log(e);
              });
            this.$message({
              message: `Cập nhật loại tin tức thành công !`,
              type: "success",
            });
          } catch (e) {
            console.log(e);
            this.$message({
              message: `Cập nhật loại tin tức không thành công ! `,
            });
          }
        }
      });
    },
    async confirm(index, row, formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
                `https://service.mumbi.xyz/api/News/UpdateNews/` + NewsId,
                {
                  id: NewsId,
                  title: this.form.title,
                  newsContent: this.form.NewsContent,
                  imageURL: imageUrl1,
                  typeId: this.form.typeName,
                  estimatedFinishTime: this.form.estimateTime1,
                  lastModifiedBy: userInfo.id,
                }
              );
              await axios
                .get(`https://service.mumbi.xyz/api/News/GetAllNews`)
                .then((rs) => {
                  this.tableData = rs.data.data;
                })
                .catch((e) => {
                  console.error(e);
                  console.log(e);
                });
            } else {
              await axios.put(
                `https://service.mumbi.xyz/api/News/UpdateNews/` + NewsId,
                {
                  imageURL: this.form.imageUrl,
                  id: NewsId,
                  title: this.form.title,
                  newsContent: this.form.NewsContent,
                  typeId: this.form.typeName,
                  estimatedFinishTime: this.form.estimateTime1,
                  lastModifiedBy: userInfo.id,
                }
              );
              await axios
                .get(`https://service.mumbi.xyz/api/News/GetAllNews`)
                .then((rs) => {
                  this.tableData = rs.data.data;
                })
                .catch((e) => {
                  console.error(e);
                  console.log(e);
                });
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
        }
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
    async confirmAdd(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          this.dialogFormAddVisible = false;
          let type = this.addNews.typeName;
          let NewsContent = this.addNews.NewsContent;
          let titleNews = this.addNews.newsTitle;
          let time = this.addNews.estimateTime;
          try {
            if (this.addNews.imageFile) {
              var ref = firebase
                .storage()
                .refFromURL("gs://mumbi-app-84d15.appspot.com")
                .child(`News/${this.addNews.imageFile.name}`);

              await ref.put(this.addNews.imageFile);
              let imageUrl = await ref.getDownloadURL();

              await axios.post(`https://service.mumbi.xyz/api/News/AddNews`, {
                title: titleNews,
                newsContent: NewsContent,
                imageURL: imageUrl,
                typeId: type,
                estimatedFinishTime: time,
                createdBy: userInfo.id,
              });
            } else {
              await axios.post(`https://service.mumbi.xyz/api/News/AddNews`, {
                title: titleNews,
                newsContent: NewsContent,
                typeId: type,
                estimatedFinishTime: time,
                createdBy: userInfo.id,
              });
            }
            this.$message({
              type: "success",
              message: `Tạo tin tức thành công !`,
            });
            await axios
              .get(`https://service.mumbi.xyz/api/News/GetAllNews`)
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
              message: `Tạo tin tức không thành công !`,
            });
          }
        }
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
            instance.confirmButtonText = "Đang chờ...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
            this.NewsIdDelete = row.id;
            axios
              .put(
                `https://service.mumbi.xyz/api/News/DeleteNews/` +
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
          message: "Xóa thành công !",
        });
      });
    },
    handleDelete1(index, row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "Warning",
        message: h("p", null, [
          h(
            "span",
            { style: "color: black" },
            "Những tin tức có loại này sẽ bị xóa. Bạn có chắc chắn muốn xóa ? "
          ),
        ]),
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy bỏ",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "Đang chờ...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
            this.NewsIdDelete = row.id;
            axios
              .put(
                `https://service.mumbi.xyz/api/NewsType/DeleteNewsType/` +
                  this.NewsIdDelete
              )
              .then((response) => {
                setTimeout(async () => {
                  await axios
                    .get(
                      `https://service.mumbi.xyz/api/NewsType/GetAllNewsType`
                    )
                    .then((rs) => {
                      this.tableData1 = rs.data.data;
                    })
                    .catch((e) => {
                      console.error(e);
                      console.log(e);
                    });
                  setTimeout(() => {
                    instance.confirmButtonLoading = false;
                  }, 300);
                }, 3000);
              });
          } else {
            done();
          }
        },
      }).then((action) => {
        this.$message({
          type: "success",
          message: "Xóa thành công !",
        });
      });
    },
    viewDetail(index, row) {
      localStorage.setItem("NewsId", row.id);
      this.$router.push({
        name: "TIN TỨC CHI TIẾT",
      });
    },
    async onSearchInput(e) {
      if (this.search === "") {
        this.rsPage = 1;
      } else {
        this.rsPage = 0;
      }
      try {
        let result = await axios.get(`https://service.mumbi.xyz/api/News/GetNews?SearchValue=${e}`);
        console.log(result);
        this.searchResult = result.data.data;
      } catch (error) {
        this.searchResult = null;
        console.log(error);
      }
    },
    async addType() {
      if (this.typeNews === "") {
        this.$message({
          message: `Vui lòng nhập loại tin tức !`,
          type: "warning",
        });
      } else {
        await axios.post(backendIp + `/api/NewsType/AddNewsType`, {
          type: this.typeNews,
        });
        this.$message({
          message: `Tạo loại tin tức mới thành công !`,
          type: "success",
        });
        await axios
          .get(backendIp + `/api/NewsType/GetAllNewsType`)
          .then((rs) => {
            this.tableData1 = rs.data.data;
          })
          .catch((e) => {
            console.error(e);
            console.log(e);
          });
        this.typeNews = "";
      }
    },
    addNewNews() {
      this.dialogFormAddVisible = true;
      axios
        .get(`https://service.mumbi.xyz/api/NewsType/GetAllNewsType`)
        .then((res) => {
          this.listtype = res.data.data;
          this.tableData1 = res.data.data;
        })
        .catch((e) => {
          console.error(e);
          console.log(e);
        });
      (this.addNews.NewsContent = ""),
        (this.addNews.typeId = ""),
        (this.addNews.imageUrl = ""),
        (this.addNews.imageFile = ""),
        (this.addNews.newsTitle = ""),
        (this.addNews.estimateTime = ""),
        (this.addNews.typeName = "");
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormAddVisible = false;
    },
  },
};
</script>
<style>
p {
  color: black;
}
.el-table td {
  text-align: center;
}
.el-table th {
  text-align: center;
}
span {
  word-wrap: normal;
  word-break: normal;
}
.ck-content {
  word-wrap: normal;
  word-break: normal;
}
</style>