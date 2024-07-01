<template>
  <div class="app-container">
    <!-- 查询表单组件 -->
    <QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch"
      @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>
    <!-- 查询表单组件 end-->
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="SoldOut" @click="handleAdd"
          v-hasPermi="['postLoan:soldOut:add']">卖出保理资产</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loanList">
      <el-table-column type="index" fixed width="60" align="center" label="序号" />
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" fixed min-width="240" />
      <el-table-column label="债务人" align="center" prop="accountDebtorName" min-width="240" />
      <el-table-column label="币种" align="center" prop="loanCurrency" min-width="100">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
        </template>
      </el-table-column>
      <el-table-column label="业务产品" align="center" prop="bussProduct" min-width="180">
        <template #default="scope">
          <dict-tag :options="lend_buss_product" :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="业务合同号" align="center" prop="contractNo" min-width="240" />
      <el-table-column label="放款笔数" align="center" prop="loan" min-width="120" />
      <el-table-column label="放款总余额" align="center" prop="loanBalance" min-width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.loanBalance) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="120">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['postLoad:sell:edit']">录入</el-button>
            <!-- <el-button link type="info" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['postLoad:buyer:view']">查看</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />


  </div>
</template>

<script setup>
import QueryParams from "@/components/QueryParams"
import { listData } from "@/api/postLoan/repayment"
import { formatMoney } from "@/utils/formatMoney"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_currency_type, lend_buss_product } = proxy.useDict('sys_currency_type', 'lend_buss_product');//下拉框字典

const loanList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    factoringApplicantName: "",
    accountDebtorName: "",
    contractNo: "",
    bussProduct: null
  },
  paramsItems: [
    {
      type: "text",
      label: "保理申请人",
      prop: "factoringApplicantName",
      placeholder: "请输入保理申请人",
    },
    {
      type: "text",
      label: "债务人名称",
      prop: "accountDebtorName",
      placeholder: "请输入债务人名称",
    },
    {
      type: "text",
      label: "业务合同号",
      prop: "contractNo",
      placeholder: "请输入业务合同号",
    },
    {
      type: "select",
      label: "业务产品",
      prop: "bussProduct",
      placeholder: "请选择",
      options: lend_buss_product
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


// 查询相关事件

/** 查询放款查询列表 */
function getList() {
  loading.value = true;
  listData(queryParams.value).then(response => {
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
  // proxy.resetForm("queryRef");
  handleQuery(params);
}

// 查询相关事件 end

/** 新增按钮操作 */
function handleSell() {
  const _id = row.loanId
  router.push({ path: '/postLoan/buyer/detail', query: { loanId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 查看按钮操作 */
function handleView(row) {
  const _id = row.loanId
  router.push({ path: '/postLoan/buyer/detail', query: { loanId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 录入按钮操作 */
function handleUpdate(row) {
  const _id = row.loanId
  router.push({ path: '/postLoan/soldOut/repayment/detail', query: { loanId: _id, pageNum: queryParams.value.pageNum } });
}

// 


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