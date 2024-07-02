<template>
  <!-- 项目尽调 -->
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="projectAll">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getDiligence } from '@/api/flowable/todo.js';
import { useConfigList } from './project';

const props = defineProps({
  id: {
    type: Number,
    default: 3
  }
});

const { configList } = useConfigList();
const data = ref({});

onMounted(() => {
  getDiligence(props.id)
    .then(res => {
      data.value = res.data;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
