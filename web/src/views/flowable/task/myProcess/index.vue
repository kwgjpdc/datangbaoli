<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
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
          @click="handleAdd"
          v-hasPermi="['system:deployment:add']"
        >新增流程</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deployment:remove']"
        >删除</el-button>
      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="myProcessData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流程编号" align="center" prop="procInsId" :show-overflow-tooltip="true"/>
      <el-table-column label="流程名称" align="center" prop="procDefName" :show-overflow-tooltip="true"/>
      <el-table-column label="流程类别" align="center" prop="category" width="100px" />
      <el-table-column label="流程版本" align="center" width="80px">
        <template #default="scope">
          <el-tag size="small" >v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createTime" width="180"/>
      <el-table-column label="流程状态" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.finishTime == null" size="small">进行中</el-tag>
          <el-tag type="success" v-if="scope.row.finishTime != null" size="small">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center" prop="duration" width="180"/>
      <el-table-column label="当前节点" align="center" prop="taskName"/>
      <el-table-column label="办理人" align="center">
        <template #default="scope">
          <label v-if="scope.row.assigneeName">{{scope.row.assigneeName}} <el-tag type="info" size="small">{{scope.row.assigneeDeptName}}</el-tag></label>
<!--          <label v-if="scope.row.candidate">{{scope.row.candidate}}</label>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button @click="handleFlowRecord(scope.row)" link type="primary" size="small">详情</el-button>
          <!--<el-button @click="handleStop(scope.row)" link type="primary" size="small">取消申请</el-button>
          <el-button @click="handleDelete(scope.row)" link type="primary" size="small" v-hasPermi="['system:deployment:remove']">删除</el-button>-->
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

    <!-- 发起流程 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body>
      <el-form :model="queryProcessParams" ref="queryProcessForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryProcessParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleProcessQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetProcessQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="processLoading" fit :data="definitionList" border >
        <el-table-column label="流程名称" align="center" prop="name" />
        <el-table-column label="流程版本" align="center">
          <template #default="scope">
            <el-tag size="small" >v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流程分类" align="center" prop="category" />
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              size="small"
              link type="primary"
              icon="EditOutline"
              @click="handleStartProcess(scope.row)"
            >发起流程</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal>0"
        :total="processTotal"
        v-model:page="queryProcessParams.pageNum"
        v-model:limit="queryProcessParams.pageSize"
        @pagination="getListDefinition"
      />
    </el-dialog>

  </div>
</template>

<script setup name="MyProcess">
import { delDeployment, flowRecord } from "@/api/flowable/finished";
import { myProcessList,stopProcess } from "@/api/flowable/process";
// import { listFundDrawInfo } from "@/api/flowable/definition";
import { listFundDrawInfo } from "@/api/fund/info";
import router from "@/router";

const { proxy } = getCurrentInstance();

// 遮罩层
const loading = ref(true);
const processLoading = ref(true);
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
const processTotal = ref(0);
// 我发起的流程列表数据
const myProcessData = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
const src = ref("");
const definitionList = ref([]);

const data = reactive({
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
  // 查询参数
  queryProcessParams: {
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
});

const { queryParams, queryProcessParams } = toRefs(data);

/** 查询流程定义列表 */
function getList() {
  loading.value = true;
  myProcessList(queryParams.value).then(response => {
    myProcessData.value = response.data.records;
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
  proxy.resetForm("queryForm");
  handleQuery();
}

/** 搜索按钮操作 */
function handleProcessQuery() {
  queryProcessParams.value.pageNum = 1;
  getListDefinition();
}

/** 重置按钮操作 */
function resetProcessQuery() {
  proxy.resetForm("queryProcessForm");
  handleProcessQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.procInsId)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  open.value = true;
  title.value = "发起流程";
  getListDefinition();
}

function getListDefinition(){
  listFundDrawInfo(queryProcessParams.value).then(response => {
    definitionList.value = response.data.records;
    processTotal.value = response.data.total;
    processLoading.value = false;
  });
}

/**  发起流程申请 */
function handleStartProcess(row){
  router.push({ path: '/flowable/task/myProcess/send/index',
    query: {
      deployId: row.deploymentId,
      procDefId: row.id
    }
  })
}

/**  取消流程申请 */
function handleStop(row){
  const params = {
    instanceId: row.procInsId
  }
  stopProcess(params).then( res => {
    proxy.$modal.msgSuccess(res.msg);
    getList();
  });
}

/** 流程流转记录 */
function handleFlowRecord(row){
  router.push({ path: '/flowable/task/myProcess/detail/index',
    query: {
      procInsId: row.procInsId,
      deployId: row.deployId,
      taskId: row.taskId
    }})
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.procInsId || ids.value;// 暂不支持删除多个流程
  proxy.$confirm('是否确认删除流程定义编号为"' + _ids + '"的数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    return delDeployment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

getList();

</script>


