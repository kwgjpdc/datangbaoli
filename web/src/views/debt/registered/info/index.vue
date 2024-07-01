<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="140px">
      <el-form-item label="应收账款同意书编号" prop="agreementNo">
        <el-input v-model="queryParams.agreementNo" placeholder="请输入应收账款同意书编号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="债务人" prop="agreeDebtorName">
        <el-input v-model="queryParams.agreeDebtorName" placeholder="请输入债务人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="业务产品" prop="bussProduct">
        <el-select v-model="queryParams.bussProduct" filterable :style="{ width: '240px' }" placeholder="请选择">
          <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上报时间">
        <el-date-picker v-model="reportTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" :style="{ width: '240px' }"></el-date-picker>
      </el-form-item>
      <el-form-item label="上报状态" prop="reportStatus">
        <el-select v-model="queryParams.reportStatus" placeholder="请选择" clearable :style="{ width: '240px' }">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in sys_online_status" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch" @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="registeredList">
      <el-table-column type="index" align="center" fixed width="60" label="序号" />
      <el-table-column label="业务类型" align="center" fixed width="160" prop="bussType">
        <template #default="scope">
          <dict-tag :options="registered_buss_type" :value="scope.row.bussType" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款同意书编号" fixed width="180" align="center" prop="agreementNo"/>
      <el-table-column label="保理申请人" width="180" align="center" prop="factoringApplicantName" />
      <el-table-column label="债务人" align="center" width="120" prop="agreeDebtorName" />
      <el-table-column label="业务产品" align="center" width="180" prop="bussProduct">
        <template #default="scope">
          <dict-tag :options="lend_buss_product" :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="币种" align="center" prop="loanCurrencyType">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrencyType" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款金额" align="center" width="120" prop="debtReceivableAmount">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.debtReceivableAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款金额" align="center" width="120" prop="loanAmount">
        <template #default="scope">
          <span>{{ formatMoney(scope.row.loanAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计放款日" align="center" prop="loanExpectDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日" align="center" prop="loanExpireDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽限期到期日" align="center" prop="periodDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记时间" align="center" prop="reportTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记状态" align="center" prop="reportStatus">
        <template #default="scope">
          <dict-tag :options="sys_online_status" :value="scope.row.reportStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['debt:info:view']">查看</el-button>
            <el-button link type="primary" icon="DocumentChecked" @click="handleUpdate(scope.row)"
              v-hasPermi="['debt:info:edit']" v-if="scope.row.reportStatus == '1'">登记</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['debt:info:edit']"
              v-if="scope.row.reportStatus == '2' || scope.row.reportStatus == '3'">变更</el-button>
            <el-button link type="primary" icon="DocumentDelete" @click="handleCancel(scope.row)"
              v-hasPermi="['debt:info:edit']" v-if="scope.row.reportStatus == '2' || scope.row.reportStatus == '3'">注销</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script setup name="Registered">
import { listRegistered } from "@/api/debt/registered"
import { formatMoney } from "@/utils/formatMoney"
import QueryParams from "@/components/QueryParams"
import { deepClone } from "@/utils/index"
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const registeredList = ref([]);

const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
// 字典数据引用
const { lend_buss_product, sys_currency_type, sys_online_status, registered_buss_type } = proxy.useDict('lend_buss_product', 'sys_currency_type', 'sys_online_status', 'registered_buss_type');
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    agreementNo: null,
    factoringApplicantName: null,
    agreeDebtorName: null,
    bussProduct: null,
    reportTime: [],
    reportStatus: '',
    params: {}
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
      type: "text",
      label: "债务人",
      prop: "agreeDebtorName",
      placeholder: "请输入债务人",
    },
    {
      type: "select",
      label: "业务产品",
      prop: "bussProduct",
      placeholder: "请选择",
      options: lend_buss_product
    },
    {
      type: "daterange",
      label: "登记时间",
      prop: "reportTime",
      placeholder: ["开始日期", "结束日期"],
      format: "YYYY-MM-DD",
    },
    {
      type: "select_all",
      label: "上报状态",
      prop: "reportStatus",
      placeholder: "请选择",
      options: sys_online_status
    }
  ]
});

const { queryParams, paramsItems } = toRefs(data);
const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    queryParams.value.reportTime = [];
    proxy.resetForm("queryRef");
    getList();
  }
})
/** 查询应收账款要素调整列表 */
function getList() {
  loading.value = true;
  let paramsData = deepClone(queryParams.value)
  delete paramsData.reportTime
  if (null != queryParams.value.reportTime && '' != queryParams.value.reportTime) {
    paramsData.params["reportTimeStart"] = queryParams.value.reportTime[0];
    paramsData.params["reportTimeEnd"] = queryParams.value.reportTime[1];
  }else {
    paramsData.params["reportTimeStart"] = '';
    paramsData.params["reportTimeEnd"] = '';
  }
  listRegistered(paramsData).then(response => {
    registeredList.value = response.rows;
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

// 查看页面
function handleView(row) {
  console.log(row);
  const debtId = row.debtId
  const _id = row.id
  router.push({ path: '/debt/registered/detail', query: { registrationId: _id, debtId: debtId, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 登记，变更按钮操作 */
function handleUpdate(row) {
  const debtId = row.debtId
  const _id = row.id
  router.push({ path: '/debt/registered/detail', query: { registrationId: _id, debtId: debtId, pageNum: queryParams.value.pageNum } });
}

/** 注销按钮操作 */
function handleCancel(row) {
  const debtId = row.debtId
  const _id = row.id
  router.push({ path: '/debt/registered/detail', query: { registrationId: _id, debtId: debtId, cancelFlag: true, pageNum: queryParams.value.pageNum } });
}

getList();
</script>
