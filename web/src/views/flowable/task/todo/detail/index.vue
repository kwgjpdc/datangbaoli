<template>
  <div class="app-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span class="document">待办任务</span>
          <el-tag style="margin-left:10px">发起人:{{ startUser }}</el-tag>
          <el-tag>任务节点:{{ taskName }}</el-tag>
          <el-button style="float: right;" size="small" type="danger" @click="goBack">关闭</el-button>
        </div>
      </template>
      <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <el-tab-pane label="表单信息" name="1">
          <el-col :span="16" :offset="4">
            <approveDetail :approveId="approveInfo.approveId" v-if="approveInfo.approveId"></approveDetail>

            <v-form-render ref="vFormRef"/>
            <div style="margin-left:40%;margin-bottom: 20px;font-size: 14px;">
              <el-button icon="Check" type="primary" @click="handleComplete">审 批</el-button>
              <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleDelegate">委派</el-button>-->
              <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleAssign">转办</el-button>-->
              <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleDelegate">签收</el-button>-->
              <!--<el-button icon="RefreshLeft" type="warning" @click="handleReturn">退回</el-button>-->
              <!--<el-button icon="CircleClose" type="danger" @click="handleReject">驳回</el-button>-->
            </div>
          </el-col>
        </el-tab-pane>

        <!--流程流转记录-->
        <el-tab-pane label="流转记录" name="2">
          <!--flowRecordList-->
          <el-col :span="16" :offset="4">
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(item,index ) in flowRecordList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)"
                >
                  <p style="font-weight: 700">{{ item.taskName }}</p>
                  <el-card :body-style="{ padding: '10px' }">
                    <el-descriptions class="margin-top" :column="1" size="small" border>
                      <el-descriptions-item v-if="item.assigneeName" >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><User /></el-icon>
                            办理人
                          </div>
                        </template>
                        {{item.assigneeName}}
                        <el-tag type="info" size="small">{{item.deptName}}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.candidate" >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><User /></el-icon>
                            候选办理
                          </div>
                        </template>
                        {{item.candidate}}
                      </el-descriptions-item>
                      <el-descriptions-item >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><Calendar /></el-icon>
                            接收时间
                          </div>
                        </template>
                        {{item.createTime}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.finishTime" >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><Calendar /></el-icon>
                            处理时间
                          </div>
                        </template>
                        {{item.finishTime}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.duration"  >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><Timer /></el-icon>
                            耗时
                          </div>
                        </template>
                        {{item.duration}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.comment" >
                        <template #label>
                          <div class="cell-item">
                            <el-icon :style="iconStyle"><ChatDotSquare /></el-icon>
                            处理意见
                          </div>
                        </template>
                        {{item.comment.comment}}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-tab-pane>

        <!--流程图-->
        <el-tab-pane label="流程图" name="3">
          <bpmn-viewer :flowData="flowData" :procInsId="taskForm.procInsId"/>
        </el-tab-pane>
      </el-tabs>

      <!--审批任务-->
      <el-dialog :title="completeTitle" v-model="completeOpen" width="60%" append-to-body>
        <el-form ref="taskFormRef" :model="taskForm">
          <el-form-item prop="targetKey">
            <flow-user v-if="checkSendUser" :checkType="checkType" @handleUserSelect="userSelect"></flow-user>
            <flow-role v-if="checkSendRole" @handleRoleSelect="roleSelect"></flow-role>
          </el-form-item>
          <el-form-item label="审核意见" prop="approveResult">
            <div class="form-item__block">
              <el-radio-group
                      v-model="taskForm.variables.approveResult"
                      :style="formItemContentStyle"
                      @change="handleChargeInterestWayChange"
              >
                <el-radio
                        v-for="item in approve_type"
                        :key="item.value"
                        :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="审核说明" prop="comment">
            <el-input type="textarea" v-model="taskForm.comment" placeholder="请输入审核说明"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
          <el-button @click="completeOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskComplete">确 定</el-button>
        </span>
        </template>
      </el-dialog>

      <!--退回流程-->
      <el-dialog :title="returnTitle" v-model="returnOpen" width="40%" append-to-body>
        <el-form ref="taskFormRef" :model="taskForm" label-width="80px">
          <el-form-item label="退回节点" prop="targetKey">
            <el-radio-group v-model="taskForm.targetKey">
              <el-radio-button
                v-for="item in returnTaskList"
                :key="item.id"
                :label="item.id"
              >{{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退回意见" prop="comment"
                        :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
            <el-input style="width: 50%" type="textarea" v-model="taskForm.comment" placeholder="请输入意见"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
              <el-button @click="returnOpen = false">取 消</el-button>
              <el-button type="primary" @click="taskReturn">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!--驳回流程-->
      <el-dialog :title="rejectTitle" v-model="rejectOpen" width="40%" append-to-body>
        <el-form ref="taskFormRef" :model="taskForm" label-width="80px">
          <el-form-item label="驳回意见" prop="comment"
                        :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
            <el-input style="width: 50%" type="textarea" v-model="taskForm.comment" placeholder="请输入意见"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="rejectOpen = false">取 消</el-button>
            <el-button type="primary" @click="taskReject">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>


<script setup name="TodoDetail">
import {flowRecord} from "@/api/flowable/finished";
import FlowUser from '@/components/flow/User';
import FlowRole from '@/components/flow/Role';
import BpmnViewer from '@/components/Process/viewer';
//import fundPoolInfo from '@/views/fund/detail/index.vue'
import {flowXmlAndNode} from "@/api/flowable/definition";
import {
  complete,
  rejectTask,
  returnList,
  returnTask,
  getNextFlowNode,
  delegate,
  flowTaskForm,
} from "@/api/flowable/todo";
import {defineAsyncComponent} from 'vue';
const approveDetail = ref({});
const route = useRoute();
const { proxy } = getCurrentInstance();
const { approve_type } = proxy.useDict("approve_type");//下拉框字典

// 模型xml数据
const flowData = ref({});
// 切换tab标签
const activeName = ref('1');
// 遮罩层
const loading = ref(true);
// 流程流转数据
const flowRecordList = ref([]);
// 回退列表数据
const returnTaskList = ref([]);
// 审核标题
const completeTitle = ref("");
// 审核弹框
const completeOpen = ref(false);
// 退回标题
const returnTitle = ref("");
// 退回弹窗
const returnOpen = ref(false);
// 驳回弹框
const rejectOpen = ref(false);
// 驳回标题
const rejectTitle = ref("");
// 是否展示人员选择模块
const checkSendUser = ref(false);
// 是否展示角色选择模块
const checkSendRole = ref(false);
// 选择类型
const checkType = ref("single");
// 任务节点
const taskName = ref("");
// 发起人信息
const startUser = ref("");
// 会签节点
const multiInstanceVars = ref("");
// 表单json
const formJson = ref({});
// 表单渲染器
const vFormRef = ref(null);

const data1 = reactive({
  approveInfo:{
    "approveId":null,
    "approveType":null
  }
});ref("");
const { approveInfo } = toRefs(data1);

const iconStyle = computed(() => {
      const marginMap = {
        large: '8px',
        default: '6px',
        small: '4px',
      }
      return {
        marginRight: marginMap.small,
      }
})

const data = reactive({
  // 查询参数
  taskForm: {
    returnTaskShow: false, // 是否展示回退表单
    delegateTaskShow: false, // 是否展示回退表单
    defaultTaskShow: true, // 默认处理
    comment: "", // 意见内容
    procInsId: "", // 流程实例编号
    instanceId: "", // 流程实例编号
    deployId: "",  // 流程定义编号
    taskId: "",// 流程任务编号
    procDefId: "",  // 流程编号
    targetKey: "",
    variables: {},
  },
});

const { taskForm } = toRefs(data);

if (route.query) {
  taskName.value = route.query.taskName;
  startUser.value = route.query.startUser;
  taskForm.value.deployId = route.query.deployId;
  taskForm.value.taskId = route.query.taskId;
  taskForm.value.procInsId = route.query.procInsId;
  taskForm.value.executionId = route.query.executionId;
  taskForm.value.instanceId = route.query.procInsId;
  // 流程任务获取变量信息
  if (taskForm.value.taskId) {
    getFlowTaskForm(taskForm.value.taskId)
  }
  getFlowRecordList(taskForm.value.procInsId, taskForm.value.deployId);
}


/** tab点击 */
function handleClick(tab, event) {
  if (tab.props.name === '3') {
    flowXmlAndNode({procInsId: taskForm.value.procInsId, deployId: taskForm.value.deployId}).then(res => {
      flowData.value = res.data;
    })
  }
}

/** 设置icon */
function setIcon(val) {
  if (val) {
    return "el-icon-check";
  } else {
    return "el-icon-time";
  }
}

/** 设置color */
function setColor(val) {
  if (val) {
    return "#2bc418";
  } else {
    return "#b3bdbb";
  }
}

/** 用户信息选中数据 */
const userSelect = (selection) => {
  if (selection) {
    if (selection instanceof Array) {
      const selectVal = selection.map(item => item.userId.toString());
      if (multiInstanceVars.value) {
        Reflect.set(taskForm.value.variables, multiInstanceVars.value, selectVal);
      } else {
        Reflect.set(taskForm.value.variables, "approval", selectVal.join(','));
      }
    } else {
      Reflect.set(taskForm.value.variables, "approval", selection.userId.toString());
    }
  }
}

/** 角色信息选中数据 */
const roleSelect = (selection, name) => {
  if (selection) {
    if (selection instanceof Array) {
      const selectVal = selection.map(item => item.roleId.toString());
      Reflect.set(taskForm.value.variables, "approval", selectVal.join(','));
    } else {
      Reflect.set(taskForm.value.variables, "approval", selection);
    }
  }
}

/** 流程流转记录 */
function getFlowRecordList(procInsId, deployId) {
  const params = {procInsId: procInsId, deployId: deployId}
  flowRecord(params).then(res => {
    flowRecordList.value = res.data.flowList;
  }).catch(res => {
    goBack();
  })
}

/** 流程节点表单 */
function getFlowTaskForm(taskId) {
  if (taskId) {
    // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
    flowTaskForm({taskId: taskId}).then(res => {
      // 回显表单
      vFormRef.value.setFormJson(res.data.formJson);
      formJson.value = res.data.formJson;
      console.log(res.data.formData);
	  console.log(res.data.formData.type)
	  console.log("======================")
      if(res.data.formData){
        if(res.data.formData.type == "fundPool"){
          approveDetail.value = defineAsyncComponent(()=>{
            return import ('@/views/fund/detail/index.vue');
          });
        }else if(res.data.formData.type == "fundDraw"){
          approveDetail.value = defineAsyncComponent(()=>{
            return import ('@/views/fund/draw/detail/index.vue');
          });
        }else if(res.data.formData.type == "fundPay"){
          approveDetail.value = defineAsyncComponent(()=>{
            return import ('@/views/fund/repayment/detail/index.vue');
          });
        }else if(res.data.formData.type == "contract"){
          approveDetail.value = defineAsyncComponent(()=>{
            return import ('@/views/contract/detail/index.vue');
          });
        }else if(res.data.formData.type == "customerCredit"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/customer/credit/detail.vue');
			});
		}else if(res.data.formData.type == "projectDue"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/diligence/detail/index.vue');
			});
		}else if(res.data.formData.type == "projectDueAdjust"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/diligence/adjust/index.vue');
			});
		}else if(res.data.formData.type == "debtInfo"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/debt/detail/index.vue');
			});
		}else if(res.data.formData.type == "debtLoan"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/loan/detail/index.vue');
			});
		}else if(res.data.formData.type == "loanRisk"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/postLoan/risk/detail/index.vue');
			});
		}else if(res.data.formData.type == "loanExtraction"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/finance/interest/detail/index.vue');
			});
		}else if(res.data.formData.type == "debtAdjust"){
			approveDetail.value = defineAsyncComponent(()=>{
			  return import ('@/views/debt/adjust/detail.vue');
			});
		}
        approveInfo.value.approveId = res.data.formData.id;
      }

      proxy.$nextTick(() => {
        // 加载表单填写的数据
        vFormRef.value.setFormData(res.data);
        // $nextTick(() => {
        //   // 表单禁用
        //   $refs.vFormRef.disableForm();
        // })
      })
    });
  }
}

/** 委派任务 */
function handleDelegate() {
  taskForm.value.delegateTaskShow = true;
  taskForm.value.defaultTaskShow = false;
}

/** 认领任务 */
function handleAssign() {

}

/** 驳回任务 */
function handleReject() {
  rejectOpen.value = true;
  rejectTitle.value = "驳回流程";
}

/** 驳回任务 */
function taskReject() {
  proxy.$refs["taskFormRef"].validate(valid => {
    if (valid) {
      rejectTask(taskForm.value).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        goBack();
      });
    }
  });
}

/** 可退回任务列表 */
function handleReturn() {
  returnOpen.value = true;
  returnTitle.value = "退回流程";
  returnList(taskForm.value).then(res => {
    returnTaskList.value = res.data;
  })
}

/** 提交退回任务 */
function taskReturn() {
  proxy.$refs["taskFormRef"].validate(valid => {
    if (valid) {
      returnTask(taskForm.value).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        goBack()
      });
    }
  });
}

/** 取消回退任务按钮 */
function cancelTask() {
  taskForm.value.returnTaskShow = false;
  taskForm.value.defaultTaskShow = true;
  returnTaskList.value = [];
}

/** 委派任务 */
function submitDeleteTask() {
  proxy.$refs["taskFormRef"].validate(valid => {
    if (valid) {
      delegate(taskForm.value).then(response => {
        proxy.$modal.msgSuccess(response.msg);
        goBack();
      });
    }
  });
}

/** 取消回退任务按钮 */
function cancelDelegateTask() {
  taskForm.value.delegateTaskShow = false;
  taskForm.value.defaultTaskShow = true;
  returnTaskList.value = [];
}

/** 加载审批任务弹框 */
function handleComplete() {
  completeOpen.value = true;
  completeTitle.value = "流程审批";
}

/** 用户审批任务 */
function taskComplete() {
  if (!taskForm.value.variables.approveResult) {
    proxy.$modal.msgError("请选择审核意见!");
    return;
  }
  if (!taskForm.value.variables && checkSendUser.value) {
    proxy.$modal.msgError("请选择流程接收人员!");
    return;
  }
  if (!taskForm.value.variables && checkSendRole.value) {
    proxy.$modal.msgError("请选择流程接收角色组!");
    return;
  }
  if (!taskForm.value.comment) {
    proxy.$modal.msgError("请输入审批说明!");
    return;
  }
  if (taskForm.value) {
    complete(taskForm.value).then(response => {
      proxy.$modal.msgSuccess(response.msg);
      goBack();
    });
  }
  //submitForm();
  // else {
  //   complete(taskForm.value).then(response => {
  //     proxy.$modal.msgSuccess(response.msg);
  //     goBack();
  //   });
  // }
}

/** 申请流程表单数据提交 */
function submitForm() {
  // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
  getNextFlowNode({taskId: taskForm.value.taskId}).then(res => {
    const data = res.data;
    console.log(data)
    if (data) {
      vFormRef.value.getFormData().then(formData => {
        Object.assign(taskForm.value.variables, formData);
        taskForm.value.variables.formJson = formJson.value;
        console.log(taskForm.value, "流程审批提交表单数据1")
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
        }
      }).catch(error => {
        // proxy.$modal.msgError(error)
      })
    }
  })
}

/** 关闭当前标签页并返回上个页面 */
function goBack() {
  checkSendUser.value = false;
  completeOpen.value = false;
  checkSendRole.value = false;
  const obj = {path: "/task/todo", query: { t: Date.now()}};
  proxy.$tab.closeOpenPage(obj);
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

.cell-item {
  display: flex;
  align-items: center;
}
</style>
<style>
	.app-container{
		height: auto !important;
		overflow: initial !important;
	}
</style>