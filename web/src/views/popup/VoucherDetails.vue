<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">凭证明细</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="凭证明细" :append-to-body="true">
      <el-form class="info-form" :model="formInfo" :disabled="true" :label-width="120">
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="业务合同号" prop="contractNo">
              <el-input v-model="formInfo.contractNo" placeholder="业务合同号" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="合同名称" prop="contractNo">
              <el-input v-model="formInfo.contractNo" placeholder="合同名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="保理申请人" prop="factoringApplicantName">
              <el-input v-model="formInfo.factoringApplicantName" placeholder="保理申请人" />
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
            <el-form-item label="凭证号码" prop="contractNo">
              <el-input v-model="formInfo.contractNo" placeholder="凭证号码" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="债务人" prop="factoringApplicantName">
              <el-input v-model="formInfo.factoringApplicantName" placeholder="债务人" />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="开票日" prop="loanExpireDate">
              <el-date-picker clearable v-model="formInfo.loanExpireDate" type="date" value-format="YYYY-MM-DD" placeholder="开票日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="到期日" prop="loanExpireDate">
              <el-date-picker clearable v-model="formInfo.loanExpireDate" type="date" value-format="YYYY-MM-DD" placeholder="到期日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="凭证金额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="凭证金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="应收账款金额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="应收账款金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="应收账款余额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="应收账款余额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="担保付款金额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="担保付款金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="担保付款余额" prop="loanAmountApply">
              <ElPriceInput :form="formInfo" prop="loanAmountApply" placeholder="担保付款余额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="融资比例" prop="loanNo">
              <el-input v-model="formInfo.loanNo" placeholder="融资比例"/>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="担保到期日" prop="loanExpireDate">
              <el-date-picker clearable v-model="formInfo.loanExpireDate" type="date" value-format="YYYY-MM-DD" placeholder="担保到期日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="凭证提供方" prop="loanNo">
              <el-input v-model="formInfo.loanNo" placeholder="凭证提供方"/>
            </el-form-item>
          </el-col>
        </el-row>
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