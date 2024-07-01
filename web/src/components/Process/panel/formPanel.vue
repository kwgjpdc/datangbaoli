<template>
    <el-form label-width="80px" status-icon @submit.native.prevent>
      <el-form-item label="流程表单">
        <el-select v-model="bpmnFormData.formKey" clearable class="m-2" placeholder="挂载节点表单" @change="updateElementFormKey">
          <el-option
              v-for="item in formList"
              :key="item.value"
              :label="item.formName"
              :value="item.formId"
          />
        </el-select>
      </el-form-item>
    </el-form>
</template>

<script setup name="formPanel">
import useModelerStore from '@/store/modules/modeler'
import { listAllForm } from '@/api/flowable/form'
import {StrUtil} from "@/utils/StrUtil";
const modelerStore = useModelerStore()
const { proxy } = getCurrentInstance();
// 表单数据
const formList = ref([]);
/** 组件传值  */
const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

const data = reactive({
  bpmnFormData: {}
});

const { bpmnFormData } = toRefs(data);

/** 传值监听 */
watch(() => props.id, newVal => {
      if (newVal) {
        // 加载表单列表
        getListForm();
        resetFlowForm();
      }
    },
    {immediate: true}
)

// 方法区
function resetFlowForm() {
  bpmnFormData.value.formKey = modelerStore.getBpmnElement.businessObject.formKey;
}

function updateElementFormKey(val) {
  if (StrUtil.isBlank(val)) {
    delete modelerStore.getBpmnElement.businessObject[`formKey`]
  } else {
   modelerStore.getModeling.updateProperties(modelerStore.getBpmnElement, {'formKey': val});
}
}

// 获取表单信息
function getListForm() {
  listAllForm().then(res => {
    res.data.forEach(item => {
      item.formId = item.formId.toString();
    })
    formList.value = res.data;
  })
}

</script>