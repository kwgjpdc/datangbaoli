<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag" :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="保理申请人" prop="factoringApplicantName">
              <el-input v-model="formData.factoringApplicantName" placeholder="请输入保理申请人" disabled />
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
            <el-form-item label="分摊利息客户名称" prop="factoringApplicantName">
              <el-input v-model="formData.factoringApplicantName" placeholder="请输入分摊利息客户名称" disabled />
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
          <el-col :span="24">
            <el-form-item label="入账冲销项目" prop="po.entryItem">
              <el-checkbox-group v-model="formData.po.entryItem">
                <template v-for="dict in payment_reverse_item" :key="dict.value">
                  <el-checkbox v-if="dict.remark && dict.remark.indexOf('买方利息回款') > -1" :label="dict.value" :name="dict.value">{{ dict.label }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="入账日期" prop="po.entryDate">
              <el-date-picker clearable v-model="formData.po.entryDate" type="date" placeholder="请选择" value-format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="入账账号" prop="po.entryAccount">
              <el-select v-model="formData.po.entryAccount" filterable placeholder="请选择">
                <el-option v-for="item in sys_entry_account" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="扣账金额" prop="po.deductionAmount" :rules="rules['po.deductionAmount']">
                <ElPriceInput :form="formData.po" prop="deductionAmount" placeholder="请输入" :rules="rules['po.deductionAmount']"></ElPriceInput>
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
const activeNames = ref(['1']);//tab打开状态
const dataScope = reactive({
  rules: {
    // 基本信息：
    'po.entryDate': [
      { required: true, message: "入账日期不能为空", trigger: "change" }
    ],
    'po.entryAccount': [
      { required: true, message: "入账账号不能为空", trigger: "change" }
    ],
    'po.repaymentSource': [
      { required: true, message: "还款来源不能为空", trigger: "change" }
    ],
    'po.deductionAmount': [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur'
      }
    ],
    'deductionAmount': [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur'
      }
    ]
  },//验证规律
});

const { rules } = toRefs(dataScope);
const { lend_buss_product,
  sys_currency_type,
  payment_reverse_item,
  cont_pay,
  sys_entry_account,
  source_of_repayment } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "payment_reverse_item",
    "cont_pay",
	"sys_entry_account",
    "source_of_repayment");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  // console.log('基本信息', newValue);
  if (newValue) {
    formData.value = deepClone(newValue);
    if (formData.value.po.entryItem && formData.value.po.entryItem.length) {
      formData.value.po.entryItem = formData.value.po.entryItem.split(',');
    } else {
      formData.value.po.entryItem = [];
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