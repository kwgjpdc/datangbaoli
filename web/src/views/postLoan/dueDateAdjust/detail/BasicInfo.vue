<template>
  <el-form class="info-form" ref="elForm" :model="formData" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag" :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="保理申请人" prop="factoringApplicantName">
              <el-input v-model="formData.factoringApplicantName" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务产品" prop="bussProduct">
              <el-select v-model="formData.bussProduct" filterable placeholder="请选择" disabled>
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="币种" prop="loanCurrency">
              <el-select v-model="formData.loanCurrency" filterable placeholder="请选择" disabled>
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="16" :sm="24">
            <el-form-item label="调整" prop="po.adjustRange">
              <el-checkbox-group v-model="formData.po.adjustRange">
                <template v-for="dict in postloan_adjust_type" :key="dict.value">
                  <el-checkbox :label="dict.value" :name="dict.value">{{ dict.label }}</el-checkbox>
                </template>
              </el-checkbox-group>
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
  postloan_adjust_type } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "postloan_adjust_type");//下拉框字典

let formData = ref({
  interestTotal: ""
});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue);
    if (!formData.value.po) formData.value.po = {}
    if (formData.value.po && formData.value.po.adjustRange && formData.value.po.adjustRange.length) {
      formData.value.po.adjustRange = formData.value.po.adjustRange.split(',');
    } else {
      formData.value.po.adjustRange = [];
    }
    delete formData.value.po.subList
    delete formData.value.changeSubList
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