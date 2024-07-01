<template>
  <el-form class="info-form"
           ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息"
                        name="1">
        <el-row :gutter="15"
                style="margin-right: 30px;">
          <el-col :xl="6"
                  :lg="8"
                  :sm="12"
                  :xs="24">
            <el-form-item label="保理申请人"
                          prop="factoringApplicantName">
              <el-input v-model="formData.factoringApplicantName"
                        placeholder="系统自动生成"
                        disabled />
            </el-form-item>
          </el-col>
          <el-col :xl="6"
                  :lg="8"
                  :sm="12"
                  :xs="24">
            <el-form-item label="业务产品"
                          prop="businessType">
              <el-select v-model="formData.businessType"
                         filterable
                         placeholder="请选择"
                         disabled>
                <el-option v-for="item in lend_buss_product"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6"
                  :lg="8"
                  :sm="12"
                  :xs="24">
            <el-form-item label="币种"
                          prop="loanCurrency">
              <el-select v-model="formData.loanCurrency"
                         filterable
                         placeholder="请选择"
                         disabled>
                <el-option v-for="item in sys_currency_type"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12"
                  :lg="16"
                  :sm="24">
            <el-form-item label="变更"
                          prop="po.changeType">
              <el-checkbox-group v-model="formData.po.changeType">
                <template v-for="dict in interest_change_way"
                          :key="dict.value">
                  <el-checkbox :label="dict.value"
                               :name="dict.value">{{ dict.label }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6"
                  :lg="8"
                  :sm="12"
                  :xs="24">
            <el-form-item label="利率生效日期"
                          prop="po.rateEffectiveDate">
              <el-date-picker clearable
                              v-model="formData.po.rateEffectiveDate"
                              type="date"
                              placeholder="请选择"
                              value-format="YYYY-MM-DD">
              </el-date-picker>
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
const dataScope = reactive({
  rules: {
    // 基本信息：
    'po.rateEffectiveDate': [
      { required: true, message: "利率生效日期不能为空", trigger: "change" }
    ]
  },//验证规律
});

const { rules } = toRefs(dataScope);
const { lend_buss_product,
  sys_currency_type,
  interest_change_way } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "interest_change_way");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  // console.log('基本信息', newValue);
  if (newValue) {
    formData.value = deepClone(newValue);
    if (formData.value.po) {
      if (formData.value.po.changeType && formData.value.po.changeType.length) {
        formData.value.po.changeType = formData.value.po.changeType.split(',');
      } else {
        formData.value.po.changeType = [];
      }
      delete formData.value.po.subList
    } else {
      formData.value.po = {
        changeType: [],
        rateEffectiveDate: ""
      }
    }
    // 防止页面初始化表单自动化校验
    proxy.$nextTick(() => {
      proxy.$refs['elForm'].resetFields()
    })
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
  validForm,
});
</script>