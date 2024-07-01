<template>
  <el-form ref="elForm"
           :model="formData"
           :rules="rules"
           label-width="140px"
           :disabled="props.routerQueryObj.viewFlag"
           :validate-on-rule-change="false">
    <el-row :gutter="15" class="form-row">
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="卖断金额"
                      prop="sellAmount">
          <ElPriceInput v-model:form="formData"
                        prop="sellAmount"
                        placeholder="系统自动计算" :disabled="true">
          </ElPriceInput>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="卖断日期"
                      prop="sellDate">
          <el-date-picker type="date" v-model="formData.sellDate" value-format="YYYY-MM-DD" placeholder="请选择卖断日期"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="买入方"
                      prop="customerId">
          <CustomerSelect :option="cusSelection.option" :showValue="cusSelection.name"
                                :queryPropList="cusSelection.queryPropList" :tablePropList="cusSelection.tablePropList"
                                @selectRow="handleCus"></CustomerSelect>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="收款方式" prop="paymentMethod">
          <el-select v-model="formData.paymentMethod" filterable placeholder="请选择收款方式">
            <el-option v-for="item in soldout_payment_method" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24">
        <el-form-item label="资本类型" prop="capitalType">
          <el-select v-model="formData.capitalType" filterable placeholder="请选择资本类型">
            <el-option v-for="item in soldout_capital_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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

const { soldout_payment_method,
  soldout_capital_type } = proxy.useDict("soldout_payment_method",
    "soldout_capital_type");//下拉框字典

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
    sellDate: [
      {
        required: true,
        message: " 卖断日期不能为空",
        trigger: "change"
      }
    ],
    customerId: [
      {
        required: true,
        message: " 买入方不能为空",
        trigger: "change"
      }
    ],
    paymentMethod: [
      {
        required: true,
        message: " 收款方式不能为空",
        trigger: "change"
      }
    ],
    capitalType: [
      {
        required: true,
        message: " 资本类型不能为空",
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
    if (formData.value.customerId && formData.value.customerId !== "") {
      listInfo({customerId: formData.value.customerId}).then(res => {
        if(res.rows && res.rows.length > 0) {
          cusSelection.value.name = res.rows[0].customerName
        } else {
          formData.value.customerId = ""
        }
      })
    }
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
