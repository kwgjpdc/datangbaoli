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
                   icon="Plus"
                   @click="handleAdd"
                   v-hasPermi="['finance:interest:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="Delete"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['finance:interest:delete']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="Upload"
                   @click="handleExport"
                   v-hasPermi="['finance:interest:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="DataLine"
                   @click="handleMonthData"
                   v-hasPermi="['finance:interest:add']">生成当月预提数据</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="Position"
                   :disabled="multiple"
                   @click="handleSend"
                   v-hasPermi="['finance:interest:send']">发送凭证</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch"
                     @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 利息预提列表 -->
    <div v-if="!monthFlag">
      <el-table v-loading="loading"
                :data="resultData"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center"
                         fixed="left"
                         :selectable="checkSelectable" />
        <el-table-column label="保理申请人名称"
                         prop="factoringApplicantName"
                         align="center"
                         fixed="left"
                         min-width="180" />
        <el-table-column label="核心企业"
                         prop="coreEnterpriseName"
                         align="center"
                         min-width="240" />
        <el-table-column label="业务合同"
                         prop="contractNo"
                         align="center"
                         min-width="180" />
        <el-table-column label="业务产品"
                         prop="bussProduct"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <dict-tag :options="lend_buss_product"
                      :value="scope.row.bussProduct" />
          </template>
        </el-table-column>
        <el-table-column label="放款编号"
                         prop="loanNo"
                         align="center"
                         min-width="180" />
        <el-table-column label="应收账款同意书编号"
                         prop="agreementNo"
                         align="center"
                         min-width="240" />
        <el-table-column label="执行利率"
                         prop="strikeRate"
                         align="center"
                         min-width="120">
          <template #default="scope">
            <span>{{formatPercent(scope.row.strikeRate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提利息"
                         prop="extractionAmount"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{formatMoney(scope.row.extractionAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款金额"
                         prop="loanAmount"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{formatMoney(scope.row.loanAmount)}}</span>
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
        <el-table-column label="结息方式"
                         prop="settleInterestWay"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <dict-tag :options="cont_interest_settlement"
                      :value="scope.row.settleInterestWay" />
          </template>
        </el-table-column>
        <el-table-column label="预提起始日"
                         prop="extractionStartDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.extractionStartDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提结束日"
                         prop="extractionEndDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.extractionEndDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提天数"
                         prop="extractionDays"
                         align="center"
                         min-width="180" />
        <el-table-column label="申请放款日"
                         prop="loanApplyDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanApplyDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期日"
                         prop="loanExpireDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
		<el-table-column label="状态" align="center" prop="status">
			<template #default="scope">
				<dict-tag :options="proj_dd_status" :value="scope.row.status" />
			</template>
		</el-table-column>
        <el-table-column label="操作"
                         align="center"
                         min-width="180"
                         fixed="right">
          <template #default="scope">
            <div class="button-display">
              <!-- 数据发送凭证后，不可操作 -->
              <el-button type="primary"
                         link
                         @click="handleEdit(scope.row)"
                         :disabled="scope.row.extractionVoucherId && scope.row.extractionVoucherId !== ''">修改</el-button>
              <el-button type="danger"
                         link
                         @click="handleDelete(scope.row)"
                         :disabled="scope.row.extractionVoucherId && scope.row.extractionVoucherId !== ''">删除</el-button>
              <!-- 数据发送凭证后，不可操作 -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize"
                  @pagination="getList" />
    </div>
    <!-- 利息预提列表 end-->
    <!-- 当月预提数据列表 -->
    <div v-else>
      <el-table v-loading="loading"
                :data="monthData"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center"
                         fixed="left"
                         :selectable="checkSelectable" />
        <el-table-column label="保理申请人名称"
                         prop="factoringApplicantName"
                         align="center"
                         fixed="left"
                         min-width="180" />
        <el-table-column label="核心企业"
                         prop="coreEnterpriseName"
                         align="center"
                         min-width="240" />
        <el-table-column label="业务合同"
                         prop="contractNo"
                         align="center"
                         min-width="180" />
        <el-table-column label="业务产品"
                         prop="bussProduct"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <dict-tag :options="lend_buss_product"
                      :value="scope.row.bussProduct" />
          </template>
        </el-table-column>
        <el-table-column label="放款编号"
                         prop="loanNo"
                         align="center"
                         min-width="180" />
        <el-table-column label="应收账款同意书编号"
                         prop="agreementNo"
                         align="center"
                         min-width="240" />
        <el-table-column label="执行利率"
                         prop="strikeRate"
                         align="center"
                         min-width="120">
          <template #default="scope">
            <span>{{formatPercent(scope.row.strikeRate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提利息"
                         prop="extractionAmount"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{formatMoney(scope.row.extractionAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款金额"
                         prop="loanAmount"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{formatMoney(scope.row.loanAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="返款余额"
                         prop="loanBalance"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{formatMoney(scope.row.loanBalance)}}</span>
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
        <el-table-column label="预提起始日"
                         prop="extractionStartDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.extractionStartDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提结束日"
                         prop="extractionEndDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.extractionEndDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预提天数"
                         prop="extractionDays"
                         align="center"
                         min-width="180" />
        <el-table-column label="申请放款日"
                         prop="loanApplyDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanApplyDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期日"
                         prop="loanExpireDate"
                         align="center"
                         min-width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         min-width="180"
                         fixed="right">
          <template #default="scope">
            <div class="button-display">
              <!-- 数据发送凭证后，不可操作 -->
              <el-button type="primary"
                         link
                         @click="handleEdit(scope.row)"
                         :disabled="scope.row.extractionVoucherId && scope.row.extractionVoucherId !== ''">修改</el-button>
              <el-button type="danger"
                         link
                         @click="handleDelete(scope.row)"
                         :disabled="scope.row.extractionVoucherId && scope.row.extractionVoucherId !== ''">删除</el-button>
              <!-- 数据发送凭证后，不可操作 -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="monthTotal > 0"
                  :total="monthTotal"
                  v-model:page="monthParams.pageNum"
                  v-model:limit="monthParams.pageSize"
                  @pagination="getListMonth" />
    </div>
    <!-- 当月预提数据列表 end-->
  </div>
</template>

<script setup>
import { listData, send, delInfo, listMonth, exportInfo } from "@/api/finance/interest";
import { deepClone } from "@/utils/index";
import {toRaw} from "@vue/reactivity";
import dayjs from "dayjs";
import { formatMoney, formatPercent } from "@/utils/formatMoney";
import QueryParams from "@/components/QueryParams";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { lend_buss_product, cont_interest_settlement, proj_dd_status } = proxy.useDict("lend_buss_product", "cont_interest_settlement", "proj_dd_status");//下拉框字典

const pageLoading = ref(false);
const loading = ref(true);
const resultData = ref([]);
const showSearch = ref(true);
const total = ref(0);

const ids = ref([])
const single = ref(true);
const multiple = ref(true);
const tableSelection = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: "",
    factoringApplicantName: "",
    loanNo: "",
    agreementNo: "",
    loanApplyDate: [],
    extractionMonth: dayjs(new Date()).format("YYYY-MM"),
    params: {
      loanApplyStartDate: "",
      loanApplyEndDate: "",
      extractionMonth: dayjs(new Date()).format("YYYY-MM")
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
      type: "text",
      label: "应收账款同意书编号",
      prop: "agreementNo",
      placeholder: "请输入应收账款同意书编号",
    },
    {
      type: "daterange",
      label: "申请放款日",
      prop: "loanApplyDate",
      placeholder: ["开始日期", "结束日期"],
      format: "YYYY-MM-DD",
    },
    {
      type: "month",
      format: "YYYY-MM",
      label: "预提月",
      prop: "extractionMonth",
      placeholder: "请选择预提月"
    }
  ]
});

const monthFlag = ref(false)
const monthParams = ref({
  pageNum: 1,
  pageSize: 10,
  params: { extractionMonth: "" }
})
const monthTotal = ref(0)
const monthData = ref([])

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
  if (dataParams.loanApplyDate && dataParams.loanApplyDate.length > 0) {
    dataParams.params.loanApplyStartDate = dataParams.loanApplyDate[0]
    dataParams.params.loanApplyEndDate = dataParams.loanApplyDate[1]
  }
  delete dataParams.loanApplyDate
  if (dataParams.extractionMonth && dataParams.extractionMonth !== "") {
    dataParams.params.extractionMonth = dataParams.extractionMonth
  } else {
    dataParams.params.extractionMonth = ""
  }
  delete dataParams.extractionMonth
  listData(dataParams).then(response => {
    resultData.value = response.rows;
    total.value = response.total;
    loading.value = false;
    monthFlag.value = false;
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


// 发送凭证操作
function handleSend() {
  pageLoading.value = true
  const sendParams = {
    extractionMonth: "",
    subList: tableSelection.value
  }
  if (queryParams.value.extractionMonth && queryParams.value.extractionMonth !== "") {
    sendParams.extractionMonth = queryParams.value.extractionMonth
    send(sendParams).then(response => {
      pageLoading.value = false
      proxy.$modal.msgSuccess('发送凭证成功！')
      getList()
    }).catch(() => {
      // proxy.$msgError('请联系后台管理人员！')
      pageLoading.value = false
    })
  } else {
    pageLoading.value = false
    proxy.$modal.msgError('预提月不能为空')
  }
}
// 判断数据是否可操作
function checkSelectable(row) {
  return !(row.extractionVoucherId && row.extractionVoucherId !== "")
}

// 新增操作
function handleAdd() {
  resetQuery();
  router.push({ path: '/finance/interest/detail', query: { pageNum: queryParams.value.pageNum } });
}

// 修改操作
function handleEdit(row) {
  resetQuery();
  router.push({ path: '/finance/interest/detail', query: { extractionId: row.extractionId, pageNum: queryParams.value.pageNum } });
}

// 多选操作
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.extractionId);
  tableSelection.value = selection.map(item => toRaw(item))
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 删除操作
function handleDelete(row) {
  const _ids = row.extractionId || ids.value
  proxy.$modal.confirm('是否确认删除所选择数据的预提信息？').then(function () {
    return delInfo(_ids)
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

// 生成当月预提数据 按钮操作
function handleMonthData() {
  loading.value = true;
  if (!monthFlag.value) {
    submitMonth()
  } else {
    const monthTip = monthParams.value.params.extractionMonth
    proxy.$modal.confirm(`${monthTip} 已存在预提数据，是否清空重算？`)
      .then(() => {
        submitMonth()
      }).catch(() => {
        loading.value = false
      });
  }
}
// 生成当月预提数据 提交
function submitMonth() {
  const currentM = dayjs(new Date()).format("YYYY-MM")
  queryParams.value.extractionMonth = currentM
  queryParams.value.params.extractionMonth = currentM
  monthParams.value.params.extractionMonth = currentM
  monthParams.value.pageNum = 1
  getListMonth().then(()=>{
    monthFlag.value = true;
    proxy.$modal.msgSuccess("已生成！");
  }).catch(()=>{
    monthFlag.value = false
  })
}

// 生成当月预提数据 列表查询
function getListMonth() {
  loading.value = true;
  let dataParams = deepClone(monthParams.value)
  return listMonth(dataParams).then(response => {
    monthData.value = response.rows;
    monthTotal.value = response.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false
  });
}

/** 导出按钮操作 */
function handleExport() {
  let exportParams =  {...queryParams.value},
      documentName = "利息预提"
  if (monthFlag.value) {
    exportParams = deepClone(monthParams.value)
    exportParams.params.exportMonth = exportParams.params.extractionMonth
    documentName = "当月预提"
  }
  proxy.download('loan/extraction/export', {
    ...exportParams
  }, `${documentName}_${new Date().getTime()}.xlsx`)
}

getList();
</script>