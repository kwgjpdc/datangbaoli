<template>
  <div class="p-[10px] text-center">
    <div class="w-full overflow-x-auto">
      <table
        border=""
        class="mytable text-[14px] w-full"
        :style="{ width: width }"
      >
        <thead class="thead">
          <tr class="bg-[#f7f8fa] border-t border-b border-[#dcdee0]">
            <th
              class="text-[#999] py-[5px] px-[3px] border-r border-[#dcdee0]"
              v-for="(item, index) in columns"
              :key="index"
              :class="{ 'border-l': index === 0 }"
            >
              {{ item.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="data.length > 0">
          <tr
            class="border-b border-[#dcdee0]"
            v-for="record in rows"
            :key="record"
          >
            <td
              class="text-[#999] py-[5px] px-[3px] border-r border-[#dcdee0]"
              v-for="(item, index) in columns"
              :key="item.prop"
              :class="{ 'border-l': index === 0 }"
            >
              <div v-if="item.type === 'dictType'">
                {{ getInfo(item.dictType, record[item.prop]) }}
              </div>
              <div v-else-if="item.type === 'custom'">
                {{ item.func ? item.func(record[item.prop]) : '' }}
              </div>
              <div v-else>
                {{ record[item.prop] }}
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              :colspan="columns.length"
              class="py-[10px] border-r border-[#dcdee0] border-l border-b"
            >
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup name="mobile-table">
import { ref, computed, onMounted } from 'vue';
import { getDicts } from '@/api/flowable/todo.js';

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '500px'
  },
  data: {
    type: Array,
    default: () => []
  },
  config: {
    type: Array,
    default: () => []
  }
});

const recordVal = ref({});

const columns = computed(() => {
  return props.config;
});

const rows = computed(() => {
  return props.data;
});

// watch([columns], (newValue, oldValue) => {
//   console.log(newValue)
//   if (newValue && newValue.length > 0) {
//     console.log(newValue)
//     changeCustomerName(newValue)
//   }
// })

onMounted(() => {
  changeCustomerName();
});

const changeCustomerName = () => {
  if (!columns.value) {
    return;
  }
  columns.value.forEach(item => {
    if (item.type == 'dictType') {
      if (item.func) {
        item.func().then(row => {
          recordVal.value[item.dictType] = row;
        });
      } else {
        getDicts(item.dictType).then(res => {
          const list = res.data.map(p => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass,
            remark: p.remark
          }));
          recordVal.value[item.dictType] = list;
        });
      }
    }
  });
  console.log(recordVal.value);
};

const getInfo = (type, value) => {
  const list = recordVal.value[type];

  if (list && list.length > 0) {
    if (list && Array.isArray(list) && list.length >= 0) {
      const obj = list.find(item => {
        return item.value == value;
      });
      if (obj) {
        return obj.label;
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
