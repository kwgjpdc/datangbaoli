<template>
  <el-card class="right-panel">
    <template #header>
      <div class="card-header">
        <span>{{ translateNodeName(elementType) }}</span>
<!--        <el-button type="danger" icon="Delete" @click="changePanel"/>-->
      </div>
    </template>
    <el-collapse v-model="activeName" >
        <!--   常规信息     -->
        <el-collapse-item name="common">
          <template #title><el-icon><InfoFilled/> </el-icon> 常规信息</template>
          <common-panel :id="elementId"/>
        </el-collapse-item>

        <!--   任务信息     -->
        <el-collapse-item name="Task" v-if="elementType.indexOf('Task') !== -1">
          <template #title><el-icon><BellFilled /></el-icon> 任务配置</template>
          <user-task-panel :id="elementId"/>
        </el-collapse-item>

        <!--   表单     -->
        <el-collapse-item name="form" v-if="formVisible">
          <template #title><el-icon><List/></el-icon> 表单配置</template>
          <form-panel :id="elementId"/>
        </el-collapse-item>

        <!--   执行监听器     -->
        <el-collapse-item name="executionListener">
           <template #title><el-icon><Promotion/></el-icon> 执行监听器
             <el-badge :value="executionListenerCount" class="item" type="primary"/>
           </template>
          <execution-listener :id="elementId" @getExecutionListenerCount="getExecutionListenerCount"/>
        </el-collapse-item>

        <!--   任务监听器     -->
        <el-collapse-item name="taskListener" v-if="elementType === 'UserTask'" >
          <template #title> <el-icon><Flag/></el-icon> 任务监听器
            <el-badge :value="taskListenerCount" class="item" type="primary"/>
          </template>
          <task-listener :id="elementId" @getTaskListenerCount="getTaskListenerCount"/>
        </el-collapse-item>

        <!--   多实例     -->
        <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" >
          <template #title><el-icon><Grid/></el-icon> 多实例</template>
          <multi-instance :id="elementId"/>
        </el-collapse-item>

        <!--   流转条件     -->
        <el-collapse-item name="condition" v-if="conditionVisible" >
          <template #title><el-icon><Grid/></el-icon> 流转条件</template>
          <condition-panel :id="elementId"/>
        </el-collapse-item>

        <!--   其它     -->
<!--        <el-collapse-item name="other">-->
<!--          <template #title><el-icon><MoreFilled/></el-icon> 其它</template>-->
<!--          <other-panel :id="elementId"/>-->
<!--        </el-collapse-item>-->
    </el-collapse>
  </el-card>
</template>

<script setup name="Designer">
import {markRaw} from "@vue/reactivity";
import ExecutionListener from './panel/executionListener'
import TaskListener from './panel/taskListener'
import MultiInstance from './panel/multiInstance'
import CommonPanel from './panel/commonPanel'
import UserTaskPanel from './panel/taskPanel'
import ConditionPanel from './panel/conditionPanel'
import FormPanel from './panel/formPanel'
import OtherPanel from './panel/otherPanel'

import {StrUtil} from '@/utils/StrUtil'
import { translateNodeName } from "./common/bpmnUtils";
import useModelerStore from '@/store/modules/modeler'
const modelerStore = useModelerStore()

const { proxy } = getCurrentInstance();

const activeName = ref('common');
const executionListenerCount = ref(0);
const taskListenerCount = ref(0);
const elementId = ref("");
const elementType = ref("");
const conditionVisible = ref(false); // 流转条件设置
const formVisible = ref(false); // 表单配置

const data = reactive({
  rules:{
    id: [
      { required: true, message: '节点Id 不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '节点名称不能为空', trigger: 'blur' },
    ],
  },
  formData:{
    id: "",
    name: "",
    documentation: "",
    processCategory: "",
    initiator: "",
    userType: "",
    async: "",
    dueDate: "",
    formKey: "",
    priority: "",
    skipExpression: "",
    isForCompensation: "",
    conditionExpression: "",
    triggerable: "",
    autoStoreVariables: "",
    exclude: "",
    ruleVariablesInput: "",
    rules: "",
    resultVariable: "",
  },
});
const { formData, rules } = toRefs(data);

// 监听数据
watch(elementId, newVal => {
      activeName.value = "common";
    }
)

// 初始化流程设计器
function initModels() {
  // // 初始化 modeler 以及其他 moddle
  // if (!modelerStore.getModeler) {
  //   // 避免加载时 流程图 并未加载完成
  //   proxy.timer = setTimeout(() => initModels(), 10);
  //   return;
  // }
  // if (proxy.timer) clearTimeout(proxy.timer);
  getActiveElement();
}

// 注册节点事件
function getActiveElement() {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null);
  modelerStore.getModeler.on("import.done", e => {
    initFormOnChanged(null);
  });
  // 监听选择事件，修改当前激活的元素以及表单
  modelerStore.getModeler.on("selection.changed", ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null);
  });
  modelerStore.getModeler.on("element.changed", ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element);
    }
  });
}

// 初始化数据
function initFormOnChanged(element) {
  let activatedElement = element;
  if (!activatedElement) {
    activatedElement =
        modelerStore.getElRegistry.find(el => el.type === "bpmn:Process") ??
        modelerStore.getElRegistry.find(el => el.type === "bpmn:Collaboration");
  }
  if (!activatedElement) return;
  modelerStore.setElement(markRaw(activatedElement), activatedElement.id);
  elementId.value = activatedElement.id;
  elementType.value = activatedElement.type.split(":")[1] || "";
  conditionVisible.value = !!(
      elementType.value === "SequenceFlow" &&
      activatedElement.source &&
      activatedElement.source.type.indexOf("StartEvent") === -1
  );
  formVisible.value = elementType.value === "UserTask" || elementType.value === "StartEvent";
}

/** 获取执行监听器数量 */
function getExecutionListenerCount(value){
  executionListenerCount.value = value;
}
/** 获取任务监听器数量 */
function getTaskListenerCount(value){
  taskListenerCount.value = value;
}

initModels();

</script>

<style lang="scss">
.el-icon {
  margin-right: 5px
}
</style>
