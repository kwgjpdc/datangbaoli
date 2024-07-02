<template>
  <van-tabbar
    v-model="active"
    :placeholder="true"
    :route="true"
    fixed
    safe-area-inset-bottom
  >
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon"
      :to="item.to"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, reactive } from 'vue';

const active = ref(0);
const tabbarData = reactive([
  {
    icon: 'wap-home-o',
    title: '首页',
    to: {
      name: 'Home'
    }
  },
  {
    icon: 'todo-list-o',
    title: '待办',
    to: {
      name: 'Task'
    }
  },
  {
    icon: 'comment-o',
    title: '消息',
    to: {
      name: 'Message'
    }
  },
  {
    icon: 'user-o',
    title: '我的',
    to: {
      name: 'MyInfo'
    }
  }
]);
</script>

<!-- <style scoped>
.custom-tabbar .van-tabbar {
  border-radius: 20px; /* 设置圆角 */
  overflow: hidden; /* 防止圆角被遮挡 */
}
</style> -->
