<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="注销原因" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="8" :lg="12" :sm="24">
            <el-form-item label="注销原因" prop="logoutReason">
              <el-select v-model="formData.logoutReason" placeholder="请选择">
                <el-option v-for="item in registered_cancel_reason" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="注销描述" prop="logoutDescription">
              <el-input type="textarea" maxlength="255" show-word-limit rows="4"
                v-model="formData.logoutDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
const props = defineProps({
  cancelInfo: {
    type: Object,
    default: null,
  }
});

const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
  rules: {
    logoutReason: [
      { required: true, message: "注销原因不能为空", trigger: "change" }
    ],
  },//验证规律
});

const { rules } = toRefs(dataScope);


const { registered_cancel_reason } = proxy.useDict("registered_cancel_reason");//下拉框字典

let formData = ref({
  cancelInfo: {
    "cancelReason": null,
    "cancelDes": ""
  }
});

watch(() => props.cancelInfo, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue) {
    formData.value.cancelInfo = deepClone(newValue);
  }
}, { immediate: true, deep: true })


function handleChange(val) {
  console.log(val);
}

// 表单验证
function validForm() {
  let result = false
  this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

defineExpose({
  formData,
  validForm
});

</script>