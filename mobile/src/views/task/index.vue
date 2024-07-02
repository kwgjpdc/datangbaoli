<template>
  <van-sticky>
    <van-search
      v-model="searchValue"
      show-action
      shape="round"
      placeholder="搜索名称"
    >
      <template #action>
        <div @click="onClickSearch" class="search-text">搜索</div>
      </template>
    </van-search>
  </van-sticky>
  <div class="pb-[12px]">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="bg-[#fff] mx-[12px] rounded-[8px] px-[12px] py-[10px] text-[14px] mt-[12px] shadow-[0_0px_7px_0_rgba(0,0,0,0.1)]"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div @click="handleDetail(item)">
          <div class="flex justify-between items-center cursor-pointer">
            <div class="font-bold text-[16px]">{{ item.procDefName }}</div>
          </div>
          <div
            class="bg-[#f3f9ff] px-[2px] py-[2px] my-[5px] flex justify-start items-center"
          >
            <svg-icon name="date" class="text-[16px]" />
            <span class="ml-[6px]">{{ item.createTime }}</span>
          </div>
          <div class="flex justify-start my-[5px]">
            <div class="flex justify-start items-center">
              <span class="">任务编号</span>
              <span class="text-[#666] pl-[5px]">{{ item.taskId }}</span>
            </div>
            <div class="flex justify-start items-center ml-[20px]">
              <span class="mr-[5px]">流程版本</span>
              <van-tag type="primary">v{{ item.procDefVersion }}</van-tag>
            </div>
          </div>

          <div class="flex justify-start my-[5px]">
            <div class="flex justify-start items-center">
              <span class="">流程发起人</span>
              <span class="text-[#666] pl-[5px]">
                {{ item.startUserName }}
                <van-tag>{{ item.startDeptName }}</van-tag>
              </span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup name="Task">
import { ref } from 'vue';
// import { showFailToast, showSuccessToast } from "vant";
// import "vant/es/toast/style";
import { getTodoList } from '@/api/flowable/todo.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchValue = ref('');
const checked = ref('');
const dataList = ref([]);
const loading = ref(false);
const finished = ref(false);
const pageSize = ref(7);
const pageNum = ref(1);

const onLoad = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    name: searchValue.value
  };
  getTodoList(param)
    .then(res => {
      pageNum.value += 1;
      const data = res.data.records;
      const total = res.data.total;
      if (data && data.length > 0) {
        data.forEach(item => {
          dataList.value.push(item);
        });
      }

      loading.value = false;
      if (dataList.value.length >= total) {
        finished.value = true;
      }
    }).catch(() => {
      finished.value = true
    });
};

const handleDetail = row => {
  router.push({
    path: '/taskDetail',
    query: {
      procInsId: row.procInsId,
      executionId: row.executionId,
      deployId: row.deployId,
      taskId: row.taskId,
      taskName: row.taskName,
      startUser: row.startUserName + '-' + row.startDeptName
    }
  });
};

const onClickSearch = () => {
  dataList.value = [];
  finished.value = false;
  pageNum.value = 1;
  onLoad();
};
</script>
<style lang="less">
.search-text {
  color: var(--van-primary-color);
}
</style>
