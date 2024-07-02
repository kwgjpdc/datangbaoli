<template>
  <van-form label-width="30vw" :key="`${data}`">
    <van-collapse v-model="activeNames">
      <template v-for="(list, listIndex) in config">
        <van-collapse-item
          :name="listIndex"
          :title="list.title"
          :key="listIndex"
          v-if="
            (!list.checkShow && list.type == 'text') ||
            (list.type == 'text' && list.checkShow && checkItemShow(list))
          "
        >
          <template v-for="(item, index) in list.children">
            <template v-if="item.checkShow && checkItemShow(item)">
              <van-field
                v-if="item.type === 'dictType'"
                readonly
                :key="index"
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #input>
                  <div>
                    {{
                      dictValue[item.dictType]
                        ? dictValue[item.dictType]
                        : handleDictsByType(item.dictType, data[item.prop])
                    }}
                  </div>
                </template>
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>
              <van-field
                v-else
                readonly
                :key="index + 6"
                v-model="data[item.prop]"
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>
            </template>

            <template v-if="!item.checkShow">
              <van-field
                v-if="item.type === 'dictType'"
                :key="index + 10"
                readonly
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #input>
                  <div>
                    {{
                      dictValue[item.dictType]
                        ? dictValue[item.dictType]
                        : handleDictsByType(item.dictType, data[item.prop])
                    }}
                  </div>
                </template>
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>

              <van-field
                :key="index"
                v-else-if="item.type === 'list'"
                readonly
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #input>
                  <div>{{ handleListType(item.listType, item.key) }}</div>
                </template>
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>

              <van-field
                :key="index + 5"
                v-else-if="item.type === 'custom'"
                readonly
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #input>
                  <div>{{ item.func(data[item.prop]) }}</div>
                </template>
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>

              <div v-else-if="item.type == 'table'" :key="index + 3">
                <Table
                  :width="item.width"
                  :config="item.children"
                  :data="data[item.prop]"
                />
              </div>

              <van-field
                v-else
                :key="index + 4"
                readonly
                v-model="data[item.prop]"
                :name="item.label"
                :label="item.label"
                :rules="[{ required: false, message: '' }]"
              >
                <template #right-icon v-if="item.suffix">
                  <div>{{ item.suffix }}</div>
                </template>
              </van-field>
            </template>
          </template>
        </van-collapse-item>
        <van-collapse-item
          :key="listIndex"
          :name="listIndex"
          :title="list.title"
          v-if="list.type === 'table'"
        >
          <Table
            :width="list.width"
            :config="list.children"
            :data="data[list.prop]"
          />
        </van-collapse-item>
      </template>

      <van-collapse-item
        name="1000"
        title="附件信息"
        v-if="data.commonFileList && data.commonFileList.length > 0"
      >
        <div class="h-[12px]"></div>
        <File :file-list="data.commonFileList"></File>
        <div class="h-[3px]"></div>
      </van-collapse-item>
    </van-collapse>
  </van-form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getDicts } from '@/api/flowable/todo.js';
import File from './file.vue';
import Table from './table.vue';

const props = defineProps({
  config: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(['update:modelValue']);

const data = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  }
});

const activeNames = ref([0]);
const dictValue = ref({});

const handleDictsByType = (type, value) => {
  if (!type || !value) {
    return;
  }
  if (dictValue.value[type] === '' || dictValue.value[type]) {
    return;
  }
  dictValue.value[type] = '';
  getDicts(type).then(res => {
    const list = res.data.map(p => ({
      label: p.dictLabel,
      value: p.dictValue,
      elTagType: p.listClass,
      elTagClass: p.cssClass,
      remark: p.remark
    }));
    if (list && Array.isArray(list) && list.length >= 0) {
      // 判断是否多选的
      if (value.toString().indexOf(',') !== -1) {
        const keyList = value.split(',');
        let str = '';
        keyList.forEach(item => {
          const obj = list.find(o => {
            return o.value == item;
          });
          if (obj) {
            str = str + '，' + obj.label;
          }
        });
        dictValue.value[type] = str ? str.substring(1) : '';
      } else {
        const obj = list.find(item => {
          return item.value == value;
        });
        if (obj) {
          dictValue.value[type] = obj.label;
        }
      }
    }
  });
};

const checkItemShow = item => {
  if (item.checkKey && item.checkValue) {
    return data.value[item.checkKey] === item.checkValue;
  }
  if (item.checkKey && item.checkFunc) {
    return item.checkFunc(data.value[item.checkKey]);
  }
  return false;
};

const handleListType = (type, key) => {
  const list = data.value[type];
  const str = [];
  if (list && list.length > 0) {
    list.forEach(item => {
      str.push(item[key]);
    });
  }

  return str.join(',');
};
</script>
<style scoped lang="less">
:deep(.van-collapse-item__content) {
  padding: 0px;
}
:deep(.van-field__label) {
  color: #777;
}
</style>
