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
            <el-form-item label="应收账款同意书编号" prop="agreementNo">
              <el-input v-model="formData.agreementNo" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款方式" prop="loanWay">
              <el-select v-model="formData.loanWay" filterable placeholder="请选择" disabled>
                <el-option v-for="item in cont_pay" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="应收账款金额" prop="debtReceivableAmount">
                <ElPriceInput :form="formData" prop="debtReceivableAmount" placeholder="请输入" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款币种" prop="loanCurrency">
              <el-select v-model="formData.loanCurrency" filterable placeholder="请选择" disabled>
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款金额" prop="loanAmount">
                <ElPriceInput :form="formData" prop="loanAmount" placeholder="请输入" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款余额" prop="loanBalance">
                <ElPriceInput :form="formData" prop="loanBalance" placeholder="请输入" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款日" prop="loanExpectDate">
              <el-date-picker value-format="YYYY-MM-DD" v-model="formData.loanExpectDate" placeholder="请选择" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款到期日" prop="loanExpireDate">
              <el-date-picker value-format="YYYY-MM-DD" v-model="formData.loanExpireDate" placeholder="请选择" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
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
const activeNames = ref(['1']);//tab打开状态

const { lend_buss_product,
  sys_currency_type,
  cont_pay } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "cont_pay");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue);
  }
}, { immediate: true, deep: true })
</script>