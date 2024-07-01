<template>
  <div class="app-container">
    <el-card class="box-card" >
      <template v-slot:header>
        <div class="clearfix">
          <span class="document">已办任务</span>
          <el-button style="float: right;" size="small" type="danger" @click="goBack">关闭</el-button>
        </div>
      </template>
      <el-tabs  tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <!--<el-tab-pane label="表单信息" name="1">
          <el-col :span="16" :offset="4">
              <v-form-render ref="vFormRef"/>
          </el-col>
        </el-tab-pane>-->
        <!--流程流转记录-->
        <el-tab-pane label="流转记录" name="2">
          <el-col :span="16" :offset="4" >
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(item,index ) in flowRecordList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)"
                >
                  <p style="font-weight: 700">{{item.taskName}}</p>
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
        <el-tab-pane label="流程图" name="3">
          <bpmn-viewer :flowData="flowData" :procInsId="taskForm.procInsId"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup name="FinishedDetail">
import {flowRecord} from "@/api/flowable/finished";
import {getProcessVariables, flowXmlAndNode} from "@/api/flowable/definition";
import BpmnViewer from '@/components/Process/viewer';
const route = useRoute();
const { proxy } = getCurrentInstance();

// 模型xml数据
const flowData = ref({});
// 切换tab标签
const activeName = ref('2');
// 遮罩层
const loading = ref(true);
// 流程流转数据
const flowRecordList = ref([]);
// 表单json
const formJson = ref({});
// 表单渲染器
const vFormRef = ref(null);


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
    multiple: false,
    comment:"", // 意见内容
    procInsId: "", // 流程实例编号
    instanceId: "", // 流程实例编号
    deployId: "",  // 流程定义编号
    taskId: "" ,// 流程任务编号
    procDefId: "",  // 流程编号
    vars: "",
  },
});

const { taskForm } = toRefs(data);


taskForm.value.deployId = route.query && route.query.deployId;
taskForm.value.taskId  = route.query && route.query.taskId;
taskForm.value.procInsId = route.query && route.query.procInsId;
// 流程任务重获取变量表单
if (taskForm.value.taskId){
  processVariables( taskForm.value.taskId)
}
getFlowRecordList( taskForm.value.procInsId, taskForm.value.deployId);

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

/** 流程流转记录 */
function getFlowRecordList(procInsId, deployId) {
  const params = {procInsId: procInsId, deployId: deployId}
  flowRecord(params).then(res => {
    flowRecordList.value = res.data.flowList;
  }).catch(res => {
    goBack();
  })
}

/** 获取流程变量内容 */
function processVariables(taskId) {
  if (taskId) {
    // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
    getProcessVariables(taskId).then(res => {
      proxy.$nextTick(() => {
        // 回显表单
        vFormRef.value.setFormJson(res.data.formJson);
        proxy.$nextTick(() => {
          // 加载表单填写的数据
          vFormRef.value.setFormData(res.data);
          proxy.$nextTick(() => {
            // 表单禁用
            vFormRef.value.disableForm();
          })
        })
      })
    });
  }
}

/** 关闭当前标签页并返回上个页面 */
function goBack() {
  const obj = { path: "/task/finished", query: { t: Date.now()} };
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
