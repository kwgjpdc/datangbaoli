<template>
  <el-form ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-row :gutter="15"
            class="form-row">
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="业务合同号"
                      prop="contractNo">
          <el-input v-model="formData.contractNo"
                    placeholder="系统自动带入"
                    disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="业务产品"
                      prop="bussProduct">
          <el-select v-model="formData.bussProduct"
                     placeholder="系统自动带入"
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
        <el-form-item label="保理申请人"
                      prop="factoringApplicantName">
          <el-input v-model="formData.factoringApplicantName"
                    placeholder="系统自动带入"
                    disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="核心客户"
                      prop="coreEnterpriseName">
          <el-input v-model="formData.coreEnterpriseName"
                    placeholder="系统自动带入"
                    disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="币种"
                      prop="loanCurrency">
          <el-select v-model="formData.loanCurrency"
                     placeholder="系统自动带入"
                     disabled>
            <el-option v-for="item in sys_currency_type"
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
        <el-form-item label="是否退息"
                      prop="refundFlag">
          <el-radio-group v-model="formData.refundFlag"
                          disabled>
            <el-radio v-for="item in sys_true_or_false"
                      :key="item.value"
                      :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="15"
            class="form-row">
      <el-col :xs="24">
        <el-form-item label="入账冲销项目"
                      prop="entryItem">
          <el-checkbox-group v-model="formData.entryItem">
            <el-checkbox v-for="item in payment_reverse_item"
                         :key="item.value"
                         :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="入账日期"
                      prop="entryDate">
          <el-date-picker type="date"
                          v-model="formData.entryDate"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择入账日期"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="扣账金额"
                      prop="deductionAmount">
          <ElPriceInput v-model:form="formData"
                        prop="deductionAmount"
                        :rules="rules.deductionAmount"
                        placeholder="请输入扣账金额">
          </ElPriceInput>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="入账账号"
                      prop="entryAccount">
          <!-- <CustomerSelect :option="cusSelection.option" :showValue="formData.entryAccount"
                                :queryPropList="cusSelection.queryPropList" :tablePropList="cusSelection.tablePropList"
                                @selectRow="handleCus"></CustomerSelect> -->
          <el-select v-model="formData.entryAccount"
                     placeholder="请选择入账账号">
            <el-option v-for="item in sys_entry_account"
                       :key="item.value"
                       :value="item.value">{{ item.label }} - {{ item.value }}</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="是否转付利息"
                      prop="transferFlag">
          <el-radio-group v-model="formData.transferFlag">
            <el-radio v-for="item in sys_true_or_false"
                      :key="item.value"
                      :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="转付金额"
                      prop="transferAmount">
          <ElPriceInput v-model:form="formData"
                        prop="transferAmount"
                        :rules="rules.transferAmount"
                        placeholder="请输入转付金额">
          </ElPriceInput>
        </el-form-item>
      </el-col>
      <el-col :xl="6"
              :lg="8"
              :sm="12"
              :xs="24">
        <el-form-item label="尾款金额"
                      prop="finalPaymentAmount">
          <ElPriceInput v-model:form="formData"
                        prop="finalPaymentAmount"
                        :rules="rules.finalPaymentAmount"
                        placeholder="请输入尾款金额">
          </ElPriceInput>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import ElPriceInput from "@/components/ElPriceInput"
import CustomerSelect from "@/components/CustomerSelect"
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import { listInfo } from "@/api/customer/index"

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

const { lend_buss_product, sys_currency_type,
  sys_true_or_false, payment_reverse_item, sys_entry_account } = proxy.useDict("lend_buss_product", "sys_currency_type",
    "sys_true_or_false", "payment_reverse_item", "sys_entry_account");//下拉框字典

const data = reactive({
  cusSelection: {
    name: "",
    option: {
      placeholder: "请选择入账账号",
      dialogTitle: "账号信息",
      queryUrl: "/cust/customer/list"
    },
    queryPropList: [
      {
        prop: "customerNo",
        label: "入账账号"
      },
      {
        prop: "customerName",
        label: "账号名称"
      }
    ],
    tablePropList: [
      {
        prop: "customerNo",
        label: "入账账号"
      },
      {
        prop: "customerName",
        label: "账号名称",
      }
    ]
  },
  rules: {
    entryItem: [
      {
        required: true,
        message: " 入账冲销项目不能为空",
        trigger: "change"
      }
    ],
    entryDate: [
      {
        required: true,
        message: " 入账日期不能为空",
        trigger: "change"
      }
    ],
    deductionAmount: [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      },
      {
        required: true,
        message: " 扣账金额不能为空",
        trigger: "blur"
      }
    ],
    entryAccount: [
      {
        required: true,
        message: " 入账账号不能为空",
        trigger: "change"
      }
    ],
    transferFlag: [
      {
        required: true,
        message: " 是否转付利息不能为空",
        trigger: "change"
      }
    ],
    transferAmount: [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ],
    finalPaymentAmount: [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  }
});
const { cusSelection, rules } = toRefs(data);

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue);
    if (formData.value.entryItem && formData.value.entryItem.length > 0) {
      formData.value.entryItem = formData.value.entryItem.split(',');
    } else {
      formData.value.entryItem = [];
    }
  }
}, { immediate: true, deep: true })

function handleCus(row) {
  formData.value.entryAccount = row.customerNo
  proxy.$refs['elForm'].clearValidate('entryAccount')
}

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
