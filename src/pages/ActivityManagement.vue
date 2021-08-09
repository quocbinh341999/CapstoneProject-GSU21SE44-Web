<template>
  <div>
    <h1 style="color: #909399">QUẢN LÝ HOẠT ĐỘNG</h1>
    <el-button
      type="primary"
      @click="addNewActivity()"
      style="margin-bottom: 15px; color: white; background-color: #67c23a"
      plain
      >Thêm hoạt động mới</el-button
    >
    <el-dialog
      title="Thêm hoạt động mới"
      :visible.sync="dialogFormAddVisible"
      :lock-scroll="true"
      width="40%"
    >
      <el-form
        :model="addNews"
        status-icon
        :rules="rules"
        ref="addNews"
        class="demo-ruleForm"
      >
        <el-form-item
          label="Tên hoạt động"
          :label-width="formLabelWidth"
          prop="newsTitle"
        >
          <el-input v-model="addNews.newsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="Độ tuổi (tuần tuổi)"
          :label-width="formLabelWidth"
          prop="suitableAge"
        >
          <el-input v-model.number="addNews.suitableAge"></el-input>
        </el-form-item>
        <el-form-item
          label="Loại hoạt động"
          :label-width="formLabelWidth"
          prop="typeName"
        >
          <el-select
            v-model="addNews.typeName"
            placeholder="Vui lòng lựa chọn loại hoạt động"
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
        <el-form-item
          label="File âm thanh"
          :label-width="formLabelWidth"
          prop="imageUrl"
        >
          <el-row type="flex" class="row-bg" justify="left">
            <el-form-item v-if="addNews.imageUrl != ''">
              <!-- <el-image style="width: 100%" v-if="form.imageUrl === ''">
                      <div slot="error" class="image-slot text-center">
                        <i
                          style="font-size: 3rem"
                          class="el-icon-picture-outline"
                        ></i>
                      </div>
                    </el-image> -->
              <audio controls>
                <source :src="addNews.imageUrl" type="audio/mpeg" />
              </audio>
            </el-form-item>
          </el-row>
          <label class="file-select" style="margin-left: 0px">
            <!-- We can't use a normal button element here, as it would become the target of the label. -->
            <div class="select-button">
              <!-- Display the filename if a file has been selected. -->
              
              <div style="cursor: pointer; text-align: center; border: 2px solid #67c23a;
  border-radius: 5px; background-color: #67c23a; color: white; width: 120px"> Chọn File</div>
              
            </div>
            <!-- Now, the file input that we hide. -->
            <input
              id="createNewsimageupload"
              ref="createNewsimageupload"
              accept="audio/*"
              style="display: none"
              type="file"
              v-on:change="handleFileChangeOnCreateNews"
            />
          </label>
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
      <el-table-column label="Tên hoạt động" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Loại hoạt động" :min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Độ tuổi (tuần tuổi)" :min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.suitableAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="File" :min-width="200">
        <template slot-scope="scope">
          <audio controls>
            <source :src="scope.row.mediaFileURL" type="audio/ogg" />
            <source :src="scope.row.mediaFileURL" type="audio/mpeg" />
          </audio>
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
            >Chỉnh sửa</el-button
          >
          <el-dialog
            :visible.sync="dialogFormVisible"
            :lock-scroll="true"
            width="40%"
          >
            <el-form
              :model="form"
              :rules="rulesForm"
              ref="form"
              class="demo-ruleForm"
            >
              <el-form-item label="Tên hoạt động" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="Độ tuổi (tuần tuổi)"
                :label-width="formLabelWidth"
                prop="suitableAge1"
              >
                <el-input
                  v-model.number="form.suitableAge1"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="Loại hoạt động"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="form.typeName"
                  placeholder="Vui lòng lựa chọn loại hoạt động"
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
              <el-form-item label="File âm thanh" :label-width="formLabelWidth">
                <el-row type="flex" class="row-bg" justify="left">
                  <el-form-item v-if="form.uploadFile != ''">
                    <audio controls>
                      <source :src="form.uploadFile" type="audio/ogg" />
                      <source :src="form.uploadFile" type="audio/mpeg" />
                    </audio>
                  </el-form-item>
                </el-row>
                <label class="file-select" justify="left" style="float: left">
                  <!-- We can't use a normal button element here, as it would become the target of the label. -->
                  <span v-if="form.newName"><strong>File mới được upload:</strong> {{ form.newName }}</span>
                    <span v-else><strong>Tên file cũ:</strong> {{ form.formName }}</span>
                  <div class="select-button">
                    <div style="cursor: pointer; text-align: center; border: 2px solid #67c23a;
  border-radius: 5px; background-color: #67c23a; color: white; width: 120px"> Chọn File khác</div>
                  </div>
                  <!-- Now, the file input that we hide. -->
                  <input
                    id="Newsimageupload"
                    ref="Newsimageupload"
                    accept="audio/*"
                    style="display: none"
                    type="file"
                    v-on:change="handleFileChange"
                  />
                </label>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel('form')">Hủy bỏ</el-button>
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
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Vui lòng nhập độ tuổi !"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Độ tuổi phải là một số !"));
        } else {
          if (value < 0) {
            callback(new Error("Độ tuổi phải lớn hơn 0 !"));
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
        callback(new Error("Vui lòng chọn file audio !"));
      } else {
        callback();
      }
    };
    var checkType = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Vui lòng chọn loại hoạt động !"));
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
        suitableAge: [{ validator: checkType, trigger: "blur" }],
      },
      rulesForm: {
        suitableAge1: [{ validator: checkTime, trigger: "blur" }],
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
        suitableAge1: "",
        formName: "",
        uploadFile: "",
        newName: "",
        image1: ""
      },
      addNews: {
        NewsContent: "",
        typeId: "",
        imageUrl: "",
        imageFile: "",
        newsTitle: "",
        typeName: "",
        suitableAge: "",
      },
      uploadingImage: "",
      formLabelWidth: "120px",
      formLabelWidth1: "180px",
      search: "",
      editedIndex: -1,
      NewsIdDelete: "",
      listtype: [
        {
          id: 1,
          type: "Nghe nhạc",
        },
        {
          id: 2,
          type: "Đọc thơ",
        },
        {
          id: 3,
          type: "Kể chuyện",
        },
      ],
      pagination: [],
      totalPages: 0,
      searchResult: null,
      rsPage: 0,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      },
      uploadFile: "",
    };
  },
  created: function () {
    axios
      .get(`https://service.mumbi.xyz/api/Activity/GetAllActivity`)
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
    async handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.editedIndex = this.tableData.indexOf(row);
      this.form.title = row.activityName;
      this.form.suitableAge1 = row.suitableAge;
      this.form.typeName = row.typeId;
      this.form.image1 = row.mediaFileURL;
      this.form.formName = row.activityName;
    },
    async confirm(index, row, formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let NewsId = this.tableData[this.editedIndex].id;
          try {
            if (this.form.imageFile) {
              var ref = firebase
                .storage()
                .refFromURL("gs://mumbi-app-84d15.appspot.com")
                .child(`Activity/${this.form.imageFile.name}`);

              await ref.put(this.form.imageFile);
              let imageUrl1 = await ref.getDownloadURL();
              await axios.put(
                `https://service.mumbi.xyz/api/Activity/UpdateActivity/` +
                  NewsId,
                {
                  id: NewsId,
                  activityName: this.form.title,
                  suitableAge: this.form.suitableAge1,
                  typeId: this.form.typeName,
                  mediaFileURL: imageUrl1,
                }
              );
              await axios
                .get(`https://service.mumbi.xyz/api/Activity/GetAllActivity`)
                .then((rs) => {
                  this.tableData = rs.data.data;
                })
                .catch((e) => {
                  console.error(e);
                  console.log(e);
                });
            } else {
              await axios.put(
                `https://service.mumbi.xyz/api/Activity/UpdateActivity/` +
                  NewsId,
                {
                  id: NewsId,
                  activityName: this.form.title,
                  suitableAge: this.form.suitableAge1,
                  typeId: this.form.typeName,
                  mediaFileURL: this.form.image1,
                }
              );
              await axios
                .get(`https://service.mumbi.xyz/api/Activity/GetAllActivity`)
                .then((rs) => {
                  this.tableData = rs.data.data;
                })
                .catch((e) => {
                  console.error(e);
                  console.log(e);
                });
            }

            this.$message({
              message: `Cập nhật hoạt động thành công !`,
              type: "success",
            });
            location.reload();
          } catch (e) {
            console.log(e);
            this.$message({
              message: `Cập nhật hoạt động không thành công ! `,
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
          this.dialogFormAddVisible = false;
          let type = this.addNews.typeName;
          let titleNews = this.addNews.newsTitle;
          let age = this.addNews.suitableAge;
          try {
            var ref = firebase
              .storage()
              .refFromURL("gs://mumbi-app-84d15.appspot.com")
              .child(`Activity/${this.addNews.imageFile.name}`);

            await ref.put(this.addNews.imageFile);
            let imageUrl = await ref.getDownloadURL();

            await axios.post(
              `https://service.mumbi.xyz/api/Activity/AddActivity`,
              {
                activityName: titleNews,
                suitableAge: age,
                typeId: type,
                mediaFileURL: imageUrl,
              }
            );
            this.$message({
              type: "success",
              message: `Tạo hoạt động thành công !`,
            });
            await axios
              .get(`https://service.mumbi.xyz/api/Activity/GetAllActivity`)
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
              message: `Tạo hoạt động không thành công !`,
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
      let fileName = this.form.imageFile.name.trim()
      this.form.formName = fileName
      // var ref = firebase
      //   .storage()
      //   .refFromURL("gs://mumbi-app-84d15.appspot.com")
      //   .child(`Actitvity/${this.form.imageFile.name}`);

      // await ref.put(this.form.imageFile);
      // // this.form.imageUrl = await ref.getDownloadURL()
      this.form.uploadFile = this.form.imageUrl
      this.form.imageUrl = ''
      this.form.newName = fileName
      this.form.formName = ''
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
    async createImage(file) {
      // var image = new Image();
      var audio = new Audio();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.audio = e.target.result;
      };
      reader.readAsDataURL(file);
      var ref = firebase
        .storage()
        .refFromURL("gs://mumbi-app-84d15.appspot.com")
        .child(`Actitvity/${uploadFile}`);

      await ref.put(this.uploadFile);
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
                `https://service.mumbi.xyz/api/Activity/DeleteActivity/` +
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
    addNewActivity() {
      this.dialogFormAddVisible = true;
      this.addNews.typeName = "";
      this.addNews.newsTitle = "";
      this.addNews.suitableAge = "";
      this.addNews.imageUrl = "";
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormAddVisible = false;
      this.dialogFormVisible = false;
      this.form.imageUrl = ''
      this.form.uploadFile = ''
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
</style>