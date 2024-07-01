<template>
  <el-form ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-row :gutter="15" class="form-row">
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="扣款账号"
                      prop="deductionList.0.deductionAccount">
          <el-input v-model="formData.deductionList[0].deductionAccount" placeholder="请输入扣款账号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="扣账金额"
                      prop="deductionList.0.deductionAmount">
          <ElPriceInput v-model:form="formData.deductionList[0]"
                        prop="deductionAmount"
                        :rules="rules.deductionAmount"
                        placeholder="请输入扣账金额">
          </ElPriceInput>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import ElPriceInput from "@/components/ElPriceInput"
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"

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

const { sys_entry_account,
  sys_currency_type } = proxy.useDict("sys_entry_account",
    "sys_currency_type");//下拉框字典

const data = reactive({
  rules: {
    "deductionList.0.deductionAmount": [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ],
    deductionAmount: [
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
    formData.value = deepClone(newValue);
    if (!(formData.value.deductionList && formData.value.deductionList.length > 0)) {
      formData.value.deductionList.push({
        absTransferDeductionId: null,
        absTransferId: null,
        deductionAccount: "",
        deductionAmount: ""
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
