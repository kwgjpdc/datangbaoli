<template>
  <div v-loading="loading" :style="'height:'+ height" class="app-container">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>
<script>
  import {
    getToken
  } from '@/utils/auth'
  import {
    view
  } from '@/api/report/jimu'
  export default {
    name: "UreportView",
    data() {
      return {
        src: "",
        height: document.documentElement.clientHeight - 94.5 + "px;",
        loading: true,
      };
    },
    created() {
      let reportId = this.$route.params && this.$route.params.reportId
      let queryParams = ''
      for(let key in this.$route.query){
        queryParams=queryParams+"&"+key+"="+this.$route.query[key]
      }
      view().then(res => {
        this.src = res +"/"+reportId+ "?token=Bearer " + getToken()+queryParams;
      })
    },

    mounted: function() {
      setTimeout(() => {
        this.loading = false;
      }, 230);
      const that = this;
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 94.5 + "px;";
      };
    }
  };
</script>
