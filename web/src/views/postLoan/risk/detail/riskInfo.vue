<template>
  <el-form class="info-form" ref="elForm" :model="formData" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag" :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="风险分类" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24" v-if="formData.currentStatus && formData.currentStatus != ''">
            <el-form-item label="目前状态" prop="currentStatus">
              <el-select v-model="formData.currentStatus" filterable placeholder="请选择" disabled>
                <el-option v-for="item in risk_status" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="更新状态" prop="updateStatus">
              <el-select v-model="formData.updateStatus" filterable placeholder="请选择">
                <el-option v-for="item in risk_status" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>


<script setup>
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
const activeNames = ref(['1']);//tab打开状态

const { lend_buss_product,
  sys_currency_type,
  risk_status } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "risk_status");//下拉框字典

let formData = ref({
  loanRiskId: null,
  loanId: null,
  currentStatus: null,
  updateStatus: null
});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue);
  }
}, { immediate: true, deep: true })

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

defineExpose({
  formData
})
</script>