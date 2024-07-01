<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="授信评级信息" name="2">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="评级得分" prop="rateScore">
              <el-input v-model="formData.rateScore" placeholder="请输入评级得分" oninput="value=value.replace(/[^0-9.]/g,'')" clearable maxlength="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="评定机构" prop="rateOrg">
              <el-input v-model="formData.rateOrg" placeholder="请输入评定机构" clearable maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="评定等级" prop="rateLevel">
              <el-input v-model="formData.rateLevel" placeholder="请输入评定等级" clearable maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="评级有效到期日" prop="rateEffectiveDueDate">
              <el-date-picker clearable v-model="formData.rateEffectiveDueDate" type="date" placeholder="请选择"
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
const props = defineProps({
  infoData: {
    type: Object,
    default: null,
  },
  customerId: {
    type: String,
    default: "",
  },
  routerQueryObj: {
    type: Object,
    default: null,
  }
});
const loading = ref(false);
const activeNames = ref(['2']);
const dataScope = reactive({
  rules: {},//验证规律
});

const { rules } = toRefs(dataScope);

let formData = ref({
  rateScore: "",
  rateOrg: "",
  rateLevel: "",
  rateEffectiveDueDate: ""
});//不能修改const 定义的数据
watch(() => props.infoData, (newValue, oldValue) => {
  console.log(newValue);
  // formData.value = Object.assign({}, newValue);
  formData.value.rateScore = newValue.rateScore
  formData.value.rateOrg = newValue.rateOrg
  formData.value.rateLevel = newValue.rateLevel
  formData.value.rateEffectiveDueDate = newValue.rateEffectiveDueDate
  delete formData.value.companyInfo;
  delete formData.value.commonFileList;
  delete formData.value.bankInfoList;
  // console.log(formData)
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
  validForm,
});
</script>

<style lang="scss">
.box-card {
  margin-bottom: 20px;
}

.page {
  margin-top: 10px;

}
</style>