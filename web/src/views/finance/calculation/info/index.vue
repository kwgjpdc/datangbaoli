<template>
  <div class="app-container"
       v-loading="pageLoading">
    <QueryParams :queryParams="queryParams"
                 :paramsItems="paramsItems"
                 :showSearch="showSearch"
                 @handleQuery="handleQuery"
                 @resetQuery="resetQuery"
                 @changeParams="changeParams"></QueryParams>

    <el-row :gutter="10"
            class="mb8"
            style="margin-top: 15px">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="Upload"
                   @click="handleExport"
                   v-hasPermi="['finance:calculation:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="PieChart"
                   @click="handleCal"
                   v-hasPermi="['finance:calculation:add']">试算</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="Delete"
                   @click="handleClear"
                   v-hasPermi="['finance:calculation:remove']">清空试算数据</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading"
              :data="resultData">
      <el-table-column type="index"
                       width="55"
                       label="序号"
                       align="center"
                       fixed="left" />
      <el-table-column label="业务合同"
                       prop="contractNo"
                       align="center"
                       min-width="180"
                       fixed="left" />
      <el-table-column label="放款编号"
                       prop="loanNo"
                       align="center"
                       min-width="240" />
      <el-table-column label="保理业务书同意编号"
                       prop="agreementNo"
                       align="center"
                       min-width="180" />
      <el-table-column label="核心企业"
                       prop="coreEnterpriseName"
                       align="center"
                       min-width="240" />
      <el-table-column label="保理申请人名称"
                       prop="factoringApplicantName"
                       align="center"
                       min-width="180" />
      <el-table-column label="当期收息日"
                       prop="calculationDate"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.calculationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行利率"
                       prop="strikeRate"
                       align="center"
                       min-width="120">
        <template #default="scope">
          <span>{{formatPercent(scope.row.strikeRate)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="尚欠利息"
                       prop="ownAmount"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <span>{{formatMoney(scope.row.ownAmount)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款方式"
                       prop="loanWay"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <dict-tag :options="cont_pay"
                    :value="scope.row.loanWay" />
        </template>
      </el-table-column>
      <el-table-column label="结息方式"
                       prop="settleInterestWay"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <dict-tag :options="cont_interest_settlement"
                    :value="scope.row.settleInterestWay" />
        </template>
      </el-table-column>
      <el-table-column label="放款日"
                       prop="loanExpectDate"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanExpectDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日"
                       prop="loanExpireDate"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款余额"
                       prop="loanBalance"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <span>{{formatMoney(scope.row.loanBalance)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务产品"
                       prop="bussProduct"
                       align="center"
                       min-width="180">
        <template #default="scope">
          <dict-tag :options="lend_buss_product"
                    :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款凭证编号"
                       prop="voucherNo"
                       align="center"
                       min-width="240" />
      <el-table-column label="试算计算天数"
                       prop="calculationDays"
                       align="center"
                       fixed="right"
                       min-width="120" />

      <el-table-column label="试算计算金额"
                       prop="calculationAmount"
                       align="center"
                       fixed="right"
                       min-width="120">
        <template #default="scope">
          <span v-if="scope.row.calculationAmount && scope.row.calculationAmount !== ''">{{formatMoney(scope.row.calculationAmount)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList" />
  </div>
</template>

<script setup>
import { listData, calculationList, emptyData, exportInfo } from "@/api/finance/calculation";
import { deepClone } from "@/utils/index";
import dayjs from "dayjs";
import { formatMoney, formatPercent } from "@/utils/formatMoney";
import QueryParams from "@/components/QueryParams";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { lend_buss_product, cont_interest_settlement, cont_pay } = proxy.useDict("lend_buss_product", "cont_interest_settlement", "cont_pay");//下拉框字典

const pageLoading = ref(false);
const loading = ref(true);
const resultData = ref([]);
const showSearch = ref(true);
const total = ref(0);

const ids = ref([])
const single = ref(true);
const multiple = ref(true);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: "",
    factoringApplicantName: "",
    loanNo: "",
    bussProduct: "",
    settleInterestWays: [],
    calculationDate: "",
    params: {
      settleInterestWays: ""
    }
  },
  paramsItems: [
    {
      type: "text",
      label: "业务合同号",
      prop: "contractNo",
      placeholder: "请输入业务合同号",
    },
    {
      type: "text",
      label: "保理申请人",
      prop: "factoringApplicantName",
      placeholder: "请输入保理申请人",
    },
    {
      type: "text",
      label: "放款编号",
      prop: "loanNo",
      placeholder: "请输入放款编号",
    },
    {
      type: "select",
      label: "业务产品",
      prop: "bussProduct",
      placeholder: "请选择业务产品",
      options: lend_buss_product
    },
    {
      type: "checkbox",
      label: "结息方式",
      prop: "settleInterestWays",
      placeholder: "请选择结息方式",
      options: cont_interest_settlement,
      colSpan: 24
    },
    {
      type: "date",
      label: "试算收息日",
      prop: "calculationDate",
      placeholder: "请选择试算收息日",
      format: "YYYY-MM-DD",
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

/** 查询列表 */
function getList() {
  loading.value = true;
  let dataParams = deepClone(queryParams.value)
  if (dataParams.settleInterestWays && dataParams.settleInterestWays.length > 0) {
    dataParams.params.settleInterestWays = dataParams.settleInterestWays.join(",")
  } else {
    dataParams.params.settleInterestWays = ""
  }
  delete dataParams.settleInterestWays
  listData(dataParams).then(response => {
    resultData.value = response.rows;
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

// 查询子组件的参数改变
function changeParams(params) {
  queryParams.value = params
}


// 试算操作
function handleCal() {
  loading.value = true
  const calParams = deepClone(queryParams.value)
  if (calParams.settleInterestWays && calParams.settleInterestWays.length > 0) {
    calParams.params.settleInterestWays = calParams.settleInterestWays.join(",")
  } else {
    calParams.params.settleInterestWays = null
  }
  delete calParams.settleInterestWays
  if (calParams.calculationDate && calParams.calculationDate !== "") {
    proxy.$modal.confirm(`是否试算收息日为${calParams.calculationDate}的利息`).then(function () {
      return calculationList(calParams)
    }).then(() => {
      getList()
      loading.value = false
    })
  } else {
    loading.value = false
    proxy.$modal.msgError('试算收息日不能为空')
  }
}

// 清空操作
function handleClear() {
  proxy.$modal.confirm('是否确认清空当前的试算数据？').then(function () {
    return emptyData()
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("清空成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('loan/calculation/export', {
    ...queryParams.value
  }, `利息试算_${new Date().getTime()}.xlsx`)
}


getList();
</script>