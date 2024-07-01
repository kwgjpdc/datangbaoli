<template>
  <el-form ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-row :gutter="15" class="form-row">
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="业务合同号"
                      prop="contractNo">
          <el-input v-model="formData.contractNo" placeholder="系统自动带入" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="保理申请人"
                      prop="factoringApplicantName">
          <el-input v-model="formData.factoringApplicantName" placeholder="系统自动带入" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="币种" prop="loanCurrency">
          <el-select v-model="formData.loanCurrency" placeholder="系统自动带入" disabled>
            <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="转付方名称"
                      prop="customerName">
          <el-input v-model="formData.customerName" placeholder="系统自动带入" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="form-row">
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="支付价款日期"
                      prop="paymentDate">
          <el-date-picker type="date" v-model="formData.paymentDate" value-format="YYYY-MM-DD" placeholder="请选择支付价款日期"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="入账账号"
                      prop="account">
          <el-select v-model="formData.account"
                     placeholder="请选择入账账号">
            <el-option v-for="item in sys_entry_account"
                       :key="item.value"
                       :value="item.value">{{ item.label }} - {{ item.value }}</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark" maxlength="255" rows="2" show-word-limit placeholder="请输入备注"></el-input>
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

const { sys_entry_account,
  sys_currency_type } = proxy.useDict("sys_entry_account",
    "sys_currency_type");//下拉框字典

const data = reactive({
  cusSelection: {
    name: "",
    option: {
      placeholder: "请选择买入方",
      dialogTitle: "客户信息",
      queryUrl: "/cust/customer/list"
    },
    queryPropList: [
      {
        prop: "customerNo",
        label: "客户编号"
      },
      {
        prop: "customerName",
        label: "客户名称"
      }
    ],
    tablePropList: [
      {
        prop: "customerNo",
        label: "客户编号"
      },
      {
        prop: "customerName",
        label: "客户名称",
      }
    ]
  },
  rules: {
    paymentDate: [
      {
        required: true,
        message: " 支付价款日期不能为空",
        trigger: "change"
      }
    ]
  }
});
const { cusSelection, rules } = toRefs(data);

let formData = ref({});//不能修改const 定义的数据
watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue);
    // if (formData.value.customerId && formData.value.customerId !== "") {
    //   listInfo({customerId: formData.value.customerId}).then(res => {
    //     if(res.rows && res.rows.length > 0) {
    //       cusSelection.value.name = res.rows[0].customerName
    //     } else {
    //       formData.value.customerId = ""
    //     }
    //   })
    // }
  }
}, { immediate: true, deep: true })

function handleCus(row) {
  formData.value.customerId = row.customerId
  cusSelection.value.name = row.customerName
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
