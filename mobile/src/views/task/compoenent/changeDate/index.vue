<template>
  <!-- 到期日调整审核 -->
  <TaskForm :config="basicConfig" v-model="data"></TaskForm>
  <TaskForm :config="configList" v-model="data"></TaskForm>
</template>

<script setup name="changeDate">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getDateInfo } from '@/api/flowable/todo.js';
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
  getDateInfo(props.id)
    .then(res => {
      const obj = res.data;

      obj.defaultPeriodList = obj.changeSubList || [];
      if (obj.po) {
        obj.adjustRange = obj.po.adjustRange;
        if (obj.po) {
          for (let key in obj.po) {
            if (!obj[key]) {
              obj[key] = obj.po[key];
            }
          }
        }

        if (obj.po.subList && obj.po.subList.length > 0) {
          obj.defaultPeriodList.map((item, index) => {
            return Object.assign(item, obj.po.subList[index]);
          });
        } else {
          obj.defaultPeriodList.map(item => {
            return {
              ...item,
              loanExpireDayAdjustSubId: null,
              loanExpireDayAdjustId: null,
              branchEndDateNew: '',
              branchAmount: ''
            };
          });
        }
      }

      data.value = obj;
    })
    .catch(err => {});
});
</script>

<style scoped></style>
