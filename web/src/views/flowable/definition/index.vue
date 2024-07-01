<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
		  maxlength="32"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleLoadXml"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deployment:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-alert title="流程设计说明" type="success">
      <template #default>
        <div>1、XML文件中的流程定义id属性用作流程定义的key参数。</div>
        <div>2、XML文件中的流程定义name属性用作流程定义的name参数。如果未给定name属性，会使用id作为name。</div>
        <div>3、当每个唯一key的流程第一次部署时，指定版本为1。对其后所有使用相同key的流程定义，部署时版本会在该key当前已部署的最高版本号基础上加1。key参数用于区分流程定义。</div>
        <div>4、id参数设置为{processDefinitionKey}:{processDefinitionVersion}:{generated-id}，其中generated-id是一个唯一数字，用以保证在集群环境下，流程定义缓存中，流程id的唯一性。</div>
      </template>
    </el-alert>
    <el-table v-loading="loading" fit :data="definitionList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流程编号" align="center" prop="deploymentId" :show-overflow-tooltip="true"/>
      <el-table-column label="流程标识" align="center" prop="flowKey" :show-overflow-tooltip="true" />
      <el-table-column label="流程分类" align="center" prop="category" />
      <el-table-column label="流程名称" align="center" width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link type="primary" @click="handleReadImage(scope.row.deploymentId)">
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="业务表单" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button v-if="scope.row.formId" link type="primary" @click="handleForm(scope.row.formId)">
            <span>{{ scope.row.formName }}</span>
          </el-button>
          <label v-else>暂无表单</label>
        </template>
      </el-table-column>
      <el-table-column label="流程版本" align="center">
        <template #default="scope">
          <el-tag effect="dark">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag effect="dark" v-if="scope.row.suspensionState === 1">激活</el-tag>
          <el-tag type="danger" effect="dark" v-if="scope.row.suspensionState === 2">挂起</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180"/>
      <el-table-column label="操作" width="300" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleLoadXml(scope.row)" icon="Position"  size="small">设计</el-button>
          <el-button link type="primary" @click="handleAddForm(scope.row)" icon="Promotion" size="small" v-if="scope.row.formId == null">配置主表单</el-button>
          <el-button link type="danger" @click="handleUpdateSuspensionState(scope.row)" icon="VideoPause" size="small" v-if="scope.row.suspensionState === 1">挂起</el-button>
          <el-button link type="success" @click="handleUpdateSuspensionState(scope.row)" icon="VideoPlay" size="small" v-if="scope.row.suspensionState === 2">激活</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" icon="delete" size="small" v-hasPermi="['system:deployment:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 流程图 -->
    <el-dialog :title="readImage.title" v-model="readImage.open" width="70%" append-to-body>
      <bpmn-viewer :flowData="flowData"/>
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog :title="formTitle" v-model="formConfOpen" width="50%" append-to-body>
      <div class="test-form">
        <v-form-render :form-data="formData" ref="vFormRef"/>
      </div>
    </el-dialog>

    <!--挂载表单-->
    <el-dialog :title="formDeployTitle" v-model="formDeployOpen" width="60%" append-to-body>
      <el-row :gutter="24">
        <el-col :span="10" :xs="24">
          <el-table
            ref="singleTable"
            :data="formList"
            border
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column label="表单编号" align="center" prop="formId" />
            <el-table-column label="表单名称" align="center" prop="formName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="submitFormDeploy(scope.row)">确定</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            small
            layout="prev, pager, next"
            v-show="formTotal>0"
            :total="formTotal"
            v-model:page="formQueryParams.pageNum"
            v-model:limit="formQueryParams.pageSize"
            @pagination="ListFormDeploy"
          />
        </el-col>
        <el-col :span="14" :xs="24">
          <div class="test-form">
            <v-form-render :form-data="formData" ref="vFormCurrentRow"/>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup name="Definition">
import {
  listDefinition,
  updateState,
  delDeployment,
  flowXmlAndNode
} from "@/api/flowable/definition";
import { getForm, addDeployForm ,listForm } from "@/api/flowable/form";
import BpmnViewer from '@/components/Process/viewer';
import router from "@/router";

const { proxy } = getCurrentInstance();

const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 流程定义表格数据
const definitionList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
const formConfOpen = ref(false);
const formTitle = ref("");
const formDeployOpen = ref(false);
const formDeployTitle = ref("");
const formList = ref([]);
const formTotal = ref(0);
const deployId = ref('');
const vFormCurrentRow = ref(null);
// xml
const flowData = ref({});
const vFormRef = ref(null)

const data = reactive({
  formData: {}, // 默认表单数据
  readImage:{
    open: false,
    title: "",
  },
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    category: null,
    key: null,
    tenantId: null,
    deployTime: null,
    derivedFrom: null,
    derivedFromRoot: null,
    parentDeploymentId: null,
    engineVersion: null
  },
  formQueryParams:{
    pageNum: 1,
    pageSize: 10,
  },
  // 挂载表单到流程实例
  formDeployParam:{
    formId: null,
    deployId: null
  },
});

const { queryParams, formData, readImage, formQueryParams, formDeployParam } = toRefs(data);

/** 查询流程定义列表 */
function getList() {
  loading.value = true;
  listDefinition(queryParams.value).then(response => {
    definitionList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.deploymentId)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 跳转到流程设计页面 */
function handleLoadXml(row){
  router.push({ path: '/flowable/definition/model',query: { deployId: row.deploymentId }})
}

/** 流程图查看 */
function handleReadImage(deployId){
  readImage.value.title = "流程图";
  readImage.value.open = true;
  flowXmlAndNode({deployId:deployId}).then(res => {
    flowData.value = res.data;
  })
}

/** 表单查看 */
function handleForm(formId){
  getForm(formId).then(res =>{
    formTitle.value = "表单详情";
    formConfOpen.value = true;
    proxy.$nextTick(() => {
      // 回显数据
      vFormRef.value.setFormJson(JSON.parse(res.data.formContent))
      proxy.$nextTick(() => {
        // 表单禁用
        vFormRef.value.disableForm();
      })
    })
  })
}

/** 挂载表单弹框 */
function handleAddForm(row){
  formDeployParam.value.deployId = row.deploymentId
  ListFormDeploy();
}

/** 挂载表单 */
function submitFormDeploy(row){
  formDeployParam.value.formId = row.formId;
  addDeployForm(formDeployParam.value).then(res =>{
    proxy.$modal.msgSuccess(res.msg);
    formDeployOpen.value = false;
    getList();
  })
}

/** 挂载表单列表 */
function ListFormDeploy(){
  listForm(formQueryParams.value).then(res =>{
    formList.value = res.rows;
    formTotal.value = res.total;
    formDeployOpen.value = true;
    formDeployTitle.value = "挂载表单";
  })
}

/** 挂载表单列表 */
function handleCurrentChange(data) {
  if (data) {
    proxy.$nextTick(() => {
      // 回显数据
      vFormCurrentRow.value.setFormJson(JSON.parse(data.formContent))
      proxy.$nextTick(() => {
        // 表单禁用
        vFormCurrentRow.value.disableForm();
      })
    })
  }
}

/** 挂起/激活流程 */
function handleUpdateSuspensionState(row){
  let state = 1;
  if (row.suspensionState === 1) {
    state = 2
  }
  const params = {
    deployId: row.deploymentId,
    state: state
  }
  updateState(params).then(res => {
    proxy.$modal.msgSuccess(res.msg);
    getList();
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const deploymentIds = row.deploymentId || ids.value;
  proxy.$confirm('是否确认删除流程定义编号为"' + deploymentIds + '"的数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return delDeployment(deploymentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

getList();
</script>
