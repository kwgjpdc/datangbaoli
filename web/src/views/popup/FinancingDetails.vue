<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">融资明细</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="融资明细" :append-to-body="true">
      <el-form class="info-form" :model="formInfo" :disabled="true" :label-width="120">
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="保理申请人" prop="factoringApplicantName">
              <el-input v-model="formInfo.factoringApplicantName" placeholder="保理申请人" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="业务产品" prop="bussProduct">
              <el-select v-model="formInfo.bussProduct" filterable placeholder="业务产品">
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="业务合同号" prop="contractNo">
              <el-input v-model="formInfo.contractNo" placeholder="业务合同号" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="融资到期日" prop="loanExpireDate">
              <el-date-picker clearable v-model="formInfo.loanExpireDate" type="date" value-format="YYYY-MM-DD" placeholder="放款到期日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款编号" prop="loanNo">
              <el-input v-model="formInfo.loanNo" placeholder="放款编号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款方式" prop="loanWay">
              <el-select v-model="formInfo.loanWay" filterable placeholder="放款方式">
                <el-option v-for="item in cont_pay" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="计息方式" prop="loanNo">
              <el-select v-model="formInfo.loanCurrency" filterable placeholder="计息方式">
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="币种" prop="loanCurrency">
              <el-select v-model="formInfo.loanCurrency" filterable placeholder="币种">
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="借据号" prop="loanNo">
              <el-input v-model="formInfo.loanNo" placeholder="借据号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款金额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="放款金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款余额" prop="loanBalance">
              <ElPriceInput :form="formInfo" prop="loanBalance" placeholder="放款余额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="贷款状态" prop="loanNo">
              <el-select v-model="formInfo.loanCurrency" filterable placeholder="贷款状态">
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="风险分类级别" prop="riskStatus">
              <el-select v-model="formInfo.riskStatus" filterable placeholder="风险分类级别">
                <el-option v-for="item in risk_status" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane label="客户额度信息" name="1">
            <el-table :data="tabCons.list1">
              <el-table-column label="" align="center" width="50" type="index" fixed/>
              <el-table-column label="额度批复编号" prop="no" align="center" min-width="240"/>
              <el-table-column label="额度币种" align="center" min-width="100">
                <template #default="scope">
                  <dict-tag :options="sys_currency_type" :value="scope.row.currency" />
                </template>
              </el-table-column>
              <el-table-column label="额度上限" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="授信性质" align="center" min-width="180">
                <template #default="scope">
                  <dict-tag :options="cust_credit_quality" :value="scope.row.creditNature" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="利率信息" name="2">
            <el-table :data="tabCons.list2">
              <el-table-column label="" align="center" width="50" type="index" fixed/>
              <el-table-column label="执行方" align="center" min-width="240">
                <template #default="scope">
                  <dict-tag :options="customerOptions" :value="scope.row.customerId" />
                </template>
              </el-table-column>
              <el-table-column label="执行区间" align="center" min-width="120">
                <template #default="scope">
                  <dict-tag :options="cont_interest_exec_section" :value="scope.row.interestExecSection" />
                </template>
              </el-table-column>
              <el-table-column label="利率类型" align="center" min-width="120">
                <template #default="scope">
                  <dict-tag :options="cont_interest_type" :value="scope.row.interestType" />
                </template>
              </el-table-column>
              <el-table-column label="固定利率" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatPercent(scope.row.fixedRate) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="利率周期" align="center" min-width="180">
                <template #default="scope">
                  <dict-tag :options="cont_interest_cycle"
                          :value="scope.row.rateCycle" />
                </template>
              </el-table-column>
              <el-table-column label="加减码" align="center" min-width="180">
                <template #default="scope">
                  <span v-if="scope.row.isAdd && scope.row.isAdd !== ''">加码</span>
                  <span v-else-if="scope.row.isSub && scope.row.isSub !== ''">减码</span>
                  <dict-tag v-else
                          :options="cont_if_plus_minus"
                          :value="scope.row.isAddOrSub" />
                </template>
              </el-table-column>
              <el-table-column label="加减码浮动方式" align="center" min-width="180">
                <template #default="scope">
                  <dict-tag :options="cont_plus_minus_floating"
                          :value="scope.row.floatMethod" />
                </template>
              </el-table-column>
              <el-table-column label="执行利率" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatPercent(scope.row.executeRate) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="违约利率信息" name="3">
            <el-table :data="tabCons.list3">
              <el-table-column label="" align="center" width="50" type="index" fixed/>
              <el-table-column label="执行方" align="center" min-width="240">
                <template #default="scope">
                  <dict-tag :options="customerOptions" :value="scope.row.customerId" />
                </template>
              </el-table-column>
              <el-table-column label="违约开始天数" prop="startDays" align="center" min-width="120"/>
              <el-table-column label="违约截止天数" prop="dueDays" align="center" min-width="120"/>
              <el-table-column label="违约利率周期" align="center" min-width="120">
                <template #default="scope">
                  <dict-tag :options="cont_branch_interest_cycle"
                          :value="scope.row.cycle" />
                </template>
              </el-table-column>
              <el-table-column label="违约金方式" align="center" min-width="120">
                <template #default="scope">
                  <dict-tag :options="default_penalty_method"
                        :value="scope.row.penaltyWay" />
                </template>
              </el-table-column>
              <el-table-column label="违约利率上浮比例" align="center" min-width="120">
                <template #default="scope">
                  <span>{{ formatPercent(scope.row.floatRatio) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="违约罚息率" align="center" min-width="120">
                <template #default="scope">
                  <span>{{ formatPercent(scope.row.penaltyRate) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="融资费用信息" name="4">
            <el-table :data="tabCons.list4">
              <el-table-column label="" align="center" width="50" type="index" fixed/>
              <el-table-column label="费用名目" prop="feeName" align="center" min-width="180"/>
              <el-table-column label="收费/支付对象" align="center" min-width="240">
                <template #default="scope">
                  <dict-tag :options="customerOptions" :value="scope.row.customerId" />
                </template>
              </el-table-column>
              <el-table-column label="费用币种" align="center" min-width="100">
                <template #default="scope">
                  <dict-tag :options="sys_currency_type" :value="scope.row.currency" />
                </template>
              </el-table-column>
              <el-table-column label="费用总金额" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="未收金额" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.outsAmount) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="应收账款信息" name="5">
            <el-table :data="tabCons.list5">
              <el-table-column label="" align="center" width="50" type="index" fixed />
              <el-table-column label="操作" width="240" align="center" fixed>
                <div class="flex-around-center">
                  <VoucherDetails/>
                  <Document/>
                  <Invoice/>
                </div>
              </el-table-column>
              <el-table-column label="凭证号码" prop="no" align="center" min-width="180"/>
              <el-table-column label="凭证币种" align="center" min-width="180">
                <template #default="scope">
                  <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
                </template>
              </el-table-column>
              <el-table-column label="凭证金额" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount1) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="凭证余额" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="融资余额" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount3) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="应收账款到期日" align="center" min-width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { listInfo } from "@/api/customer/index"
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import ElPriceInput from "@/components/ElPriceInput";
import { formatMoney, formatPercent } from "@/utils/formatMoney"

import VoucherDetails from "./VoucherDetails"
import Document from "./Document"
import Invoice from "./Invoice"

const route = useRoute();
const router = useRouter();
const { lend_buss_product,
  sys_currency_type,
  cont_pay, risk_status, cust_credit_quality, cont_interest_exec_section,
  cont_interest_type, cont_interest_cycle, cont_if_plus_minus,
  cont_plus_minus_floating, cont_branch_interest_cycle, default_penalty_method } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "cont_pay", "risk_status", "cust_credit_quality", "cont_interest_exec_section",
    "cont_interest_type", "cont_interest_cycle", "cont_if_plus_minus",
    "cont_plus_minus_floating", "cont_branch_interest_cycle", "default_penalty_method");//下拉框字典

const props = defineProps({
  id: {
    default: "",
  }
});

const dialogVisible = ref(false)
const activeName = ref('1')

const customerOptions = ref([])

const dataScope = reactive({
  formInfo: {},
  tabCons: {
    list1: [
      {
        no: "xxxxxxxxxxxx",
        currency: "1",
        amount: 20000,
        creditNature: "1"
      }
    ],
    list2: [
      {
        customerId:"60",
        interestExecSection:"1",
        interestType:"1",
        fixedRate:1.2,
        rateCycle:"1",
        isAdd:"1",
        isSub:"",
        isAddOrSub:"1",
        floatMethod:"1",
        executeRate:"1.56"
      }
    ],
    list3: [
      {
        customerId:"60",
        startDays: 1,
        dueDays: 111,
        cycle:"1",
        penaltyWay:"1",
        interestType:"1",
        floatRatio:1.2,
        penaltyRate:""
      }
    ],
    list4: [
      {
        feeName:"管理费",
        customerId:"60",
        currency:"1",
        amount:"2000",
        outsAmount:"100"
      }
    ],
    list5: [
      {
        no: "xxxxxxxxxxxx",
        loanCurrency: "1",
        amount1: 2000000,
        amount2: 2000000,
        amount3: 2000000,
        dueDate: "2021-09-28"
      }
    ]
  }
});

const { formInfo, tabCons } = toRefs(dataScope);

// 打开弹窗
function openDialog() {
  dialogVisible.value = true
}

// 获取客户信息列表
function getCusList() {
  listInfo().then(res => {
    customerOptions.value = res.rows.map(item => ({label: item.customerName, value: String(item.customerId), elTagType: "", elTagClass: ""}))
    // console.log('客户列表',customerOptions.value)
  })
}

getCusList()

</script>
<style lang="scss" scoped>
@import "../../assets/styles/infoForm.scss";
</style>