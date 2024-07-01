<template>
  <div class="app-container">
    <el-card class="box-card" >
      <template v-slot:header>
        <div class="clearfix">
          <span class="document">发起任务</span>
          <el-button style="float: right;" size="small" type="danger" @click="goBack">关闭</el-button>
        </div>
      </template>
      <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <el-tab-pane label="表单信息" name="1">
          <!--初始化流程加载表单信息-->
          <el-col :span="16" :offset="4">
            <v-form-render :form-data="formRenderData" ref="vFormRef"/>
            <div style="margin-left:15%;margin-bottom: 20px;font-size: 14px;">
              <el-button type="primary" @click="submitForm">提 交</el-button>
              <el-button type="primary" @click="resetForm">重 置</el-button>
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程图-->
        <el-tab-pane label="流程图" name="2">
          <bpmn-viewer :flowData="flowData"/>
        </el-tab-pane>
      </el-tabs>
      <!--选择流程接收人-->
      <el-dialog :title="taskTitle" v-model="taskOpen" width="65%" append-to-body>
        <flow-user v-if="checkSendUser" :checkType="checkType"  @handleUserSelect="userSelect"/>
        <flow-role v-if="checkSendRole" @handleRoleSelect="roleSelect"/>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="taskOpen = false">取 消</el-button>
            <el-button type="primary" @click="submitTask">提 交</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup name="ProcessSend">

import { definitionStart, flowXmlAndNode } from "@/api/flowable/definition";
import { flowFormData } from "@/api/flowable/process";
import { getNextFlowNodeByStart } from "@/api/flowable/todo";
import FlowUser from '@/components/flow/User';
import FlowRole from '@/components/flow/Role';
import BpmnViewer from '@/components/Process/viewer';
const route = useRoute();
const { proxy } = getCurrentInstance();

// 模型xml数据
const flowData = ref({});
// 切换tab标签
const activeName = ref('1');
// 遮罩层
const loading = ref(true);
// 流程定义编号
const deployId = ref("");
// 流程实例编号
const procDefId = ref("");
const formRenderData = ref({});
// 流程变量数据
const variables = ref([]);
const taskTitle = ref(null);
const taskOpen = ref(false);
// 是否展示人员选择模块
const checkSendUser = ref(true);
// 是否展示角色选择模块
const checkSendRole = ref(true);
// 选择类型
const checkType = ref('');
// 选中任务接收人员数据
const checkValues = ref(null);
// 填写的表单数据
const formData = ref({});
// 会签节点
const multiInstanceVars = ref('');
// 表单json
const formJson = ref({});
// 表单渲染器
const vFormRef = ref(null);

const data = reactive({
  // 查询参数
  queryParams: {
    deptId: undefined
  },
});

const { queryParams } = toRefs(data);

deployId.value = route.query && route.query.deployId;
// 初始化表单
procDefId.value = route.query && route.query.procDefId;
getFlowFormData(deployId.value);

/** tab点击 */
function handleClick(tab, event) {
  if (tab.props.name === '2') {
    flowXmlAndNode({deployId: deployId.value}).then(res => {
      flowData.value = res.data;
    })
  }
}

/** 流程表单数据 */
function getFlowFormData(deployId) {
  const params = {deployId: deployId}
  flowFormData(params).then(res => {
    // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
    proxy.$nextTick(() => {
      // 回显数据
      vFormRef.value.setFormJson(res.data);
      formJson.value = res.data;
    })
  }).catch(res => {
    goBack();
  })
}

/** 申请流程表单数据提交 */
function submitForm() {
  vFormRef.value.getFormData().then(formDataValue => {
    // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
    getNextFlowNodeByStart({deploymentId: deployId.value, variables: formDataValue}).then(res => {
      const data = res.data;
      if (data) {
        formData.value = formDataValue;
        if (data.dataType === 'dynamic') {
          if (data.type === 'assignee') { // 指定人员
            checkSendUser.value = true;
            checkType.value = "single";
          } else if (data.type === 'candidateUsers') {  // 候选人员(多个)
            checkSendUser.value = true;
            checkType.value = "multiple";
          } else if (data.type === 'candidateGroups') { // 指定组(所属角色接收任务)
            checkSendRole.value = true;
          } else { // 会签
            // 流程设计指定的 elementVariable 作为会签人员列表
            multiInstanceVars.value = data.vars;
            checkSendUser.value = true;
            checkType.value = "multiple";
          }
          taskOpen.value = true;
          taskTitle.value = "选择任务接收";
        } else {
          if (procDefId.value) {
            let param = {
              formJson: formJson.value,
            }
            // 复制对象的属性值给新的对象
            Object.assign(param, formDataValue);
            // 启动流程并将表单数据加入流程变量
            definitionStart(procDefId.value, param).then(res => {
              proxy.$modal.msgSuccess(res.msg);
              goBack();
            })
          }
        }
      }
    })
  }).catch(error => {
    console.log(error)
  })
}

/** 关闭当前标签页并返回上个页面 */
function goBack() {
  checkSendUser.value = false;
  taskOpen.value = false;
  checkSendRole.value = false;
  const obj = { path: "/task/process", query: { t: Date.now()}};
  proxy.$tab.closeOpenPage(obj);
}

/** 重置表单 */
function resetForm() {
  vFormRef.value.resetForm();
}

/** 提交流程 */
function submitTask() {
  if (!checkValues.value && checkSendUser.value) {
    proxy.$modal.msgError("请选择任务接收!");
    return;
  }
  if (!checkValues.value && checkSendRole.value) {
    proxy.$modal.msgError("请选择流程接收角色组!");
    return;
  }
  if (formData.value) {
    const param = {
      formJson: formJson.value,
    }
    // 复制对象的属性值给新的对象
    Object.assign(param, formData.value);
    if (multiInstanceVars.value) {
      Reflect.set(param, multiInstanceVars.value, checkValues.value);
    } else {
      Reflect.set(param, "approval", checkValues.value);
    }
    // 启动流程并将表单数据加入流程变量
    definitionStart(procDefId.value, param).then(res => {
      proxy.$modal.msgSuccess(res.msg);
      goBack();
    })
  }
}

/** 用户信息选中数据 */
const userSelect = (selection) => {
  if (selection) {
    if (selection instanceof Array) {
      const selectVal = selection.map(item => item.userId);
      if (multiInstanceVars.value) {
        checkValues.value = selectVal;
      } else {
        checkValues.value = selectVal.join(',');
      }
    } else {
      checkValues.value = selection.userId;
    }
  }
}

/** 角色信息选中数据 */
const roleSelect = (selection, name) => {
  if (selection) {
    if (selection instanceof Array) {
      const selectVal = selection.map(item => item.roleId);
      checkValues.value = selectVal.join(',')
    } else {
      checkValues.value = selection;
    }
  }
}

</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.my-label {
  background: #E1F3D8;
}
</style>
