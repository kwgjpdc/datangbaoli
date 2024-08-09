<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="state.rules" label-width="140px" :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="state.activeNames" style="border-top: 0;">
      <el-collapse-item title="股东信息" name="1">
        <el-card class="box-card">
          <template #header v-if="!props.routerQueryObj.viewFlag">
            <!-- <span>联系方式</span> -->
            <el-button style="float: right; padding: 3px 0;" type="primary" link @click="handleDelete()"
                       :disabled="state.single">删除</el-button>
            <el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="primary" link
                       @click="addAccount()">新增</el-button>
          </template>
          <el-table :data="formData.custShareholderInfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" :disabled="props.routerQueryObj.viewFlag" />
            <el-table-column prop="name" label="股东名称"/>
            <el-table-column prop="shareholderType" label="股东类型" align="center">
              <template #default="{row}">
                <dict-tag :options="cont_shareholder_type" :value="row.shareholderType" />
              </template>
            </el-table-column>
            <el-table-column prop="certificateType" label="证件类型" align="center">
              <template #default="{row}">
                <dict-tag :options="document_type" :value="row.certificateType" />
              </template>
            </el-table-column>
            <el-table-column prop="certificateNumber" label="证件号码"  />
            <el-table-column prop="relationshipWithLegalEntity" label="与法人关系"  />
            <el-table-column prop="capitalContribution" label="出资金额"  />
            <el-table-column prop="shareholdingPercentage" label="占比"  />
            <el-table-column prop="contributionMethod" label="出资方式"  />
            <el-table-column prop="currencyType" label="入股币种" align="center">
              <template #default="{row}">
                <dict-tag :options="sys_currency_type" :value="row.currencyType" />
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" />
          </el-table>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <el-dialog title="股东信息" :model-value="state.openDialogAdd" width="800px" @closed="closeDialogAdd(false)">
    <el-form ref="formInput" label-width="110px" :model="addFromData" :rules="state.addFromDataRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="股东类型" prop="shareholderType">
            <el-select
                v-model="addFromData.shareholderType"
                placeholder="请选择股东类型"
                filterable
                clearable
                :style="{ width: '100%' }"
            >
              <el-option
                  v-for="item in cont_shareholder_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="股东类型" prop="certificateType">
            <el-select
                v-model="addFromData.certificateType"
                placeholder="请选择股东类型"
                filterable
                clearable
                :style="{ width: '100%' }"
            >
              <el-option
                  v-for="item in document_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="股东名称" prop="name">
            <el-input v-model="addFromData.name" placeholder="请输入股东名称" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="certificateNumber">
            <el-input v-model="addFromData.certificateNumber" placeholder="请输入证件号码" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与法人关系" prop="name">
            <el-input v-model="addFromData.relationshipWithLegalEntity" placeholder="请输入与法人关系" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出资金额" prop="capitalContribution">
            <ElPriceInput v-model:form="addFromData" prop="capitalContribution" :rules="state.addFromDataRules"
                          :disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入出资金额'">
              <template #prefix>
                <span> ￥ </span>
              </template>
              <template #suffix>
                <span> 元 </span>
              </template>
            </ElPriceInput>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="占比（%）" prop="shareholdingPercentage">
            <el-input-number v-model="addFromData.shareholdingPercentage" controls-position="right" :max="100" :min="0" style="width: 100%" clearable>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出资方式" prop="contributionMethod">
            <el-input v-model="addFromData.contributionMethod" placeholder="请输入出资方式" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种 " prop="currencyType">
            <el-select v-model="addFromData.currencyType" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到位率（%）" prop="rateOfCapitalArrival">
            <el-input-number v-model="addFromData.rateOfCapitalArrival" controls-position="right" :max="100" :min="0" style="width: 100%" clearable>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="addFromData.remarks" placeholder="请输入备注" maxlength="200" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="saveAddFrom">保存</el-button>
            <el-button type="primary" @click="closeDialogAdd(false)">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { defineProps, ref, reactive } from 'vue'
import { deepClone } from "@/utils/index"
const props = defineProps(['infoData', 'routerQueryObj', 'customerId']);
const { proxy } = getCurrentInstance();
const {
  cont_shareholder_type,
  document_type,
  sys_currency_type
} = proxy.useDict(
    "cont_shareholder_type",
    "document_type",
    "sys_currency_type"
);
// 定义响应式数据
const state = reactive({
  activeNames: ['1'],
  single: true,
  openDialogAdd: false,
  selectIds: [],
  rules: {},
  addFromDataRules: {
    shareholderType: [
      { required: true, message: "股东类型不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "change" }
    ],
    currencyType: [
      { required: true, message: "入股币种不能为空", trigger: "change" }
    ],
    shareholdingPercentage:  [
      { required: true, message: "占比（%）不能为空", trigger: "change" }
    ],
  }
});
const formData = ref({
  custShareholderInfoList: []
})
const addFromData = ref({
  shareholderType: '',
  certificateType: '',
  name: '',
  certificateNumber: '',
  relationshipWithLegalEntity: '',
  capitalContribution: 0,
  shareholdingPercentage: 0,
  contributionMethod: '',
  currencyType: '',
  rateOfCapitalArrival: '',
  remarks: '',
})

watch(() => props.infoData, (newValue, oldValue) => {
  if (newValue) {
    const companyInfo = deepClone(newValue)
    console.log(companyInfo)
    formData.value.custShareholderInfoList = companyInfo
  }
}, { immediate: true })
/**
 * 定义方法
 */
function addAccount() {
  state.openDialogAdd = true
}
function handleDelete() {
  proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function () {
    state.selectIds.forEach((names) => {
      formData.value.custShareholderInfoList = formData.value.custShareholderInfoList.filter((item) => {
        return item != names;
      })
    })
    state.single  = false;
  }).catch((e) => { console.log(e) });
}
function handleSelectionChange(selections) {
  state.selectIds = selections
  state.single = selections.length != 1;
}
function closeDialogAdd() {
  state.openDialogAdd = false
}
function saveAddFrom() {
  proxy.$refs['formInput'].validate(valid => {
    if (!valid) {
      // proxy.$message("")
    } else {
      formData.value.custShareholderInfoList.push(addFromData.value);
      resetAddFrom()
      state.openDialogAdd = false
    }
  })
}
function resetAddFrom() {
  addFromData.value = {
    shareholderType: '',
    certificateType: '',
    name: '',
    certificateNumber: '',
    relationshipWithLegalEntity: '',
    capitalContribution: 0,
    shareholdingPercentage: 0,
    contributionMethod: '',
    currencyType: '',
    rateOfCapitalArrival: '',
    remarks: '',
  }
}
function validForm() {
  let result = false
  this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}
// 暴露数据父组件接受
defineExpose({
  formData,
  validForm,
});

</script>

