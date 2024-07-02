<template>
  <van-form @submit="onSubmit" label-width="30vw">
    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.availableAmount"
      type="number"
      name="可用资金余额"
      label="可用资金余额"
      placeholder="请填写可用资金余额"
      :rules="[{ required: true, message: '请填写可用资金余额' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.todayLendPlanAmount"
      type="number"
      name="今日投放计划"
      label="今日投放计划"
      placeholder="请填写今日投放计划"
      :rules="[{ required: true, message: '今日投放计划' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.overdraftPlanAmount"
      type="number"
      name="法透还款计划"
      label="法透还款计划"
      placeholder="请填写法透还款计划"
      :rules="[{ required: true, message: '请填写法透还款计划' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthLendPlanAmount"
      type="number"
      name="本月计划投放"
      label="本月计划投放"
      placeholder="请填写本月计划投放"
      :rules="[{ required: true, message: '请填本月计划投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthPayPlanAmount"
      type="number"
      name="本月计划回款"
      label="本月计划回款"
      placeholder="请填写本月计划回款"
      :rules="[{ required: true, message: '请填写本月计划回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthLendActualAmount"
      type="number"
      name="本月实际投放"
      label="本月实际投放"
      placeholder="请填写本月实际投放"
      :rules="[{ required: true, message: '请填写本月实际投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthPayActualAmount"
      type="number"
      name="本月实际回款"
      label="本月实际回款"
      placeholder="请填写本月实际回款"
      :rules="[{ required: true, message: '请填写本月实际回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthLendAmount"
      type="number"
      name="本月净投放"
      label="本月净投放"
      placeholder="请填写本月净投放"
      :rules="[{ required: true, message: '请填写本月净投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.monthPayAmount"
      type="number"
      name="本月净回款"
      label="本月净回款"
      placeholder="请填写本月净回款"
      :rules="[{ required: true, message: '请填写本月净回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.nextMonthLendPlanAmount"
      type="number"
      name="下月计划投放"
      label="下月计划投放"
      placeholder="请填写下月计划投放"
      :rules="[{ required: true, message: '请填下月计划投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.nextMonthPayPlanAmount"
      type="number"
      name="下月计划回款"
      label="下月计划回款"
      placeholder="请填写下月计划回款"
      :rules="[{ required: true, message: '请填写下月计划回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekLendPlanAmount"
      type="number"
      name="本周计划投放"
      label="本周计划投放"
      placeholder="请填写本周计划投放"
      :rules="[{ required: true, message: '请填写本周计划投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekPayPlanAmount"
      type="number"
      name="本周计划回款"
      label="本周计划回款"
      placeholder="请填写本周计划回款"
      :rules="[{ required: true, message: '请填写本周计划回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekLendActualAmount"
      type="number"
      name="本周实际投放"
      label="本周实际投放"
      placeholder="请填写本周实际投放"
      :rules="[{ required: true, message: '请填写本周实际投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekPayActualAmount"
      type="number"
      name="本周实际回款"
      label="本周实际回款"
      placeholder="请填写本周实际回款"
      :rules="[{ required: true, message: '请填写本周实际回款' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekLendAmount"
      type="number"
      name="本周净投放"
      label="本周净投放"
      placeholder="请填写本周净投放"
      :rules="[{ required: true, message: '请填写本周净投放' }]"
    />

    <van-field
      required=""
      :readonly="readonly"
      v-model="detailInfo.weekPayAmount"
      type="number"
      name="本周净回款"
      label="本周净回款"
      placeholder="请填写本周净回款"
      :rules="[{ required: true, message: '请填写本周净回款' }]"
    />
    <div class="flex py-[20px] px-[16px] justify-around">
      <van-button class="w-[46%]" plain @click="onReturn">返回</van-button>
      <van-button
        type="primary"
        class="w-[46%]"
        native-type="submit"
        v-if="!readonly"
        >保存</van-button
      >
    </div>
  </van-form>
</template>

<script setup>
import { showSuccessToast } from 'vant';
import { ref, computed } from 'vue';
import { useAppStoreHook } from '@/store/modules/app';
import { useRoute, useRouter } from 'vue-router';
import { addHome, getHomeDetail, updateHome } from '@/api/home';

const detailInfo = ref({});
const route = useRoute();
const router = useRouter();
const useAppStore = useAppStoreHook();

const readonly = computed(() => {
  // 非业务人员不能编辑
  if (useAppStore.isBusiness !== true) {
    return true;
  }
  return false;
});

const initData = () => {
  if (route.query.id && route.query.type === 'detail') {
    getHomeDetail(route.query.id).then(res => {
      detailInfo.value = res.data;
    });
  }
};

initData();

const onSubmit = () => {
  if (route.query.type == 'add') {
    addHome(detailInfo.value).then(() => {
      useAppStore.checkMessageInfo();
      showSuccessToast('保存成功');
      router.push('/home');
    });
  }

  if (route.query.type == 'detail') {
    updateHome(detailInfo.value).then(() => {
      showSuccessToast('保存成功');
      router.push('/home');
    });
  }
};

const onReturn = () => {
  router.go(-1);
};
</script>

<style scoped></style>
