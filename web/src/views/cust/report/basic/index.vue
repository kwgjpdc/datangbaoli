<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户编号" prop="customerNo">
        <div @click="openDiag('customerNo')">
          <el-input v-model="queryParams.customerNo" placeholder="请选择客户编号" clearable readonly  suffix-icon="el-icon-search"></el-input>
        </div>

      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <div @click="openDiag('customerName')">
          <el-input v-model="queryParams.customerName" placeholder="请选择客户名称" clearable readonly  suffix-icon="el-icon-search"></el-input>
        </div>

      </el-form-item>
      <el-form-item label="导入日期" style="width: 308px">
        <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['cust:report:add']">新增</el-button>
      </el-col>


      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cust:report:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="客户财务报表ID，主键" align="center" prop="reportId" />  -->
      <el-table-column label="报表编号" align="center" prop="reportNo" fixed width="170"><template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.reportNo }}</el-button> </template>
      </el-table-column>
      <!-- <el-table-column label="关联的客户ID" align="center" prop="customerId" />-->
      <el-table-column label="客户编号" align="center" prop="customerNo" width="120" />
      <el-table-column label="客户名称" align="center" prop="customerName" />

      <el-table-column label="报表类型" align="center" prop="reportType">
        <template #default="scope">
          <dict-tag :options="cust_report_type" :value="scope.row.reportType" v-if="scope.row.reportType" />
        </template>
      </el-table-column>

      <el-table-column label="年份" align="center" prop="reportYear" />
      <el-table-column label="季度" align="center" prop="reportQuarter" />
      <el-table-column label="月份" align="center" prop="reportMonth" />
      <el-table-column label="导入人" align="center" prop="createBy" />
      <el-table-column label="导入日期" align="center" prop="createTime" >
        <template #default="scope">
               <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="150">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Download" @click="handleExport(scope.row)"
              v-hasPermi="['cust:report:export']">导出</el-button>
            <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['cust:report:remove']">编辑</el-button> -->
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['cust:report:remove']">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableData"
      v-model:prop="propMulti" @selectRow="selectRow" @pageChange="pageChange" />
  </div>
</template>

<script setup name="Report">
import { listReport, getReport, delReport, addReport, updateReport } from "@/api/customer/report";
import { listInfo as getUserList } from "@/api/customer/index"
const { proxy } = getCurrentInstance();
import useUserStore from '@/store/modules/user'
const reportList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCreateTime = ref([]);
const route = useRoute();
const router = useRouter();
let multiQuery = ref({
  title: "客户信息",//标题
  open: false,
  currentPage: 1,
  total: 1,
  pageSize: 10,
});
const propMulti = ref([{
  label: '客户编号',
  value: 'customerNo'
}, {
  label: '客户名称',
  value: 'customerName'
}]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerNo: null,
    customerName: null,
    createTime: null,
  },
  rules: {
    customerNo: [
      { required: true, message: "关联的客户编号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { cust_report_type } = proxy.useDict("cust_report_type");//下拉框字典
/** 查询客户财务报表列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  listReport(queryParams.value).then(response => {
    reportList.value = response.rows;
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
    reportId: null,
    reportNo: null,
    customerId: null,
    customerNo: null,
    customerName: null,
    reportType: null,
    reportYear: null,
    reportQuarter: null,
    reportMonth: null,
    reserve1: null,
    reserve2: null,
    reserve3: null,
    reserve4: null,
    reserve5: null,
    createBy: null,
    createById: null,
    updateBy: null,
    updateById: null,
    updateTime: null,
    createTime: null,
    delFlag: null
  };
  proxy.resetForm("reportRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreateTime.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.reportNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // open.value = true;
  // title.value = "添加客户财务报表";
  router.push({ path: '/customer/report/detail', query: { pageNum: queryParams.value.pageNum } });
}

// 查看页面
function handleView(row) {
  reset();
  const _reportId = row.reportId || ids.value
  router.push({ path: '/customer/report/detail', query: { reportId: _reportId, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // const _reportId = row.reportId || ids.value
  // getReport(_reportId).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改客户财务报表";
  // });
  const _reportId = row.reportId || ids.value
  router.push({ path: '/customer/report/detail', query: { reportId: _reportId, pageNum: queryParams.value.pageNum } });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["reportRef"].validate(valid => {
    if (valid) {
      if (form.value.reportId != null) {
        updateReport(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addReport(form.value).then(response => {
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
  const _reportIds = row.reportNo || ids.value;
  proxy.$modal.confirm('是否确认删除客户财务报表编号为"' + _reportIds + '"的数据项？').then(function () {
    return delReport(row.reportId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport(rows) {
  const fileUrl = rows.commonFileList
  [0].fileUrl;
  console.log(fileUrl)
  proxy.$download.resource(fileUrl);
  // proxy.download('cust/report/export', {
  //   ...queryParams.value
  // }, `report_${new Date().getTime()}.xlsx`)
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
  if (options == 'customerName') {
    multiQuery.value.title = "客户信息";
  } else if (options == 'customerNo') {
    multiQuery.value.title = "客户信息";
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

  queryParams.value.customerName = rows.customerName
  queryParams.value.customerNo = rows.customerNo



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