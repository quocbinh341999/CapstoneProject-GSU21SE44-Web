<template>
  <div>
    <h1 style="color: #363636">NHẬT KÝ CHI TIẾT</h1>
    <div style="width: 100%; height: 100%">
        <div>{{ tableData.diaryContent }}</div>
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
    let idNews = localStorage.getItem("ChildId");
    axios
      .get(
        `https://service.mumbi.xyz/api/Diaries/GetDiaryOfChildren/` +
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