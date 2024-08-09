<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="法人信息" name="3">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="法定代表人" prop="companyInfo.corporationName">
              <el-input v-model="formData.companyInfo.corporationName" placeholder="请输入法定代表人" clearable
                maxlength="32"></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="性别" prop="companyInfo.sex">
              <el-select v-model="formData.companyInfo.sex" placeholder="请选择">
                <el-option v-for="item in sys_user_sex" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="出生日期" prop="companyInfo.birth">
              <el-date-picker v-model="formData.companyInfo.birth" type="date" placeholder="请选择" />
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="证件到期日" prop="companyInfo.credentialDueDate">
              <el-date-picker v-model="formData.companyInfo.credentialDueDate" type="date" placeholder="请选择" />
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="法人身份证号码" prop="companyInfo.corporationIdCard">
              <el-input v-model="formData.companyInfo.corporationIdCard" oninput="value=value.replace(/[^0-9Xx]/g,'')" placeholder="请输入法人身份证号码" clearable maxlength="32" ></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="学历" prop="companyInfo.qualification">
              <el-input v-model="formData.companyInfo.qualification" placeholder="请输入学历" clearable
                maxlength="32"></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="移动电话" prop="companyInfo.mobilePhone">
              <el-input v-model="formData.companyInfo.mobilePhone" placeholder="请输入移动电话"
                oninput="value=value.replace(/[^0-9]/g,'')" clearable maxlength="11"></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="固定电话" prop="companyInfo.fixedPhone">
              <el-input v-model="formData.companyInfo.fixedPhone" placeholder="请输入固定电话"
                oninput="value=value.replace(/[^0-9-]/g,'')" clearable type="tel" maxlength="20"></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="邮箱" prop="companyInfo.email">
              <el-input v-model="formData.companyInfo.email" placeholder="请输入邮箱"
                oninput="value=value.replace(/[^0-9A-Za-z.@]/,'')" clearable type="email" maxlength="64"></el-input>
            </el-form-item></el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="法人财产" name="4">
        <el-card class="box-card">
          <template #header v-if="!props.routerQueryObj.viewFlag">
            <!-- <span>联系方式</span> -->
            <el-button style="float: right; padding: 3px 0;" type="primary" link @click="handleDelete()"
                       :disabled="single">删除</el-button>
            <el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="primary" link
                       @click="addAccount()">新增</el-button>
          </template>
          <el-table :data="formData.companyInfo.legalPersonPropertyList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" :disabled="props.routerQueryObj.viewFlag" />
            <el-table-column prop="propertyDescription" label="财产描述"/>
            <el-table-column prop="currencyType" label="币种" align="center">
              <template #default="{row}">
                <dict-tag :options="sys_currency_type" :value="row.currencyType" />
              </template>
            </el-table-column>
            <el-table-column prop="worth" label="注册资本"  />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-card>
<!--        <el-row :gutter="15" style="margin-right: 30px;">-->
<!--          <el-col :xl="6" :lg="8" :sm="12" :xs="24">-->
<!--            <el-form-item label="财产描述" prop="companyInfo.propertyDescription">-->
<!--              <el-input v-model="formData.companyInfo.propertyDescription" placeholder="请输入财产描述" clearable-->
<!--                maxlength="255"></el-input>-->
<!--            </el-form-item></el-col>-->
<!--          <el-col :xl="6" :lg="8" :sm="12" :xs="24">-->
<!--            <el-form-item label="币种" prop="companyInfo.currencyType">-->
<!--              <el-select v-model="formData.companyInfo.currencyType" filterable placeholder="请选择">-->
<!--                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item></el-col>-->
<!--          <el-col :xl="6" :lg="8" :sm="12" :xs="24">-->
<!--            <el-form-item label="注册资本" prop="worth">-->
<!--              <ElPriceInput v-model:form="formData.companyInfo" prop="worth" :rules="rules"-->
<!--                :disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">-->
<!--                <template #prefix>-->
<!--                  <span> ￥ </span>-->
<!--                </template>-->
<!--                <template #suffix>-->
<!--                  <span> 元 </span>-->
<!--                </template>-->
<!--              </ElPriceInput>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :sm="24">-->
<!--            <el-form-item label="备注" prop="companyInfo.remark">-->
<!--              <el-input type="textarea" rows="2" v-model="formData.companyInfo.remark" placeholder="请输入" clearable-->
<!--                maxlength="255" show-word-limit></el-input>-->
<!--            </el-form-item></el-col>-->
<!--        </el-row>-->
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <el-dialog title="法人财产" :model-value="openDialogAdd" width="800px" @closed="closeDialogAdd(false)">
    <el-form ref="formInput" label-width="110px" :model="corporateFormInput" :rules="corporateAddrules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="财产描述" prop="propertyDescription">
            <el-input v-model="corporateFormInput.propertyDescription" placeholder="请输入财产描述" clearable
              maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种 " prop="currencyType">
            <el-select v-model="corporateFormInput.currencyType" filterable placeholder="请选择"
                       :style="{ width: '240px' }">
              <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资本" prop="worth">
            <ElPriceInput v-model:form="corporateFormInput" prop="worth" :rules="corporateAddrules"
              :disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">
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
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入备注" maxlength="64" v-model="corporateFormInput.remark"
                      :style="{ width: '240px' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="saveCorporate">保存</el-button>
            <el-button type="primary" @click="closeDialogAdd(false)">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </el-dialog>
</template>

<script setup>
import ElPriceInput from "@/components/ElPriceInput"
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import { getIDSex, getIDBirth } from "@/utils/validate"
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

const activeNames = ref(['3', '4']);//tab打开状态
const loading = ref(false);//tab打开状态
const single = ref(true);
const openDialogAdd = ref(false);//新增账号弹窗
const corporateFormInput = ref({
  propertyDescription: '',
  currencyType: '',
  worth: 0,
  remark: '',
})
const dataScope = reactive({
  rules: {
    "companyInfo.corporationName": [
      { required: true, message: "法定代表人不能为空", trigger: "blur" }
    ],
    "companyInfo.corporationIdCard": [
      {
        pattern: /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/,
        message: ' 请输入正确的身份证号码',
        trigger: 'blur',
      }
    ],
    "companyInfo.mobilePhone": [
      {
        pattern: /^1[3456789]\d{9}$/,
        message: ' 请输入正确的移动号码',
        trigger: 'blur',
      }
    ],
    "companyInfo.email": [
      {
        pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        message: ' 请输入正确的邮箱',
        trigger: 'blur',
      }
    ],
    "companyInfo.worth": [
      {
        pattern: /^([0-9]\d{0,8}|1000000000)(\.\d{0,2})?$/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ],
  },//验证规律
  corporateAddrules: {
    propertyDescription: [
      { required: true, message: "财产描述不能为空", trigger: "change" }
    ],
    currencyType: [
      { required: true, message: "币种不能为空", trigger: "change" }
    ],
    worth: [
      { required: true, message: "注册资本不能为空", trigger: "change" }
    ],
  }
});
const selectIds = ref([])

const { rules, corporateAddrules } = toRefs(dataScope);
let formData = ref({
  companyInfo: {
    corporationName: "",
    sex: "",
    birth: "",
    credentialDueDate: "",
    corporationIdCard: "",
    qualification: "",
    mobilePhone: "",
    fixedPhone: "",
    email: "",
    propertyDescription: "",
    currencyType: "1",
    worth: 0,
    remark: "",
    legalPersonPropertyList: [],
  }
});//不能修改const 定义的数据
const { sys_user_sex, sys_currency_type } = proxy.useDict("sys_user_sex", "sys_currency_type");//下拉框字典
watch(() => props.infoData, (newValue, oldValue) => {
  // console.log(newValue);
  if (newValue) {
    const companyInfo = deepClone(newValue)
    // formData.value.companyInfo = deepClone(newValue);
    formData.value.companyInfo.corporationName = companyInfo.corporationName
    formData.value.companyInfo.sex = companyInfo.sex
    formData.value.companyInfo.birth = companyInfo.birth
    formData.value.companyInfo.credentialDueDate = companyInfo.credentialDueDate
    formData.value.companyInfo.qualification = companyInfo.qualification
    formData.value.companyInfo.mobilePhone = companyInfo.mobilePhone
    formData.value.companyInfo.email = companyInfo.email
    formData.value.companyInfo.propertyDescription = companyInfo.propertyDescription
    formData.value.companyInfo.currencyType = companyInfo.currencyType
    formData.value.companyInfo.worth = companyInfo.worth
    formData.value.companyInfo.remark = companyInfo.remark
    formData.value.companyInfo.fixedPhone = companyInfo.fixedPhone
    formData.value.companyInfo.corporationIdCard = companyInfo.corporationIdCard
    formData.value.companyInfo.legalPersonPropertyList = companyInfo.legalPersonPropertyList ? companyInfo.legalPersonPropertyList : []
  }
  // console.log('公司信息',formData.value.companyInfo)
}, { immediate: true })

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function () {
    selectIds.value.forEach((names) => {
      formData.value.companyInfo.legalPersonPropertyList = formData.value.companyInfo.legalPersonPropertyList.filter((item) => {
        return item != names;
      })
    })
    single.value = false;
  }).catch((e) => { console.log(e) });
}
function handleSelectionChange(selection) {
  selectIds.value = selection
  single.value = selection.length != 1;
}
function addAccount() {
  openDialogAdd.value = true
}
function closeDialogAdd() {
  openDialogAdd.value = false
  corporateFormInput.value = {
    propertyDescription: '',
    currencyType: '',
    worth: 0,
    remark: '',
  }
}
function saveCorporate() {
  proxy.$refs['formInput'].validate(valid => {
    if (!valid) {
      // proxy.$message("")
    } else {
      formData.value.companyInfo.legalPersonPropertyList.push(corporateFormInput.value);
      corporateFormInput.value = {
        propertyDescription: '',
        currencyType: '',
        worth: 0,
        remark: '',
      }
      openDialogAdd.value = false
    }
  })
}
function validSexAndBirth(e) {
  const idVal = e.target.value
  formData.value.companyInfo.sex = getIDSex(idVal)
  formData.value.companyInfo.birth = getIDBirth(idVal)['birth']
}
function handleChange(val) {
  console.log(val);
}

// 表单验证
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