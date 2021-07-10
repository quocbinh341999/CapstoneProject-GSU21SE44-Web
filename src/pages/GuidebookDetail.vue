<template>
  <div>
    <h1 style="color: #363636">CẨM NANG CHI TIẾT</h1>
    <div style="width: 100%; height: 100%">
      <div
        style="
          text-align: center;
          font-size: 27px;
          color: #363636;
          font-weight: bold;
        "
      >
        {{ tableData.title }}
      </div>
      <div>
        <div v-html="tableData.guidebookContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  computed: {},
  created: function () {
    let idNews = localStorage.getItem("GuidebookId");
    axios
      .get(
        `http://mumbicapstone-dev.ap-southeast-1.elasticbeanstalk.com/api/Guidebooks/GetGuidebookBy/` +
          idNews
      )
      .then((rs) => {
        this.tableData = rs.data.data;
      })
      .catch((e) => {
        console.error(e);
        console.log(e);
      });
  },
};
</script>
<style>
p {
  color: #363636;
}
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}
figcaption {
  text-align: center;
}
</style>