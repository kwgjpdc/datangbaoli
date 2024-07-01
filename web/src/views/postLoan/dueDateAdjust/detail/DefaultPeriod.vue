<template>
  <el-form class="info-form"
           :model="formData"
           ref="elForm"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="违约期限"
                        name="5">
        <el-table :data="formData.defaultPeriodList"
                  style="margin-bottom: 25px;margin-top: 15px;">
          <el-table-column label="执行方"
                           align="center"
                           prop="executeParty"
                           min-width="180px" />
          <el-table-column label="调整后违约截止天数"
                           align="center"
                           prop="branchEndDateNew"
                           width="240">
            <template #default="scope">
              <el-form-item class="only-input-content"
                            :prop="'defaultItem'+scope.$index+'branchEndDateNew'">
                <el-date-picker value-format="YYYY-MM-DD"
                                v-model="scope.row.branchEndDateNew"
                                placeholder="请输入调整后违约截止天数"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="违约利率周期"
                           align="center"
                           prop="cycle"
                           min-width="160">
            <template #default="scope">
              <dict-tag :options="cont_branch_interest_cycle"
                        :value="scope.row.cycle" />
            </template>
          </el-table-column>
          <el-table-column label="违约罚息方式"
                           align="center"
                           prop="penaltyWay"
                           min-width="180">
            <template #default="scope">
              <dict-tag :options="default_penalty_method"
                        :value="scope.row.penaltyWay" />
            </template>
          </el-table-column>
          <el-table-column label="违约利率上浮比例"
                           align="center"
                           prop="floatRatio"
                           min-width="160">
            <template #default="scope">
              <span>{{ formatPercent(scope.row.floatRatio) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="违约罚息率"
                           align="center"
                           prop="penaltyRate"
                           min-width="120px">
            <template #default="scope">
              <span>{{ formatPercent(scope.row.penaltyRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="违约金额"
                           align="center"
                           min-width="180px">
            <template #default="scope">
              <ElPriceInput v-model:form="scope.row"
                            :propslot="`defaultItem.${scope.$index}.branchAmount`"
                            :prop="'branchAmount'"
                            :rules="rules.branchAmount"
                            :placeholder="'请输入'">
                <template #prefix>
                  <span> ￥ </span>
                </template>
                <template #suffix>
                  <span> 元 </span>
                </template>
              </ElPriceInput>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import { formatMoney, formatPercent } from "@/utils/formatMoney"
import ElPriceInput from "@/components/ElPriceInput"
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
const activeNames = ref(['5']);//tab打开状态
const { cont_branch_interest_cycle, default_penalty_method }
  = proxy.useDict("cont_branch_interest_cycle", "default_penalty_method");//下拉框字典
const dataScope = reactive({
  rules: {
    "branchAmount": [
      {
        pattern: /^([0-9]\d{0,8}|1000000000)(\.\d{0,2})?$/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      },
      {
        require: true,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  },
  formData: {
    defaultPeriodList: []
  }
})
const { rules, formData } = toRefs(dataScope);

watch(props.infoData, (newValue) => {
  if (newValue) {
    const infoData = deepClone(newValue)
    formData.value.defaultPeriodList = deepClone(infoData.changeSubList)
    if (infoData.po && infoData.po.subList && infoData.po.subList.length > 0) {
      formData.value.defaultPeriodList.map((item, index) => {
        return Object.assign( item, infoData.po.subList[index] )
      })
    } else {
      formData.value.defaultPeriodList.map((item) => {
        return {
          ...item,
          loanExpireDayAdjustSubId: null,
          loanExpireDayAdjustId: null,
          branchEndDateNew: "",
          branchAmount: ""
        }
      })
    }
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