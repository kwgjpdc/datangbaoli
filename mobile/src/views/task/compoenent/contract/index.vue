<template>
  <!-- 合同审核 -->
  <van-tabs v-model:active="active">
    <van-tab title="基本信息" name="1" title-class="text-[16px]">
      <TaskForm :config="configList" v-model="data"></TaskForm>
    </van-tab>
    <van-tab title="客户信息" name="2">
      <TaskForm :config="customerList" v-model="data"></TaskForm>
    </van-tab>
  </van-tabs>
</template>

<script setup name="fundPool">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getContract } from '@/api/flowable/todo.js';
import { useConfigList } from './contract';
import { useCustomerList } from './customer.js';

const props = defineProps({
  id: {
    type: Number || String,
    default: ''
  }
});

const active = ref('1');
const { configList } = useConfigList();
const { customerList } = useCustomerList();
const data = ref({});

onMounted(() => {
  getContract(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(() => {});
});
</script>

<style scoped></style>
