<template>
  <!-- 资金提款审核 -->
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="fundDraw">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getFundDrawInfo } from '@/api/flowable/todo.js';
import { useConfigList } from './fundDraw';

const props = defineProps({
  id: {
    type: Number || String,
    default: ''
  }
});

const { configList } = useConfigList();
const data = ref({});

onMounted(() => {
  getFundDrawInfo(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
