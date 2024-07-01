<template>
  <el-collapse class="info-form"
               v-model="activeNames"
               style="border-top: 0;">
    <el-collapse-item title="利息信息"
                      name="1">
      <el-row :gutter="15">
        <el-col :span="24"
                :xs="24">
          <el-table :data="interestList"
                    style="margin-bottom: 25px;margin-top: 15px;">
            <el-table-column label="操作"
                             width="120"
                             align="center"
                             fixed>
              <div class="button-display">
                <el-tag class="table-btn"
                        v-if="props.routerQueryObj.viewFlag"
                        @click="handleDialog">利息信息</el-tag>
                <el-tag class="table-btn"
                        v-else
                        @click="handleDialog">调整利息信息</el-tag>
              </div>
            </el-table-column>
            <el-table-column label="放款编号"
                             align="center"
                             prop="loanNo"
                             min-width="180px"
                             fixed="left" />
            <el-table-column label="执行对象"
                             align="center"
                             prop="agreeDebtorName"
                             min-width="240px" />
            <el-table-column label="放款余额"
                             align="center"
                             prop="loanAmount"
                             width="160">
              <template #default="scope">
                <span>{{ formatMoney(scope.row.loanAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="放款到期日"
                             align="center"
                             prop="loanExpireDate"
                             width="160">
              <template #default="scope">
                <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已收本金利息"
                             align="center"
                             prop="interestReceived"
                             width="160">
              <template #default="scope">
                <span>{{ formatMoney(scope.row.interestReceived) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="未收本金利息"
                             align="center"
                             prop="interestNotReceived"
                             width="160">
              <template #default="scope">
                <span>{{ formatMoney(scope.row.interestNotReceived) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调整利息金额"
                             align="center"
                             prop="adjustAmount"
                             width="160"
                             fixed="right">
              <template #default="scope">
                <span>{{ formatMoney(scope.row.adjustAmount) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-collapse-item>
    <!-- 利息信息弹窗 -->
    <el-dialog class="info-dialog"
               v-model="dialogVisible"
               :title="dialog.title"
               :width="dialog.width">
      <el-form ref="elForm"
               :model="interestForm"
               :rules="rules"
               label-width="140px"
               :disabled="props.routerQueryObj.viewFlag">
        <el-row :gutter="15"
                style="margin-right: 30px;">
          <el-col :xs="24">
            <el-form-item label="利息调整方式"
                          prop="adjustWay">
              <el-radio-group v-model="interestForm.adjustWay"
                              @change="adjustWayChange">
                <el-radio v-for="item in interest_adjust_method"
                          :key="item.value"
                          :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="加收天数"
                          prop="additionalDays">
              <el-input v-model.number="interestForm.additionalDays"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        placeholder="请输入加收天数"
                        maxlength="9"
                        :disabled="interestForm.adjustWay !== '2'">
                <template #suffix>
                  <span> 天 </span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="调整利息金额"
                          prop="adjustAmount">
              <ElPriceInput :form="interestForm"
                            prop="adjustAmount"
                            :rules="rules.adjustAmount"
                            :placeholder="'请输入'">
              </ElPriceInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="!props.routerQueryObj.viewFlag"
                     type="primary"
                     @click="handleEdit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 利率信息弹窗 end-->
  </el-collapse>
</template>

<script setup>
import { deepClone } from "@/utils/index"
import { formatMoney } from "@/utils/formatMoney"
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
const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);
const dialogVisible = ref(false)

const dataScope = reactive({
  rules: {
    "additionalDays": [
      {
        validator: function (rule, value, callback) {
          if (interestForm.value.adjustWay === '2') {
            if (interestForm.value.additionalDays == '') {
              callback(new Error("调整方式为加收天数时，加收天数不为空"))
            }
          }
          callback()
        },
        trigger: "blur"
      },
    ],
    "adjustAmount": [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      },
      { required: true, message: "调整利息金额不能为空", trigger: "blur" },
    ]
  },//验证规律
  interestForm: {
    "loanInterestAmountAdjustId": "",
    "loanId": "",
    "adjustWay": "",
    "additionalDays": "",
    "adjustAmount": ""
  },
  dialog: {
    title: "约定信息",
    with: ""
  }
});

const { rules, interestForm, dialog } = toRefs(dataScope);
const { interest_adjust_method } = proxy.useDict("interest_adjust_method");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
let interestList = ref([])

watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    const dataInfo = deepClone(newValue)
    formData.value = deepClone(dataInfo)
    if (!formData.value.po) {
      formData.value.po = {}
    }
    delete dataInfo.po
    if (interestList.value.length === 0) {
      let interestItem = Object.assign(dataInfo, formData.value.po)
      interestList.value.push(interestItem)
    }
  }
}, { immediate: true, deep: true })


// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

// 利息调整方式改变
function adjustWayChange(val) {
  interestForm.value.additionalDays = ""
  proxy.$refs['elForm'].clearValidate('additionalDays')
}

// 利息信息弹窗
function handleDialog() {
  const interestItem = interestList.value[0]
  interestForm.value = {
    "loanInterestAmountAdjustId": interestItem.loanInterestAmountAdjustId,
    "loanId": interestItem.loanId,
    "adjustWay": interestItem.adjustWay && interestItem.adjustWay !== "" ? interestItem.adjustWay : interest_adjust_method.value[0].value,
    "additionalDays": interestItem.additionalDays,
    "adjustAmount": interestItem.adjustAmount
  }
  // console.log('利息信息', interestForm.value)
  dialogVisible.value = true
}

// 利率信息弹窗关闭，表单初始化
function handleClose() {
  interestForm.value = {
    "adjustWay": interest_adjust_method.value[0].value,
    "additionalDays": "",
    "adjustAmount": ""
  }
  proxy.resetForm("elForm")
  dialogVisible.value = false
}

// 利率信息弹窗 确定修改
function handleEdit() {
  const elForm = new Promise((resolve, reject) => {
    proxy.$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([elForm]).then(() => {
    Object.assign(interestList.value[0], interestForm.value)
    // proxy.$emit('handleTotal', interestForm.value.adjustAmount)
    handleClose()
  })
}

// 更新子组件数据
function updateForm() {
  formData.value.po.loanInterestAmountAdjustId = interestList.value[0].loanInterestAmountAdjustId
  formData.value.po.loanId = interestList.value[0].loanId
  formData.value.po.adjustWay = interestList.value[0].adjustWay
  formData.value.po.adjustAmount = interestList.value[0].adjustAmount
  formData.value.po.additionalDays = interestList.value[0].additionalDays
  return formData.value
}

defineExpose({
  formData,
  updateForm
});
</script>