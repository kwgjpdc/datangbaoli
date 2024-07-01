<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="业务合同号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入业务合同号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="放款编号" prop="loanNo">
        <el-input v-model="queryParams.loanNo" placeholder="请输入放款编号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="业务产品" prop="bussProduct">
        <el-select v-model="queryParams.bussProduct" filterable placeholder="请选择业务产品">
          <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable
          @keyup.enter="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['debt:loan:add']"
        >新增</el-button>
      </el-col> -->

      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loanList" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="55" align="center" label="序号" />
	  <el-table-column label="业务合同号" align="center" prop="contractNo" />
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" />
      <el-table-column label="业务产品" align="center" prop="bussProduct"> <template #default="scope">
          <!-- lend_buss_product -->
          <dict-tag :options="lend_buss_product" :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="放款编号" align="center" prop="loanNo" />
      <el-table-column label="币种" align="center" prop="loanCurrency">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
        </template>
      </el-table-column>
      <el-table-column label="放款金额" align="center" prop="loanAmountApply" />
      <el-table-column label="放款申请日" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日" align="center" prop="loanExpireDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="状态" align="center" prop="status"> 
		<template #default="scope">
	      <dict-tag :options="debt_loan_status" :value="scope.row.status" />
	    </template>
	  </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['debt:loan:edit']">录入</el-button>
            <el-button link type="primary" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['debt:loan:edit']">查看</el-button>
            <!-- <el-button link type="primary" icon="Delete" @click="handleView(scope.row)" v-hasPermi="['debt:loan:remove']">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script setup name="Loan">
import { listResult, delResult } from "@/api/debt/result";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loanList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: null,
    loanNo: null,
    productName: null,
    factoringApplicantName: null,
    createById: null,
    updateById: null,
  },
});

const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    proxy.resetForm("queryRef");
    getList();
  }
})


const { queryParams} = toRefs(data);


const { sys_currency_type, lend_buss_product, proj_dd_status,debt_loan_status } = proxy.useDict('sys_currency_type', 'lend_buss_product', 'proj_dd_status','debt_loan_status');//下拉框字典

/** 查询放款查询列表 */
function getList() {
  loading.value = true;
  listResult(queryParams.value).then(response => {
    loanList.value = response.rows;
    total.value = response.total;
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  router.push({ name: 'Loan/result/detail', state: { pageNum: queryParams.value.pageNum } });
}
/** 新增按钮操作 */
function handleView(row) {
  const _loanId = row.id || ids.value
  router.push({ name: 'Loan/result/detail', state: { loanId: _loanId, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const _loanId = row.id || ids.value
  router.push({ name: 'Loan/result/detail', state: { loanId: _loanId, pageNum: queryParams.value.pageNum } });
}


/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除放款查询编号为"' + _ids + '"的数据项？').then(function () {
    return delResult(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('debt/loan/export', {
    ...queryParams.value
  }, `loan_${new Date().getTime()}.xlsx`)
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
