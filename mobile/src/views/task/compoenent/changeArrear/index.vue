<template>
  <!-- 尾款划转审核 -->
  <TaskForm :config="basicConfig" v-model="data"></TaskForm>
</template>

<script setup name="changeArear">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getArrears } from '@/api/flowable/todo.js';
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
  getArrears(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
