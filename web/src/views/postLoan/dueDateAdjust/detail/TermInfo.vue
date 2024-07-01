<template>
  <el-form class="info-form"
           :model="formData"
           ref="elForm"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="放款期限"
                        name="2">
        <el-table :data="formData.loanTermList"
                  style="margin-bottom: 25px;margin-top: 15px;">
          <el-table-column label="操作"
                           width="240"
                           align="center"
                           fixed>
            <div class="button-display flex-around-center">
              <FinancingDetails></FinancingDetails>
              <InterestDetails></InterestDetails>
              <Course></Course>
            </div>
          </el-table-column>
          <el-table-column label="放款编号"
                           align="center"
                           prop="loanNo"
                           min-width="180px" />
          <el-table-column label="放款余额"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <span>{{ formatMoney(scope.row.loanBalance) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="放款日"
                           align="center"
                           width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.loanExpectDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="放款到期日"
                           align="center"
                           width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="调整后到期日"
                           align="center"
                           width="240">
            <template #default="scope">
              <el-form-item class="only-input-content">
                <el-date-picker value-format="YYYY-MM-DD"
                                v-model="scope.row.expireDateNew"
                                @change="handleDate"
                                placeholder="请输入调整后到期日"
                                :disabled-date="val => setStartPicker(val)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="放款方式"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <dict-tag :options="cont_pay"
                        :value="scope.row.loanWay" />
            </template>
          </el-table-column>
          <el-table-column label="风险敞口"
                           align="center"
                           min-width="120px">
            <template #default="scope">
              <span>{{ formatMoney(scope.row.riskExposure) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应收账款金额"
                           align="center"
                           min-width="180px">
            <template #default="scope">
              <span>{{ formatMoney(scope.row.financingAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利息金额"
                           align="center"
                           width="240"
                           fixed="right">
            <template #default="scope">
              <el-form-item class="only-input-content" :prop="`loanTermList.${scope.$index}.interestAmount`" :rules="rules.interestAmount">
                <ElPriceInput :form="scope.row" prop="interestAmount" placeholder="请输入" :rules="rules.interestAmount"></ElPriceInput>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="宽限期期限"
                        name="3">
        <el-table :data="formData.gracePeriodList"
                  style="margin-bottom: 25px;margin-top: 15px;">
          <el-table-column label="执行方"
                           align="center"
                           prop="factoringApplicantName"
                           min-width="180px" />
          <el-table-column label="宽限期利率"
                           align="center"
                           min-width="100">
            <template #default="scope">
              <span>{{ formatPercent(scope.row.gracePeriodInterestRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="宽限期起期"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.graceStartDateNew, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="宽限期止期"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <el-form-item class="only-input-content"
                            :prop="`graceItem.${scope.$index}.graceEndDateNew`">
                <el-date-picker value-format="YYYY-MM-DD"
                                v-model="scope.row.graceEndDateNew"
                                placeholder="请输入宽限期止期"
                                :disabled-date="val => setStartPicker(val, scope.row.graceStartDateNew)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="宽限期金额"
                           align="center"
                           width="240"
                           fixed="right">
            <template #default="scope">
              <el-form-item class="only-input-content" :prop="`gracePeriodList.${scope.$index}.graceAmount`" :rules="rules.graceAmount">
                <ElPriceInput :form="scope.row" prop="graceAmount" placeholder="请输入" :rules="rules.graceAmount"></ElPriceInput>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="展期期限"
                        name="4">
        <el-table :data="formData.extensionPeriodList"
                  style="margin-bottom: 25px;margin-top: 15px;">
          <el-table-column label="执行方"
                           align="center"
                           prop="factoringApplicantName"
                           min-width="180px" />
          <el-table-column label="展期利率"
                           align="center"
                           min-width="100">
            <template #default="scope">
              <el-form-item class="only-input-content"
                            :prop="`extensionItem.${scope.$index}.extendRate`">
                <el-input v-model="scope.row.extendRate"
                          placeholder="请输入展期利率"
                          clearable
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          maxlength="9">
                  <template #suffix>
                    <slot name="suffix">%</slot>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="展期起期"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.extendStartDateNew, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="展期止期"
                           align="center"
                           min-width="180">
            <template #default="scope">
              <el-form-item class="only-input-content"
                            :prop="`extensionItem.${scope.$index}.extendEndDateNew`">
                <el-date-picker value-format="YYYY-MM-DD"
                                v-model="scope.row.extendEndDateNew"
                                placeholder="请输入展期止期"
                                :disabled-date="val => setStartPicker(val, scope.row.extendStartDateNew)"></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="展期金额"
                           align="center"
                           width="240"
                           fixed="right">
            <template #default="scope">
              <el-form-item class="only-input-content" :prop="`extensionPeriodList.${scope.$index}.extendAmount`" :rules="rules.extendAmount">
                <ElPriceInput :form="scope.row" prop="extendAmount" placeholder="请输入" :rules="rules.extendAmount"></ElPriceInput>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { deepClone, setStartPicker } from "@/utils/index";
import { formatMoney, formatPercent } from "@/utils/formatMoney";
import ElPriceInput from "@/components/ElPriceInput";
import FinancingDetails from "@/views/popup/FinancingDetails"
import InterestDetails from "@/views/popup/InterestDetails"
import Course from "@/views/popup/Course"
import dayjs from "dayjs";
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
const activeNames = ref(['2', '3', '4']);//tab打开状态
const { cont_pay }
  = proxy.useDict("cont_pay");//下拉框字典
const dataScope = reactive({
  rules: {
    "interestAmount": [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: '请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ],
    "graceAmount": [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: '请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ],
    "extendAmount": [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: '请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  },
  formData: {
    loanTermList: [],
    gracePeriodList: [],
    extensionPeriodList: []
  }
})
const { rules, formData } = toRefs(dataScope);

watch(props.infoData, (newValue) => {
  if (newValue) {
    const infoData = deepClone(newValue)
    delete infoData.changeSubList
    let loanTermItem = deepClone(infoData),
      gracePeriodItem = deepClone(infoData),
      extensionPeriodItem = deepClone(infoData)
    if (!infoData.po) {
      loanTermItem = {
        expireDateNew: "",
        interestAmount: ""
      }
      gracePeriodItem = {
        ...gracePeriodItem,
        graceStartDateNew: "",
        graceEndDateNew: "",
        graceAmount: ""
      }
      extensionPeriodItem = {
        ...extensionPeriodItem,
        extendRate: "",
        extendStartDateNew: "",
        extendEndDateNew: "",
        extendAmount: ""
      }
    } else {
      delete infoData.po.subList
      loanTermItem = Object.assign(loanTermItem, infoData.po)
      delete loanTermItem.po
      gracePeriodItem = Object.assign(gracePeriodItem, infoData.po)
      delete gracePeriodItem.po
      extensionPeriodItem = Object.assign(extensionPeriodItem, infoData.po)
      delete extensionPeriodItem.po
    }
    const baseGraceDays = infoData.baseGraceDays
    if (gracePeriodItem.graceStartDateNew === '') {
      gracePeriodItem.graceStartDateNew = dayjs(loanTermItem.loanExpireDate).add(1, 'day').format("YYYY-MM-DD")
    }
    if (extensionPeriodItem.extendStartDateNew === '') {
      extensionPeriodItem.extendStartDateNew = dayjs(loanTermItem.loanExpireDate).add(1, 'day').format("YYYY-MM-DD")
    }
    if (gracePeriodItem.graceEndDateNew === '') {
      gracePeriodItem.graceEndDateNew = dayjs(gracePeriodItem.graceStartDateNew).add(baseGraceDays, 'day').format("YYYY-MM-DD")
    }
    if (extensionPeriodItem.extendEndDateNew === '') {
      extensionPeriodItem.extendEndDateNew = dayjs(extensionPeriodItem.extendStartDateNew).add(baseGraceDays, 'day').format("YYYY-MM-DD")
    }
    formData.value.loanTermList.push(loanTermItem)
    formData.value.gracePeriodList.push(gracePeriodItem)
    formData.value.extensionPeriodList.push(extensionPeriodItem)
    // console.log('放款',formData.value.loanTermList)
    // console.log('宽限',formData.value.gracePeriodList)
    // console.log('展期',formData.value.extensionPeriodList)
  }
}, { immediate: true, deep: true })

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

function handleDate() {
  proxy.$forceUpdate()
}

defineExpose({
  formData,
  validForm
})
</script>