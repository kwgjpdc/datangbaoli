<template>
  <el-form class="info-form" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="融资信息" name="1">
        <el-card>
          <template #header>
            <div class="flex-around-center" style="width: 100%; max-width: 280px">
            <FinancingDetails></FinancingDetails>
            <InterestDetails></InterestDetails>
            <Course></Course>
          </div>
          </template>
          <el-table :data="financingList">
          <el-table-column label="" width="50px" align="center" type="index" />
          <el-table-column label="放款编号" prop="loanNo" align="center" min-width="240" />
          <el-table-column label="应收账款同意书编号" prop="agreementNo" align="center" min-width="180" />
          <el-table-column label="放款方式" min-width="120" align="center">
            <template #default="scope">
              <dict-tag :options="cont_pay"
                        :value="scope.row.loanWay" />
            </template>
          </el-table-column>
          <el-table-column label="放款余额" min-width="120" align="center">
            <template #default="scope">
              <span>{{ formatMoney(scope.row.loanBalance) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="放款到期日" min-width="180" align="center">
            <template #default="scope">
              <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="展期到期日" min-width="180" align="center">
            <template #default="scope">
              <span>{{ parseTime(scope.row.extensionDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
        </el-table>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import { formatMoney } from "@/utils/formatMoney"
import FinancingDetails from "@/views/popup/FinancingDetails"
import InterestDetails from "@/views/popup/InterestDetails"
import Course from "@/views/popup/Course"

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
const activeNames = ref(['1']);//tab打开状态
const dataScope = reactive({
  financingList: [{
    loanNo: "3100MA06BPGR32020092900011",
    agreementNo: "DTBLYW20180020-F-01-15",
    loanWay: "1",
    loanBalance: 2000000,
    loanExpireDate: "2021-09-28",
    extensionDate: "2021-09-28"
  }]
});

const { financingList } = toRefs(dataScope);
const { lend_buss_product,
  sys_currency_type,
  cont_pay } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "cont_pay");//下拉框字典

const loanId = ref("")
const debtId = ref("")
watch(props.infoData, (newValue, oldValue) => {
  // console.log('基本信息', newValue);
  if (newValue) {
    loanId.value = newValue.loanId
  }
}, { immediate: true, deep: true })

// 表单验证
// function validForm() {
//   let result = false
//   proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
//   return result
// }

// defineExpose({
//   formData,
//   validForm,
// });
</script>