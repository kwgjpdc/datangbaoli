<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
    
      <el-form-item label="业务合同号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入业务合同号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="核心企业" prop="coreEnterpriseName">
        <el-input
          v-model="queryParams.coreEnterpriseName"
          placeholder="请输入核心企业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="借款人" prop="accountDebtorName">
        <el-input
          v-model="queryParams.accountDebtorName"
          placeholder="请输入借款人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input
          v-model="queryParams.factoringApplicantName"
          placeholder="请输入保理申请人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有效" prop="validFlag">
        <el-select v-model="queryParams.validFlag" placeholder="请选择是否有效" clearable >
          <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
     
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
    
      
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loanList" @selection-change="handleSelectionChange" >
      <el-table-column type="index" width="55" align="center" label="序号" fixed />
      <!-- <el-table-column label="业务合同号" align="center" prop="contract.otherContractNo" fixed width="150"/>
      <el-table-column label="合同名称" align="center" prop="contract.otherContractName" /> -->
	  <el-table-column label="业务合同号" align="center" prop="contractNo" fixed width="150"/>
	  <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="应收账款同意书编号" align="center" prop="agreementNo" />
      <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" />
      <el-table-column label="应收账款余额" align="center" prop="debtReceivableBalance" />
      <el-table-column label="放款金额" align="center" prop="loanAmount" />
      <el-table-column label="放款时间"  align="center" prop="lastLoanTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastLoanTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上会时间"  align="center" prop="meetingTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.meetingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保理申请人" align="center" prop="voucherList[0].factoringApplicantName" />
      <el-table-column label="债务人" align="center" prop="contract.agreeDebtorName" />
      <el-table-column label="中登网上报状态" align="center" prop="status" >
        <!-- sys_online_status -->
        <template #default="scope">
          <dict-tag :options="sys_online_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否有效" align="center" prop="validFlag" >
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.validFlag" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template #default="scope">
          <div class="button-display">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" >申请放款</el-button>
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" >查看</el-button>
        </div>
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

<script setup name="Loan">
import { listLoan, getLoan, delLoan, addLoan, updateLoan } from "@/api/debt/loan";

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
    loanNo: null,
    contractId: null,
    debtId: null,
    documentType: null,
    factoringTarget: null,
    interest: null,
    loanExpectDate: null,
    loanExpireDate: null,
    isDirect: null,
    directName: null,
    directBank: null,
    directAccount: null,
    transferStart: null,
    transferEnd: null,
    transferAmount: null,
    paymentAccount: null,
    actualAmountReceived: null,
    loanAmountApply: null,
    comprehensiveIncome: null,
    status: null,
    createById: null,
    updateById: null,
  },
  rules: {
  }
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


const { queryParams,  rules } = toRefs(data);
const { sys_online_status,sys_yes_no } = proxy.useDict("sys_online_status","sys_yes_no");//下拉框字典

/** 查询放款查询列表 */
function getList() {
  loading.value = true;
  listLoan(queryParams.value).then(response => {
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
  router.push({ name: 'Loan/detail/index', state: { pageNum: queryParams.value.pageNum } });
}
/** 新增按钮操作 */
function handleView(row) {
  const _debtId = row.id || ids.value
  router.push({ name: 'Loan/detail/index', state: {debtId: _debtId, viewFlag: true,  pageNum: queryParams.value.pageNum } });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const _debtId = row.id || ids.value
  router.push({ name: 'Loan/detail/index', state: {debtId: _debtId,  pageNum: queryParams.value.pageNum } });
}


/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除放款查询编号为"' + _ids + '"的数据项？').then(function() {
    return delLoan(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
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
