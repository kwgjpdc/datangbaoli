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
            <!-- <Course></Course> -->
          </div>
        </el-table-column>
        <el-table-column label="放款编号" align="center" prop="loanNo" min-width="240"/>
        <el-table-column label="管理同意书编号" align="center" prop="agreementNo" min-width="240"/>
        <el-table-column label="放款到期日" align="center" min-width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款余额" align="center" min-width="120">
          <template #default="scope">
              <span>{{ formatMoney(scope.row.loanBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="尚欠总利息" align="center" min-width="120">
          <template #default="scope">
              <span>{{ formatMoney(scope.row.ownAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖断金额" align="center" min-width="240">
          <template #default="scope">
            <span>{{ formatMoney(scope.row.sellAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖断日期" align="center" min-width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.sellDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="本次入账金额" align="center" min-width="240" fixed="right">
          <template #default="scope">
            <el-form-item class="only-input-content" :prop="'subList.'+scope.$index+'.entryAmount'" :rules="rules.entryAmount">
              <ElPriceInput v-model:form="scope.row" prop="entryAmount" :rules="rules.entryAmount"
                        placeholder="请输入本次入账金额">
              </ElPriceInput>
            </el-form-item>
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
// import Course from "@/views/popup/Course"

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
    entryAmount: [
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
