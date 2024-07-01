<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="卖方客户名称" prop="sellCustomerName">
        <div @click="openDiag('sellCustomerName')">
          <el-input v-model="params.sellCustomerName" placeholder="请选择卖方客户名称" clearable readonly  suffix-icon="el-icon-search"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="买方客户名称" prop="buyCustomerName">
        <div @click="openDiag('buyCustomerName')">
          <el-input v-model="params.buyCustomerName" placeholder="请选择买方客户名称" clearable readonly  suffix-icon="el-icon-search"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <!-- <div @click="openDiag('projectName')">
                                        <el-input v-model="queryParams.projectName" placeholder="请选择项目名称" clearable
                                            readonly></el-input>
         </div> -->
        <el-input v-model="queryParams.projectName" placeholder="请选择项目名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="录入开始时间" style="width: 308px">
        <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>


      <el-form-item label="项目状态" prop="projectStatus">
        <el-checkbox-group v-model="projectStatusList">
          <el-checkbox v-for="dict in proj_project_status" :label="dict.value" :name="dict.value" :key="dict.value">{{
            dict.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>




      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['project:info:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['project:info:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" fixed /> -->
      <el-table-column label="项目编号" align="center" prop="projectNo" fixed width="160"> <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.projectNo }}</el-button> </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName" fixed />
      <el-table-column label="卖方客户名称" align="center" width="120">
        <template #default="scope">
          <div v-if="scope.row.sponsor == '1'">{{ scope.row.sponsorCustomerName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="买方客户名称" align="center" width="120">
        <template #default="scope">
          <div v-if="scope.row.sponsor == '2'">{{ scope.row.sponsorCustomerName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="项目主办" align="center" prop="firstChargeName" />
      <el-table-column label="所属机构" align="center" prop="deptName" />
      <el-table-column label="项目状态" align="center" prop="projectStatus">
        <template #default="scope">
          <dict-tag :options="proj_project_status" :value="scope.row.projectStatus" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template #default="scope">
          <dict-tag :options="proj_audit_status" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>



      <el-table-column label="录入人" align="center" prop="createBy" />
      <el-table-column label="录入时间" align="center" prop="createTime" width="160" />


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="150">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['project:info:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['project:info:remove']">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
    <!-- {{ multiQuery }} -->
    <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableData"
      v-model:prop="propMulti" @selectRow="selectRow" @pageChange="pageChange" />
  </div>
</template>

<script setup name="Info">
import { listProjInfo, getProjInfo, delProjInfo, addProjInfo, updateProjInfo } from "@/api/project/info";
import { listInfo as getUserList } from "@/api/customer/index"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const infoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCreateTime = ref([]);
const projectStatusList = ref([]);
const params = ref({
  sellCustomerName: "",
  buyCustomerName: "",
});
let multiQuery = ref({
  title: "卖方客户信息",//标题
  open: false,
  currentPage: 1,
  total: 1,
  pageSize: 10,
});
const propMulti = ref([{
  label: '客户编号',
  value: 'customerNo'
}, {
  label: '上级公司',
  value: 'parentCustomerName'
}, {
  label: '客户名称',
  value: 'customerName'
}]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    projectType: null,
    sponsor: null,
    sponsorCustomerId: null,
    sponsorCustomerName: null,
    projectNo: null,
    projectBeginDate: null,
    projectName: null,
    projectSource: null,
    sourceName: null,
    projectBelongCompany: null,
    firstChargeId: null,
    firstChargeName: null,
    secondChargeId: null,
    secondChargeName: null,
    ratio: null,
    mainBusiness: null,
    accountsReceivableScale: null,
    paybackMode: null,
    createById: null,
    createTime: null,
  },
  rules: {
    projectNo: [
      { required: true, message: "项目编号；根据规则生成；唯一；不能为空", trigger: "blur" }
    ],
    projectName: [
      { required: true, message: "项目名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { proj_project_status,proj_audit_status } = proxy.useDict("proj_project_status","proj_audit_status");//下拉框字典



const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    daterangeCreateTime.value = [];
    projectStatusList.value = [];
    params.value = {
      sellCustomerName: "",
      buyCustomerName: "",
    };
    proxy.resetForm("queryRef");
    getList();
  }
})


/** 查询项目立项列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  if (projectStatusList.value.length) {
    queryParams.value.params["projectStatus"] = projectStatusList.value.join(',')
  }
  queryParams.value.params["sellCustomerName"] = params.value.sellCustomerName;
  queryParams.value.params["buyCustomerName"] = params.value.buyCustomerName;

  listProjInfo(queryParams.value).then(response => {
    infoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    projectId: null,
    deptId: null,
    projectType: null,
    sponsor: null,
    sponsorCustomerId: null,
    sponsorCustomerName: null,
    projectNo: null,
    projectBeginDate: null,
    projectName: null,
    projectSource: null,
    sourceName: null,
    projectBelongCompany: null,
    firstChargeId: null,
    firstChargeName: null,
    secondChargeId: null,
    secondChargeName: null,
    ratio: null,
    mainBusiness: null,
    accountsReceivableScale: null,
    paybackMode: null,
    remark: null,
    createBy: null,
    createById: null,
    updateBy: null,
    updateById: null,
    delFlag: null,
    createTime: null,
    updateTime: null,

  };
  proxy.resetForm("queryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreateTime.value = [];
  projectStatusList.value = [];
  params.value = {
    sellCustomerName: "",
    buyCustomerName: "",
  };
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.projectId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // 
  router.push({ path: '/project/project/detail', query: { pageNum: queryParams.value.pageNum } });
}

// 查看页面
function handleView(row) {
  reset();
  const _projectId = row.projectId || ids.value
  router.push({ path: '/project/project/detail', query: { projectId: _projectId, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _projectId = row.projectId || ids.value
  router.push({ path: '/project/project/detail', query: { projectId: _projectId, pageNum: queryParams.value.pageNum } });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["infoRef"].validate(valid => {
    if (valid) {
      if (form.value.projectId != null) {
        updateProjInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProjInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _projectIds = row.projectId || ids.value;
  proxy.$modal.confirm('是否确认删除项目立项编号为"' + _projectIds + '"的数据项？').then(function () {
    return delProjInfo(_projectIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('project/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}



// 用户组件请求信息
const userParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const tableData = ref([]);
let checkItem = ref("")
// 打开用户信息选择框 请求用户信息
function openDiag(options) {
  console.log(tableData.value);
  if (!tableData.value.length) {
    loading.value = true;
    getUserList(userParams.value).then(response => {
      tableData.value = [];
      loading.value = false;
      response.rows.map((item) => {
        tableData.value.push(item)
      });
      multiQuery.value.total = response.total;

      setDialogTitle(options);
      multiQuery.value.open = true;
    });
  } else {
    setDialogTitle(options);
    multiQuery.value.open = true;
  }
  checkItem.value = options;
}
function setDialogTitle(options) {
  if (options == 'sellCustomerName') {
    multiQuery.value.title = "卖方客户信息";
  } else if (options == 'buyCustomerName') {
    multiQuery.value.title = "买方客户信息";
  }
}
// 弹出用户信息分页处理
function pageChange(page) {
  userParams.value.pageNum = page;
  loading.value = true;

  getUserList(userParams.value).then(response => {
    loading.value = false;
    tableData.value = [];
    response.rows.map((item) => {
      tableData.value.push(item)
    });
    multiQuery.value.total = response.total;
    setDialogTitle(options);
    multiQuery.value.open = true;
  });
}
// 选择了用户信息；
function selectRow(rows) {
  console.log(rows);

  if (checkItem.value == 'sellCustomerName') {
    params.value.sellCustomerName = rows.customerName

  } else if (checkItem.value == 'buyCustomerName') {

    params.value.buyCustomerName = rows.customerName
    queryParams.value.params["buyCustomerName"] = rows.customerName
  }
  // propMulti.value.forEach(element => {
  //   queryParams.value[element.value] = rows[element.value];
  // });


}

getList();
</script>
<style lang="scss" scoped>
.button-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>