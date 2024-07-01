<template>
  <el-form :model="bpmnFormData" label-width="80px" :rules="rules" status-icon>
      <el-form-item :label="bpmnFormData.$type === 'bpmn:Process'? '流程标识': '节点ID'" prop="id" @change="updateElementTask('id')">
        <el-input v-model="bpmnFormData.id" maxlength="32"/>
      </el-form-item>
      <el-form-item :label="bpmnFormData.$type === 'bpmn:Process'? '流程名称': '节点名称'" prop="name">
        <el-input v-model="bpmnFormData.name" maxlength="32" @change="updateElementTask('name')"/>
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="bpmnFormData.$type === 'bpmn:Process'">
        <el-form-item label="流程分类" prop="processCategory">
          <el-select v-model="bpmnFormData.processCategory" placeholder="请选择流程分类" @change="updateElementTask('processCategory')">
            <el-option
                v-for="dict in sys_process_category"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item v-if="bpmnFormData.$type === 'bpmn:SubProcess'" label="状态">
        <el-switch v-model="bpmnFormData.isExpanded" active-text="展开" inactive-text="折叠" @change="updateElementTask('isExpanded')" />
      </el-form-item>
      <el-form-item label="节点描述">
        <el-input :rows="2" type="textarea" maxlength="255" v-model="bpmnFormData.documentation" @change="updateElementTask('documentation')"/>
      </el-form-item>
  </el-form>
</template>

<script setup name="CommonPanel">
import {StrUtil} from '@/utils/StrUtil'
import useModelerStore from '@/store/modules/modeler'
const modelerStore = useModelerStore()

const { proxy } = getCurrentInstance();
const { sys_process_category } = proxy.useDict('sys_process_category');

const data = reactive({
  rules:{
    id: [
      { required: true, message: '节点Id 不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '节点名称不能为空', trigger: 'blur' },
    ],
  },
  bpmnFormData: {}
});

const { rules, bpmnFormData } = toRefs(data);

/** 组件传值  */
const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

/** 传值监听 */
watch(() => props.id, newVal => {
      if (newVal) {
        resetTaskForm();
      }
    },
    {immediate: true}
)

function resetTaskForm() {
  bpmnFormData.value = JSON.parse(JSON.stringify(modelerStore.getBpmnElement.businessObject));
}

function updateElementTask(key) {
  const taskAttr = Object.create(null);
  taskAttr[key] = bpmnFormData.value[key] || null;
  modelerStore.getModeling.updateProperties(modelerStore.getBpmnElement, taskAttr);
}

</script>
