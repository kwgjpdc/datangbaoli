<template>
  <div
    class="bg-[#fff] mx-[16px] rounded-[8px] px-[12px] py-[10px] text-[14px] shadow-[0_0px_7px_0_rgba(0,0,0,0.1)] mb-[12px] flex justify-between items-center"
    v-for="(item, index) in fileList"
    :key="index"
  >
    <div>
      <div class="py-[2px]">
        <div class="flex justify-start items-center">
          <p class="flex-shrink-0">文件名</p>
          <p class="text-[#666] pl-[5px] flex-1">
            {{ item.fileName ? item.fileName.split('_')[0] : '' }}
          </p>
        </div>
      </div>
      <div class="flex justify-start py-[2px] items-center">
        <div class="flex justify-start items-center">
          <span class="">文件大小</span>
          <p class="text-[#666] pl-[5px]">
            {{ formatFileSize(item.fileSize) }}
          </p>
        </div>
        <div class="flex justify-start items-center ml-[20px]">
          <span class="mr-[5px]">格式</span>
          <span class="text-[#666] pl-[5px]">{{ item.fileType }}</span>
        </div>
      </div>
      <div class="py-[2px]">
        <div class="flex justify-start items-center">
          <span class="flex-shrink-0">附件类型</span>
          <span class="text-[#666] pl-[5px]">{{
            checkFileType('sys_file_biz_type', item.bizType)
          }}</span>
        </div>
      </div>
      <div class="py-[2px]">
        <div class="flex justify-start items-center">
          <span class="mr-[5px] flex-shrink-0">附件来源</span>
          <span class="text-[#666] pl-[5px]">{{
            checkFileType('sys_file_source', item.fileSource)
          }}</span>
        </div>
      </div>
      <div class="py-[2px]">
        <div class="flex justify-start items-center">
          <span class="">操作时间</span>
          <span class="text-[#666] pl-[5px]">{{ item.createTime }}</span>
        </div>
      </div>
    </div>

    <div
      class="cursor-pointer flex-shrink-0"
      style="color: var(--van-primary-color)"
      @click="downloadFile(item)"
    >
      下载
    </div>
  </div>
</template>

<script setup>
import { formatFileSize } from '@/utils/tool';
import { ref, onMounted } from 'vue';
import { getDicts } from '@/api/flowable/todo.js';
defineProps({
  fileList: {
    type: Array,
    default: () => []
  }
});

const dictValue = ref({});

onMounted(() => {
  handleDictsByFile('sys_file_biz_type');
  handleDictsByFile('sys_file_source');
});

const downloadFile = item => {
  window.open(item.fileUrl, '_blank');
};

const checkFileType = (type, value) => {
  const list = dictValue.value[type];
  if (list && Array.isArray(list) && list.length >= 0) {
    const obj = list.find(item => {
      return item.value == value;
    });
    if (obj) {
      return obj.label;
    }
  }
  return '';
};

const handleDictsByFile = type => {
  if (!type) {
    return;
  }
  if (dictValue.value[type]) {
    return;
  }
  getDicts(type).then(res => {
    const list = res.data.map(p => ({
      label: p.dictLabel,
      value: p.dictValue,
      elTagType: p.listClass,
      elTagClass: p.cssClass,
      remark: p.remark
    }));
    dictValue.value[type] = list;
  });
};
</script>

<style scoped></style>
