<template>
  <!-- 授信信息审核 -->
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="projectAll">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getShouxinInfo } from '@/api/flowable/todo.js';
import { useConfigList } from './config';

const props = defineProps({
  id: {
    type: Number,
    default: 69
  }
});

const { configList } = useConfigList();
const data = ref({});

onMounted(() => {
  getShouxinInfo(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
