<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="state.rules" label-width="140px" :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="state.activeNames" style="border-top: 0;">
      <el-collapse-item title="高管信息" name="1">
        <el-card class="box-card">
          <template #header v-if="!props.routerQueryObj.viewFlag">
            <!-- <span>联系方式</span> -->
            <el-button style="float: right; padding: 3px 0;" type="primary" link @click="handleDelete()"
                       :disabled="state.single">删除</el-button>
            <el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="primary" link
                       @click="addAccount()">新增</el-button>
          </template>
          <el-table :data="formData.custExecutiveInfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" :disabled="props.routerQueryObj.viewFlag" />
            <el-table-column prop="executiveName" label="股东名称"/>
            <el-table-column prop="position" label="股东职务"/>
            <el-table-column prop="dateOfJoining" label="入职时间"/>
            <el-table-column prop="dateOfLeaving" label="离职时间"/>
            <el-table-column prop="qqEmail" label="QQ邮箱"/>
            <el-table-column prop="wechatId" label="微信账号"/>
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
          <el-form-item label="高管名称" prop="executiveName">
            <el-input v-model="addFromData.executiveName" placeholder="请输入高管名称" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高管职务" prop="position">
            <el-input v-model="addFromData.position" placeholder="请输入高管职务" clearable  maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职时间" prop="dateOfJoining">
            <el-date-picker clearable v-model="addFromData.dateOfJoining" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择入职时间"  style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离职时间" prop="dateOfLeaving">
            <el-date-picker clearable v-model="addFromData.dateOfLeaving" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择离职时间"  style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="qq邮箱" prop="qqEmail">
            <el-input
                v-model="formData.qqEmail"
                placeholder="请输入qq邮箱"
                style="width: 100%"
                maxlength="32"
                oninput="value=value.replace(/[^0-9A-Za-z@.]/g,'')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="微信账号" prop="wechatId">
            <el-input
                v-model="formData.wechatId"
                placeholder="请输入微信账号"
                style="width: 100%"
                maxlength="32"
                oninput="value=value.replace(/[^a-zA-Z0-9]/g,'')"
            />
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
    executiveName: [
      { required: true, message: "高管名称不能为空", trigger: "change" }
    ],
    position: [
      { required: true, message: "职务不能为空", trigger: "change" }
    ],
    dateOfJoining: [
      { required: true, message: "入职时间不能为空", trigger: "change" }
    ],

  }
});
const formData = ref({
  custExecutiveInfoList: []
})
const addFromData = ref({
  executiveName: '',
  position: '',
  dateOfJoining: '',
  dateOfLeaving: '',
  qqEmail: '',
  wechatId: '',
  remarks: '',
})
watch(() => props.infoData, (newValue, oldValue) => {
  if (newValue) {
    const companyInfo = deepClone(newValue)
    formData.value.custExecutiveInfoList = companyInfo
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
      formData.value.custExecutiveInfoList = formData.value.custExecutiveInfoList.filter((item) => {
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
      formData.value.custExecutiveInfoList.push(addFromData.value);
      resetAddFrom()
      state.openDialogAdd = false
    }
  })
}
function resetAddFrom() {
  addFromData.value = {
    executiveName: '',
    position: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    qqEmail: '',
    wechatId: '',
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

