<template>
  <!-- 利息调整审核 -->
  <TaskForm :config="basicConfig" v-model="data"></TaskForm>
</template>

<script setup name="changeInterest">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getInterestInfo } from '@/api/flowable/todo.js';
import { useConfigList } from './config';

const props = defineProps({
  id: {
    type: Number,
    default: 15
  }
});

const { basicConfig } = useConfigList();
const data = ref({});

onMounted(() => {
  getInterestInfo(props.id)
    .then(res => {
      const obj = res.data;

      if (obj.po) {
        obj.adjustAmount = obj.po.adjustAmount;
        obj.interestNotReceived = obj.po.interestNotReceived;
        obj.interestReceived = obj.po.interestReceived;
      }

      data.value = obj;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
