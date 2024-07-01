<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="费用信息" name="1">
        <el-row :gutter="15">
          <el-col :span="24" :xs="24">
            <el-table :data="formData.feeList" style="margin-bottom: 20px;margin-top: 15px;">
              <el-table-column label="序号" align="center" type="index" :width="80" />
              <el-table-column label="费用名目" align="center" prop="feeName" :width="160">
              </el-table-column>
              <el-table-column label="是否本次收取" align="center" prop="isCharge" min-width="120">
                <template #default="scope">
                  <el-select v-model="scope.row.isCharge" filterable placeholder="请选择">
                    <el-option v-for="item in sys_yes_no" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>

                </template>
              </el-table-column>
              <el-table-column label="币种" align="center" prop="loanCurrency" min-width="120">
                <template #default="scope">
                  <el-select v-model="scope.row.loanCurrency" filterable placeholder="请选择">
                    <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>

                </template>
              </el-table-column>
              <el-table-column label="费用总金额" align="center" prop="entryAmount" min-width="240">
                <template #default="scope">
                  <el-form-item class="only-input-content" :prop="`feeList.${scope.$index}.entryAmount`" :rules="rules.entryAmount">
                    <ElPriceInput :form="scope.row" prop="entryAmount" placeholder="请输入" :rules="rules.entryAmount" :disabled="props.routerQueryObj.viewFlag"></ElPriceInput>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="收费/支付对象" align="center" prop="customerName" min-width="300">
                <template #default="scope">
					<el-input v-model="scope.row.customerName" suffix-icon="el-icon-search" readonly :disabled="true"/>
                  <!-- <CustomerSelect :option="customer.option" :showValue="scope.row.customerName" 
                    :queryPropList="customer.queryPropList" :tablePropList="customer.tablePropList"
                    @selectRow="customerSelect($event,scope.row)"></CustomerSelect> -->
                </template>
              </el-table-column>
              <el-table-column label="支付方式" align="center" prop="feePayment" min-width="300">
                <template #default="scope">
                  <el-select v-model="scope.row.feePayment" filterable placeholder="请选择" :style="{ width: '115px' }">
                    <el-option v-for="item in cont_fee_payment" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="scope.row.feePaymentOther" placeholder="请输入" clearable maxlength="32"
                    :style="{ width: '115px', marginLeft: '10px' }" :disabled="scope.row.feePayment != 4" />
                </template>
              </el-table-column>

              <el-table-column label="计费方式" align="center" prop="feeBilling" min-width="300">
                <!-- cont_fee_type -->
                <template #default="scope">
                  <el-radio-group v-model="scope.row.feeBilling">
                    <el-radio v-for="dict in cont_fee_billing" :key="dict.value" :label="dict.value">{{ dict.label
                      }}</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>


              <!-- <el-table-column label="管理费金额/比例" align="center" prop="feeRate" width="150">
                <template #default="scope">
                  <el-input v-model="scope.row.feeRate" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入" clearable />
                </template>
              </el-table-column> -->


            </el-table>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="积欠费用" name="2">
        <el-row :gutter="15">
          <el-col :span="24" :xs="24">
            <el-table :data="formData.feeList" style="margin-bottom: 20px;margin-top: 15px;">
              <el-table-column label="费用名目" align="center" prop="feeName" />
              <el-table-column label="费用币种" align="center" prop="loanCurrency">
                <template #default="scope">
                  <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
                </template>
              </el-table-column>
              <el-table-column label="费用金额" align="center" prop="amountReceived">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amountReceived) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="尚欠金额" align="center" prop="penalty">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.penalty) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="本次收取金额" align="center" prop="amountReceived">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.amountReceived) }}</span>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>


  </el-form>
</template>

<script setup>
import { deepClone } from "@/utils/index"
import { formatMoney } from "@/utils/formatMoney"
import CustomerSelect from "@/components/CustomerSelect"
import ElPriceInput from "@/components/ElPriceInput"
const { proxy } = getCurrentInstance();
const props = defineProps({
  infoData: {
    type: Object,
    default: null,
  },
  routerQueryObj: {
    type: Object,
    default: null,
  }
});
const activeNames = ref(['1','2']);//tab打开状态
const dataScope = reactive({
  rules: {
    'entryAmount': [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  },//验证规律
  customer: {
    showValue: "",
    option: {
      placeholder: "请选择收费/支付对象",
      dialogTitle: "收费/支付对象",
      queryUrl: "/cust/customer/list"
    },
    queryPropList: [
      {
        prop: "customerNo",
        label: "客户编号"
      },
      {
        prop: "customerName",
        label: "客户名称"
      }
    ],
    tablePropList: [
      {
        prop: "customerNo",
        label: "客户编号"
      },
      {
        prop: "customerName",
        label: "客户名称"
      }
    ]
  }
});

const { rules, customer } = toRefs(dataScope);
const { lend_buss_product, cont_pay, source_of_repayment, sys_currency_type, cont_interest_pay, cont_interest_settlement, loan_doc_type, loan_item, sys_yes_no, loan_result, payment_reverse_item, cont_fee_billing, payment_incoming_way, cont_fee_payment } = proxy.useDict("lend_buss_product", "cont_pay", "source_of_repayment", "sys_currency_type", "cont_interest_pay", "cont_interest_settlement", "loan_doc_type", "loan_item", "sys_yes_no", "loan_result", "payment_reverse_item", "cont_fee_billing", "payment_incoming_way", "cont_fee_payment");//下拉框字典
let formData = ref({});//不能修改const 定义的数据

watch(props.infoData, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue) {
    formData.value = deepClone(newValue);
    // console.log('费用信息', formData)
  }
}, { immediate: true, deep: true })

// 收费支付对象选择
function customerSelect(selected, current) {
  // console.log('收费支付对象选择',selected)
  // console.log('当前数据',current)
  current.customerId = selected.customerId
  current.customerName = selected.customerName
}

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

defineExpose({
  formData,
  validForm,
});
</script>