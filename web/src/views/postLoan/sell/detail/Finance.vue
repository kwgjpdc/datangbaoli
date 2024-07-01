<template>
  <el-form ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-card>
      <el-table :data="formData.subList">
        <el-table-column label="查询" align="center" min-width="240" fixed>
          <div class="flex-around-center">
            <FinancingDetails></FinancingDetails>
            <InterestDetails></InterestDetails>
            <Course></Course>
          </div>
        </el-table-column>
        <el-table-column label="放款编号" align="center" prop="loanNo" min-width="240"/>
        <el-table-column label="放款到期日" align="center" min-width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款方式" align="center" min-width="120">
          <template #default="scope">
            <dict-tag :options="cont_pay" :value="scope.row.loanWay" />
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" min-width="120">
          <template #default="scope">
            <dict-tag :options="sys_currency_type" :value="scope.row.loanCurrency" />
          </template>
        </el-table-column>
        <el-table-column label="放款余额" align="center" min-width="120">
          <template #default="scope">
              <span>{{ formatMoney(scope.row.loanBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖断金额" align="center" min-width="240">
          <template #default="scope">
            <el-form-item class="only-input-content" :prop="'subList.'+scope.$index+'.sellAmount'" :rules="rules.sellAmount">
              <ElPriceInput v-model:form="scope.row" prop="sellAmount" :rules="rules.sellAmount"
                        placeholder="请输入卖断金额" @change="handleSum">
              </ElPriceInput>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="尚欠总利息" align="center" min-width="120">
          <template #default="scope">
              <span>{{ formatMoney(scope.row.ownAmount) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-form>
</template>

<script setup>
import ElPriceInput from "@/components/ElPriceInput"
import CustomerSelect from "@/components/CustomerSelect"

import FinancingDetails from "@/views/popup/FinancingDetails"
import InterestDetails from "@/views/popup/InterestDetails"
import Course from "@/views/popup/Course"

const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import { getCusName } from "@/utils/transform"
import { formatMoney, formatPercent } from "@/utils/formatMoney"

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

const { cont_pay,
  sys_currency_type } = proxy.useDict("cont_pay",
    "sys_currency_type");//下拉框字典

const data = reactive({
  rules: {
    sellAmount: [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  }
});
const { rules } = toRefs(data);

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    const subItem = deepClone(newValue)
    formData.value.subList = []
    formData.value.subList.push(subItem)
  }
}, { immediate: true, deep: true })

// function handleCus(row) {
//   formData.value.customerId = row.customerId
//   cusSelection.value.name = row.customerName
// }

// 
function handleSum(el) {
  let calArr = formData.value.subList.map(item => Number(item.sellAmount));
  let sellTotal = calArr.reduce((acc, val) => acc + val, 0)
  proxy.$emit('getTotalSell', sellTotal)
  // console.log('总和',sellTotal)
}

// 表单验证
function validForm() {
    let result = false
    proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}

defineExpose({
  formData,
  validForm
})
</script>
