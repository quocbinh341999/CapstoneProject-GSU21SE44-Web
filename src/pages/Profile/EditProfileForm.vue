<template>
  <card>
    <h5 slot="header" class="title">Profile</h5>
    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="Project" placeholder="Mumbi" disabled id="testColor"> </base-input>
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
      <div class="col-md-12 pr-md-1">
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
    <!-- <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input label="City"
                  v-model="model.city"
                  placeholder="City">
        </base-input>
      </div>
      <div class="col-md-4 px-md-1">
        <base-input label="Country"
                  v-model="model.country"
                  placeholder="Country">
        </base-input>
      </div>
      <div class="col-md-4 pl-md-1">
        <base-input label="Postal Code"
                  placeholder="ZIP Code">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <base-input>
          <label>About Me</label>
          <textarea rows="4" cols="80"
                    class="form-control"
                    placeholder="Here can be your description"
                    v-model="model.about">

              </textarea>
        </base-input>
      </div>
    </div> -->
    <!-- <base-button slot="footer" type="primary" @click="editProfile">Chỉnh sửa hồ sơ</base-button> -->
  </card>
</template>
<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
<style>
#testColor{
  color: black;
  background-color: white;
}
</style>
