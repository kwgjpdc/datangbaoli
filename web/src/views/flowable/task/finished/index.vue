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

    <!--<el-row :gutter="10" class="mb8">
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
    </el-row>-->

    <el-table v-loading="loading" :data="finishedListData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" align="center" prop="taskId" :show-overflow-tooltip="true"/>
      <el-table-column label="流程名称" align="center" prop="procDefName" :show-overflow-tooltip="true"/>
      <el-table-column label="任务节点" align="center" prop="taskName" />
      <el-table-column label="流程发起人" align="center">
        <template #default="scope">
          <label>{{scope.row.startUserName}} <el-tag type="info" size="small">{{scope.row.startDeptName}}</el-tag></label>
        </template>
      </el-table-column>
      <el-table-column label="接收时间" align="center" prop="createTime" width="180"/>
      <el-table-column label="审批时间" align="center" prop="finishTime" width="180"/>
      <el-table-column label="耗时" align="center" prop="duration" width="180"/>
      <el-table-column label="操作" width="100" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            size="small"
            type="primary"
            icon="Tickets"
            @click="handleFlowRecord(scope.row)"
          >流转记录</el-button>
           <!--<el-button
             link
             size="small"
             type="primary"
             icon="RefreshLeft"
             @click="handleRevoke(scope.row)"
          >撤回
          </el-button>-->
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
  </div>
</template>

<script setup name="Finished">
import { finishedList, delDeployment, revokeProcess } from "@/api/flowable/finished";
import router from "@/router";
const { proxy } = getCurrentInstance();

// 遮罩层
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
// 流程待办任务表格数据
const finishedListData = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);

const data = reactive({
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null
  },
});

const { queryParams } = toRefs(data);

/** 查询流程定义列表 */
function getList() {
  loading.value = true;
  finishedList(queryParams.value).then(response => {
    finishedListData.value = response.data.records;
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

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 流程流转记录 */
function handleFlowRecord(row){
  router.push({ path: '/flowable/task/finished/detail/index',
    query: {
      procInsId: row.procInsId,
      deployId: row.deployId,
      taskId: row.taskId,
    }})
}

/** 撤回任务 */
function handleRevoke(row){
  const params = {
    instanceId: row.procInsId
  }
  revokeProcess(params).then( res => {
    proxy.$modal.msgSuccess(res.msg);
    getList();
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$confirm('是否确认删除流程定义编号为"' + _ids + '"的数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return delDeployment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

getList();
</script>


