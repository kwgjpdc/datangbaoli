<template>
  <!-- 放款查询 -->
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="projectAll">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getLoan } from '@/api/flowable/todo.js';
import { useConfigList } from './config';

const props = defineProps({
  id: {
    type: Number,
    default: 28
  }
});

const { configList } = useConfigList();
const data = ref({});

onMounted(() => {
  getLoan(props.id)
    .then(res => {
      const obj = res.data;

      if (obj.contract) {
        for (let key in obj.contract) {
          if (!obj[key]) {
            obj[key] = obj.contract[key];
          }
        }
      }

      if (obj.loan) {
        for (let key in obj.loan) {
          if (!obj[key]) {
            obj[key] = obj.loan[key];
          }
        }
      }

      // console.log(obj);
      data.value = obj;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
