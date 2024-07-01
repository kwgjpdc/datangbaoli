<template>
  <div class="app-container">
    <QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch" @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['postLoan:financing:add']">新增</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loanList">
      <el-table-column type="index" fixed width="60" align="center" label="序号" />
      <el-table-column label="放款编号" align="center" prop="loanNo" fixed width="180" />
      <el-table-column label="业务产品" align="center" prop="bussProduct" width="180"> 
        <template #default="scope">
          <dict-tag :options="lend_buss_product" :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="币种" align="center" prop="loanCurrency">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.debtReceivableAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款余额" align="center" prop="loanAmount" width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.loanAmount) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="放款申请日" align="center" prop="loanApplyDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanApplyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日" align="center" prop="loanExpireDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['postLoad:financing:edit']">录入</el-button>
            <el-button link type="primary" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['postLoad:financing:edit']">查看</el-button>
            <!-- <el-button link type="primary" icon="Delete" @click="handleView(scope.row)" v-hasPermi="['debt:loan:remove']">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script setup name="postLoan-financing">
import QueryParams from "@/components/QueryParams"
import { listRepay } from "@/api/postLoan/financing"
import { formatMoney } from "@/utils/formatMoney"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_currency_type, lend_buss_product } = proxy.useDict('sys_currency_type', 'lend_buss_product');//下拉框字典

const loading = ref(true);
const loanList = ref([]);
const showSearch = ref(true);
const total = ref(0);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    loanCurrency: "1",
    bussProduct: null,
    factoringApplicantName: null,
    createById: null,
    updateById: null,
  },
  paramsItems: [
  {
      type: "text",
      label: "保理申请人",
      prop: "factoringApplicantName",
      enterFlag: true,
      placeholder: "请输入保理申请人",
    },
    {
      type: "select",
      label: "业务产品",
      prop: "bussProduct",
      placeholder: "请选择",
      options: lend_buss_product
    },
    {
      type: "select",
      label: "币种",
      prop: "loanCurrency",
      placeholder: "请选择",
      options: sys_currency_type
    }
  ]
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


const { queryParams, paramsItems } = toRefs(data);

/** 查询放款查询列表 */
function getList() {
  loading.value = true;
  listRepay(queryParams.value).then(response => {
    loanList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 搜索按钮操作 */
function handleQuery(params) {
  if (params) {
    queryParams.value = params
  }
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery(params) {
  handleQuery(params);
}

/** 查看按钮操作 */
function handleView(row) {
  const _id = row.loanId
  router.push({ path: '/postLoan/financing/detail', query: { loanId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 录入按钮操作 */
function handleUpdate(row) {
  const _id = row.loanId
  router.push({ path: '/postLoan/financing/detail', query: { loanId: _id, pageNum: queryParams.value.pageNum } });
}


/** 删除按钮操作 */
// function handleDelete(row) {
//   const _ids = row.id || ids.value;
//   proxy.$modal.confirm('是否确认删除放款查询编号为"' + _ids + '"的数据项？').then(function () {
//     return delEntry(_ids);
//   }).then(() => {
//     getList();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => { });
// }

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('debt/loan/export', {
//     ...queryParams.value
//   }, `loan_${new Date().getTime()}.xlsx`)
// }

getList();
</script>