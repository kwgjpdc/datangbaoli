<template>
  <el-form class="info-form" ref="elForm" :model="formData" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag" :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="业务标识" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务标识卖断" prop="sell">
              <el-select v-model="formData.sell" filterable placeholder="请选择">
                <el-option v-for="item in buss_mark_sell" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务标识买回" prop="buy">
              <el-select v-model="formData.buy" filterable placeholder="请选择">
                <el-option v-for="item in buss_mark_buy" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务标识1" prop="identifyOne">
              <el-select v-model="formData.identifyOne" filterable placeholder="请选择">
                <el-option v-for="item in buss_mark_1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务标识2" prop="identifyTwo">
              <el-select v-model="formData.identifyTwo" filterable placeholder="请选择">
                <el-option v-for="item in buss_mark_2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务标识3" prop="identifyThree">
              <el-select v-model="formData.identifyThree" filterable placeholder="请选择">
                <el-option v-for="item in buss_mark_3" :key="item.value" :label="item.label" :value="item.value">
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

const { sys_currency_type, lend_buss_product, cont_pay, 
  buss_mark_sell, buss_mark_buy, buss_mark_1, buss_mark_2, buss_mark_3 } 
  = proxy.useDict("sys_currency_type", "lend_buss_product", "cont_pay",
  "buss_mark_sell", "buss_mark_buy", "buss_mark_1", "buss_mark_2", "buss_mark_3");//下拉框字典

let formData = ref({
  sell: null,
  buy: null,
  identifyOne: null,
  identifyTwo: null,
  identifyThree: null
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