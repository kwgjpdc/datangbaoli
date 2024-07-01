<template>
  <div class="app-container">
    <QueryParams :queryParams="queryParams"
                 :paramsItems="paramsItems"
                 :showSearch="showSearch"
                 @handleQuery="handleQuery"
                 @resetQuery="resetQuery"></QueryParams>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="Plus"
                   @click="openAdd"
                   v-hasPermi="['postLoan:identify:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="Delete"
                   :disabled="ids.length === 0"
                   @click="handleDelete"
                   v-hasPermi="['postLoan:identify:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :data="loanList"
              @selection-change="handleSelectionChange">
      <!-- <el-table-column type="index" fixed width="60" align="center" label="序号" /> -->
      <el-table-column type="selection"
                       width="50"
                       align="center" />
      <el-table-column label="应收账款同意书编号"
                       align="center"
                       prop="agreementNo"
                       fixed
                       width="180" />
      <el-table-column label="保理申请人"
                       align="center"
                       prop="factoringApplicantName"
                       fixed
                       width="180" />
      <el-table-column label="业务产品"
                       align="center"
                       prop="bussProduct"
                       width="180">
        <template #default="scope">
          <dict-tag :options="lend_buss_product"
                    :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="币种"
                       align="center"
                       prop="loanCurrency">
        <template #default="scope">
          <dict-tag :options="sys_currency_type"
                    :value="scope.row.loanCurrency" />
        </template>
      </el-table-column>
      <el-table-column label="放款金额"
                       align="center"
                       prop="loanAmount"
                       width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.loanAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款余额"
                       align="center"
                       prop="loanBalance"
                       width="150">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.loanBalance) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请放款日"
                       align="center"
                       prop="loanApplyDate"
                       width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanApplyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日"
                       align="center"
                       prop="loanExpireDate"
                       width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务标识卖断"
                       align="center"
                       prop="sell"
                       min-width="120">
        <template #default="scope">
          <dict-tag :options="buss_mark_sell"
                    :value="scope.row.sell" />
        </template>
      </el-table-column>
      <el-table-column label="业务标识买回"
                       align="center"
                       prop="buy"
                       min-width="150">
        <template #default="scope">
          <dict-tag :options="buss_mark_buy"
                    :value="scope.row.buy" />
        </template>
      </el-table-column>
      <el-table-column label="业务标识1"
                       align="center"
                       prop="identifyOne"
                       min-width="120">
        <template #default="scope">
          <dict-tag :options="buss_mark_1"
                    :value="scope.row.identifyOne" />
        </template>
      </el-table-column>
      <el-table-column label="业务标识2"
                       align="center"
                       prop="identifyTwo"
                       min-width="120">
        <template #default="scope">
          <dict-tag :options="buss_mark_2"
                    :value="scope.row.identifyTwo" />
        </template>
      </el-table-column>
      <el-table-column label="业务标识3"
                       align="center"
                       prop="identifyThree"
                       min-width="120">
        <template #default="scope">
          <dict-tag :options="buss_mark_3"
                    :value="scope.row.identifyThree" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="120">
        <template #default="scope">
          <div class="button-display">

            <el-button link
                       type="primary"
                       icon="Edit"
                       @click="handleUpdate(scope.row)"
                       v-hasPermi="['postLoad:identify:edit']">修改</el-button>
            <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['debt:loan:remove']">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList" />

    <!-- 新增操作 放款列表弹窗 -->
    <el-dialog v-model="loanDialogFlag"
               title="放款列表"
               class="loan-dialog">
      <el-table :data="loanData"
                v-loading="loanLoading">
        <el-table-column type="index"
                         fixed
                         width="60"
                         align="center"
                         label="序号" />
        <el-table-column label="放款编号"
                         align="center"
                         prop="loanNo"
                         fixed
                         width="180" />
        <el-table-column label="币种"
                         align="center"
                         prop="loanCurrency">
          <template #default="scope">
            <dict-tag :options="sys_currency_type"
                      :value="scope.row.loanCurrency" />
          </template>
        </el-table-column>
        <el-table-column label="放款金额"
                         align="center"
                         prop="loanAmountApply"
                         width="150">
          <template #default="scope">
            <span>{{ formatMoney(scope.row.loanAmountApply) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款到期日"
                         align="center"
                         prop="loanExpireDate"
                         width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         class-name="small-padding fixed-width"
                         fixed="right"
                         width="120">
          <template #default="scope">
            <div class="button-display">
              <el-button link
                         type="primary"
                         icon="plus"
                         @click="handleAdd(scope.row)"
                         v-hasPermi="['postLoad:identify:add']">新增</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="loanTotal > 0"
                  :total="loanTotal"
                  v-model:page="loanParams.pageNum"
                  v-model:limit="loanParams.pageSize"
                  @pagination="getLoan" />
    </el-dialog>

  </div>
</template>

<script setup name="postLoan-identify">
import QueryParams from "@/components/QueryParams"
import { listInfo, delInfo, listLoan } from "@/api/postLoan/identify"
import { formatMoney } from "@/utils/formatMoney"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_currency_type, lend_buss_product, cont_pay,
  buss_mark_sell, buss_mark_buy, buss_mark_1, buss_mark_2, buss_mark_3 }
  = proxy.useDict("sys_currency_type", "lend_buss_product", "cont_pay",
    "buss_mark_sell", "buss_mark_buy", "buss_mark_1", "buss_mark_2", "buss_mark_3");//下拉框字典

const loading = ref(true);
const loanList = ref([]);
const showSearch = ref(true);
const total = ref(0);

const ids = ref([]);
const agreementNos = ref([]);
const single = ref(true);
const multiple = ref(true);

// 放款列表弹窗
const loanDialogFlag = ref(false)
const loanLoading = ref(true)
const loanData = ref([])
const loanTotal = ref(0);

const data = reactive({
  loanParams: {
    pageNum: 1,
    pageSize: 10
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    agreementNo: null,
    bussProduct: null,
    factoringApplicantName: null,
    loanCurrency: "1",
    sell: null,
    buy: null,
    identifyOne: null,
    identifyTwo: null,
    identifyThree: null
  },
  paramsItems: [
    {
      type: "text",
      label: "应收账款同意书编号",
      prop: "agreementNo",
      placeholder: "请输入应收账款同意书编号",
    },
    {
      type: "text",
      label: "保理申请人",
      prop: "factoringApplicantName",
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
    },
    {
      type: "select",
      label: "业务标识卖断",
      prop: "sell",
      placeholder: "请选择",
      options: buss_mark_sell
    },
    {
      type: "select",
      label: "业务标识买回",
      prop: "buy",
      placeholder: "请选择",
      options: buss_mark_buy
    },
    {
      type: "select",
      label: "业务标识1",
      prop: "identifyOne",
      placeholder: "请选择",
      options: buss_mark_1
    },
    {
      type: "select",
      label: "业务标识2",
      prop: "identifyTwo",
      placeholder: "请选择",
      options: buss_mark_2
    },
    {
      type: "select",
      label: "业务标识3",
      prop: "identifyThree",
      placeholder: "请选择",
      options: buss_mark_3
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


const { loanParams, queryParams, paramsItems } = toRefs(data);

/** 查询放款查询列表 */
function getList() {
  loading.value = true;
  listInfo(queryParams.value).then(response => {
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

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.loanIdentifyId);
  agreementNos.value = selection.map(item => item.agreementNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 查看按钮操作 */
function handleView(row) {
  const _id = row.loanId
  router.push({ path: '/postLoan/risk/detail', query: { loanId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

// 新增按钮操作
function openAdd() {
  loanDialogFlag.value = true
  getLoan()
}
// 放款新增
function handleAdd(row) {
  const _id = row.id
  router.push({ path: '/postLoan/identify/detail', query: { loanId: _id, pageNum: queryParams.value.pageNum } });
}

// 获取放款列表
function getLoan() {
  loanLoading.value = true;
  listLoan(loanParams.value).then(response => {
    loanData.value = response.rows;
    loanTotal.value = response.total;
    loanLoading.value = false;
  });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const _id = row.loanIdentifyId
  router.push({ path: '/postLoan/identify/detail', title: '修改放款业务标识', query: { loanIdentifyId: _id, pageNum: queryParams.value.pageNum } });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  const _agreementNos = row.agreementNo || agreementNos.value;
  proxy.$modal.confirm('是否确认删除应收账款同意书编号为"' + _agreementNos + '"的数据项？').then(function () {
    return delInfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('debt/loan/export', {
//     ...queryParams.value
//   }, `loan_${new Date().getTime()}.xlsx`)
// }

getList();
</script>

<style lang="scss" scoped>
:deep(.loan-dialog.el-dialog) {
    width: 80%;
    max-width: 800px;
  }
.loan-dialog {
  .pagination-container {
    position: relative !important;
  }
}
</style>