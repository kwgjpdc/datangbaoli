<template>
  <div v-loading="loading" :style="'height:'+ height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>
<script>
  import {
    getToken
  } from '@/utils/auth'
  import {
    indexUrl
  } from '@/api/report/jimu'
  export default {
    name: "Ureport",
    data() {
      return {
        src: "",
        height: document.documentElement.clientHeight - 94.5 + "px;",
        loading: true,
      };
    },
    created() {
      indexUrl().then(res => {
        this.src = res + "?token=Bearer " + getToken();
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
