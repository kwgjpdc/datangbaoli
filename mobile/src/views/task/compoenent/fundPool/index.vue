<template>
  <!-- 资金池查询 -->
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="fundPool">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getFundPoolInfo } from '@/api/flowable/todo.js';
import { useConfigList } from './fundpool';

const props = defineProps({
  id: {
    type: Number || String,
    default: ''
  }
});

const { configList } = useConfigList();
const data = ref({});

onMounted(() => {
  getFundPoolInfo(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
