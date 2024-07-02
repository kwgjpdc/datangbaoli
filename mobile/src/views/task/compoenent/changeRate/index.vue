<template>
  <!-- 利率变更审核 -->
  <TaskForm :config="basicConfig" v-model="data"></TaskForm>
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="projectAll">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getRateInfo } from '@/api/flowable/todo.js';
import { useConfigList } from './config';

const props = defineProps({
  id: {
    type: Number,
    default: 15
  }
});

const { configList, basicConfig } = useConfigList();
const data = ref({});

onMounted(() => {
  getRateInfo(props.id)
    .then(res => {
      const obj = res.data;

      if (obj.po) {
        obj.changeType = obj.po.changeType;
        obj.rateEffectiveDate = obj.po.rateEffectiveDate;
        obj.normalList = [];
        obj.feeList = [];
        obj.subList = [];
        obj.normalList.push(obj.po);
        obj.feeList.push(obj.po);
        if (obj.po.subList && obj.po.subList.length > 0) {
          obj.subList = [...obj.po.subList];
        }
      }

      data.value = obj;
    })
    .catch(() => {});
});
</script>

<style scoped></style>
