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
      <el-table-column label="交易批次号" align="center" prop="dealNo" fixed min-width="240" />
      <el-table-column label="交易入账日" align="center" prop="dealDate" fixed min-width="120" />
      <el-table-column label="待转付价款总余额" align="center" prop="totalBalance" min-width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.totalBalance) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" min-width="240" />
      <el-table-column label="债务人" align="center" prop="agreeDebtorName" min-width="240" />
      <el-table-column label="买入方" align="center" prop="customerId" min-width="240">
        <template #default="scope">
          <dict-tag :options="customerOptions" :value="scope.row.customerId" />
        </template>
      </el-table-column>
      <el-table-column label="业务合同号" align="center" prop="contractNo" min-width="240" />
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
import { listData } from "@/api/postLoan/transfer"
import { getCusList } from "@/api/postLoan/payment"
import { formatMoney } from "@/utils/formatMoney"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_currency_type, lend_buss_product } = proxy.useDict('sys_currency_type', 'lend_buss_product');//下拉框字典

const loanList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const customerOptions = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    voucherNo: "",
    dealDateStr: null,
    factoringApplicantName: "",
    accountDebtorName: "",
    contractNo: "",
    bussProduct: null
    // params: {
    //   dueStartDate: "",
    //   dueEndDate: "",
    // }
  },
  paramsItems: [
    {
      type: "text",
      label: "交易批次号",
      prop: "dealNo",
      placeholder: "请输入交易批次号",
    },
    {
      type: "date",
      label: "交易入账日",
      prop: "dealDateStr",
      placeholder: "请选择交易入账日",
      format: "YYYY-MM-DD",
    },
    {
      type: "text",
      label: "保理申请人",
      prop: "factoringApplicantName",
      placeholder: "请输入保理申请人",
    },
    {
      type: "text",
      label: "债务人名称",
      prop: "agreeDebtorName",
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
    customerList()
  }
})


const { queryParams, paramsItems } = toRefs(data);


// 查询相关事件
function customerList() {
  getCusList().then(res => {
    customerOptions.value = res.rows.map(item => ({label: item.customerName, value: String(item.customerId), elTagType: "", elTagClass: ""}))
    // console.log('客户列表',customerOptions.value)
  })
}

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
  router.push({ path: '/postLoan/soldOut/transfer/detail', query: { loanId: _id, pageNum: queryParams.value.pageNum } });
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
customerList();
</script>