<template>
  <!-- 应收帐款调整信息 -->
  <TaskForm :config="basicConfig" v-model="data"></TaskForm>
</template>

<script setup name="changeArear">
import TaskForm from '@/components/TaskForm/index.vue';
import { ref, onMounted } from 'vue';
import { getAdjust } from '@/api/flowable/todo.js';
import { useConfigList } from './config';

const props = defineProps({
  id: {
    type: Number,
    default: 11
  }
});

const { basicConfig } = useConfigList();
const data = ref({});

onMounted(() => {
  getAdjust(props.id)
    .then(res => {
      const obj = res.data;

      if (obj && obj.length > 0) {
        data.value.debtReceivableAmount = 0;
        data.value.debtReceivableBalance = 0;
        data.value.debtReceivableAmountNew = 0;
        data.value.debtReceivableBalanceNew = 0;
        obj.forEach(item => {
          if (!item.debtReceivableAmount) {
            item.debtReceivableAmount = '';
          }
          if (!item.debtReceivableBalance) {
            item.debtReceivableBalance = '';
          }
          if (!item.debtReceivableAmountNew) {
            item.debtReceivableAmountNew = '';
          }
          if (!item.debtReceivableBalanceNew) {
            item.debtReceivableBalanceNew = '';
          }
          data.value.debtReceivableAmount += Number(item.debtReceivableAmount);
          data.value.debtReceivableBalance += Number(
            item.debtReceivableBalance
          );
          data.value.debtReceivableAmountNew += Number(
            item.debtReceivableAmountNew
          );
          data.value.debtReceivableBalanceNew += Number(
            item.debtReceivableBalanceNew
          );
        });

        data.value.list = obj;
      }
    })
    .catch(err => {});
});
</script>

<style scoped></style>
