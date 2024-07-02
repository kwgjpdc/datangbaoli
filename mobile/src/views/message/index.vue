<template>
  <div class="home-content pb-[12px]">
    <div
      class="px-[12px] py-[10px]"
      @click="toAddHome()"
      v-if="checkBusiness && checkMessage"
    >
      <div class="flex justify-start items-center">
        <div>
          <van-icon size="8vw" name="guide-o" />
        </div>
        <div class="ml-[16px] flex-1 flex justify-between items-center">
          <div class="">
            <div class="text-[14px] h-[20px]">提醒</div>
            <div class="text-description text-[14px]">
              今天未填写统计，请及时填写
            </div>
          </div>
          <div>
            <van-icon name="arrow" size="18" />
          </div>
        </div>
      </div>
      <div class="h-[1px] bg-bgColor"></div>
    </div>
    <van-list
      v-else
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="bg-[#fff] rounded text-sm"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="px-[12px] py-[10px]" @click="handleDetail(item)">
          <div class="flex justify-start items-center">
            <div>
              <van-icon size="8vw" name="guide-o" />
            </div>
            <div class="ml-[16px] flex-1 flex justify-between items-center">
              <div class="">
                <div class="text-[14px] h-[20px]">待办任务</div>
                <div class="text-description text-[14px]">
                  {{
                    item.procDefName + '：' + '流程发起人' + item.startUserName
                  }}
                </div>
              </div>
              <div>
                <van-icon name="arrow" size="18" />
              </div>
            </div>
          </div>
        </div>
        <div class="h-[1px] bg-bgColor"></div>
      </div>
    </van-list>
  </div>
</template>

<script setup name="Message">
import { ref, computed } from 'vue';
import { getTodoList } from '@/api/flowable/todo.js';
import { useRouter } from 'vue-router';
import { useAppStoreHook } from '@/store/modules/app';
const useAppStore = useAppStoreHook();

const dataList = ref([]);
const router = useRouter();
const loading = ref(false);
const finished = ref(false);
const pageSize = ref(7);
const pageNum = ref(1);

const checkMessage = computed(() => {
  return useAppStore.isMessage;
});

const checkBusiness = computed(() => {
  return useAppStore.isBusiness;
});

const onLoad = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
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

const toAddHome = () => {
  router.push({
    path: '/homeDetail',
    query: {
      type: 'add'
    }
  });
};
</script>
