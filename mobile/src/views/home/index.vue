<template>
  <!-- <van-sticky>
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
  </van-sticky> -->
  <div class="py-[12px]">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="bg-[#fff] mx-[12px] rounded-[8px] px-[12px] py-[10px] text-[14px] mb-[12px] shadow-[0_0px_7px_0_rgba(0,0,0,0.1)]"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div @click="handleDetail(item, 'detail')">
          <div class="flex justify-start">
            <div class="flex justify-start items-center pb-[2px]">
              <span class="flex-shrink-0">保理业务金额</span>
              <span class="pl-[5px] font-bold text-[#ee0a0a]">{{
                formatMoney(amount)
              }}</span>
            </div>
          </div>
          <div class="flex justify-start flex-wrap">
            <div class="flex justify-start items-center mr-[12px] py-[2px]">
              <span class="flex-shrink-0">可用资金余额</span>
              <span class="pl-[5px] font-bold">{{ item.availableAmount }}</span>
            </div>
            <div class="flex justify-start items-center py-[2px]">
              <span class="flex-shrink-0">今日投放计划</span>
              <span class="pl-[5px] font-bold">{{
                item.todayLendPlanAmount
              }}</span>
            </div>
          </div>

          <div class="flex justify-start flex-wrap">
            <div class="flex justify-start items-center mr-[12px] py-[2px]">
              <span class="flex-shrink-0">法透还款计划</span>
              <span class="pl-[5px] font-bold">{{
                item.overdraftPlanAmount
              }}</span>
            </div>
            <div class="flex justify-start items-center py-[2px]">
              <span class="flex-shrink-0">本月计划投放</span>
              <span class="pl-[5px] font-bold">{{
                item.monthLendPlanAmount
              }}</span>
            </div>
          </div>

          <div class="flex justify-start flex-wrap">
            <div class="flex justify-start items-center mr-[12px] py-[2px]">
              <span class="flex-shrink-0">本月计划回款</span>
              <span class="pl-[5px] font-bold">{{
                item.monthPayPlanAmount
              }}</span>
            </div>
            <div class="flex justify-start items-center py-[2px]">
              <span class="flex-shrink-0">本月实际投放</span>
              <span class="pl-[5px] font-bold">{{
                item.monthLendActualAmount
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
  <van-floating-bubble
    v-model:offset="offset"
    axis="xy"
    icon="plus"
    @click="handleDetail(null, 'add')"
    :gap="10"
    v-if="checkBusiness && checkMessage"
  />
</template>

<script setup name="Home">
import { ref, computed } from 'vue';
import { getHomeList, getHomeAmount } from '@/api/home';
import { useRouter } from 'vue-router';
import { formatMoney } from '@/utils/tool';
import { useAppStoreHook } from '@/store/modules/app';

const router = useRouter();
//const searchValue = ref("");
const dataList = ref([]);
const loading = ref(false);
const finished = ref(false);
const pageSize = ref(7);
const pageNum = ref(1);
// 保理业务金额
const amount = ref(0);
const offset = ref({ y: 500 });
const useAppStore = useAppStoreHook();

const checkBusiness = computed(() => {
  // 非业务人员不能编辑
  return useAppStore.isBusiness;
});

const checkMessage = computed(() => {
  // 添加过消息,true表示未添加过，false表示添加过
  return useAppStore.isMessage;
});

const onLoad = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
    //name: searchValue.value
  };
  getHomeList(param)
    .then(res => {
      pageNum.value += 1;
      const data = res.rows;
      const total = res.total;
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

const initData = () => {
  getHomeAmount().then(res => {
    if (res.code === 200) {
      amount.value = res.data;
    }
  });
};

initData();

const handleDetail = (row, type) => {
  router.push({
    path: '/homeDetail',
    query: {
      id: row ? row.id : undefined,
      type: type
    }
  });
};

// const onClickSearch = () => {
//   dataList.value = []
//   finished.value = false;
//   pageNum.value = 1;
//   onLoad();
// }
</script>
<style lang="less">
.search-text {
  color: var(--van-primary-color);
}
</style>
