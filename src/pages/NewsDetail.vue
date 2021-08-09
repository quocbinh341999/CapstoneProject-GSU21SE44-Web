<template>
  <div>
    <h1 style="color: #363636;">TIN TỨC CHI TIẾT</h1>
    <div style="width: 100%; height: 100%; background-color:#f6f8fd">
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
        <div v-html="tableData.newsContent"></div>
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
    let idNews = localStorage.getItem("NewsId");
    axios
      .get(
        `https://service.mumbi.xyz/api/News/GetNewsBy/` +
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
  margin-left: 15px;
}
strong{
  margin-left: 15px;
}
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
figcaption {
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>