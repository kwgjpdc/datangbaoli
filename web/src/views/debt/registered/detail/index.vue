<template>
  <div class="app-container info-form-container" v-loading="loading" ref="appContainerView">
    <div class="content">
      <div class="operate-button">
        <el-row :gutter="10" justify="end">
          <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
            <el-button type="primary" icon="List" @click="submitForm('1')">暂存</el-button>
          </el-col>
          <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
            <el-button type="primary" icon="Checked" @click="submitForm('2')">提交</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
          </el-col>

        </el-row>
      </div>
      <div class="content-item-scroll">
        <basic-info id="basicInfo" :registrationInfo="registrationInfo" ref="basicInfoRef"
          :routerQueryObj="routerQueryObj"></basic-info>
        <template
          v-if="routerQueryObj.viewFlag && registrationInfo.auditInfoList && registrationInfo.auditInfoList.length > 0">
          <audit-list id="auditList" :auditInfoList="registrationInfo.auditInfoList" ref="auditListRef"></audit-list>
        </template>
        <template v-if="routerQueryObj.cancelFlag">
          <cancel-info id="cancelInfo" :cancelInfo="registrationInfo" ref="cancelInfoRef"></cancel-info>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getRegistered, addRegistered, updateRegistered } from "@/api/debt/registered"
import BasicInfo from './BasicInfo'
import AuditList from './AuditList.vue'
import CancelInfo from './CancelInfo'

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const debtId = ref("");
const loading = ref(false);

const data = reactive({
  registrationInfo: {
    "id": null,
    "debtId": null,
    "bussType": null,
    "registerPeriod": null,
    "archiveNumber": null,
    "registerNo": null,
    "modifyCode": null,
    "filledBy": null,
    "factoringApplicantName": null,
    "bussProduct": null,
    "agreementNo": "",
    "loanCurrencyType": null,
    "gracePeriod": null,
    "agreeDebtorName": "",
    "debtCurrencyType": null,
    "debtReceivableAmount": null,
    "propertyDescription": null,
    "logoutReason": null,
    "logoutDescription": "",
    "transferList": [],
    "auditInfoList": [],
    "cancelInfo": {}
  }
});
const { registrationInfo } = toRefs(data);

let routerQueryObj = ref({});
watch(route, (newRoute) => {
  // console.log(newRoute.query);
  debtId.value = newRoute.query && newRoute.query.debtId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.cancelFlag = newRoute.query && newRoute.query.cancelFlag && newRoute.query.cancelFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

// 获取中登网的登记信息
function getRegisteredPage() {
  if (debtId.value) {
    loading.value = true;
    getRegistered(debtId.value).then(response => {
      registrationInfo.value = response.data;
      // console.log(registrationInfo);
      loading.value = false;
    });
  }
}

// 登记信息【提交】或【暂存】操作
function submitForm(statusFlag) {
  loading.value = true
  if (routerQueryObj.value.cancelFlag) {
    logoutData(statusFlag)
  } else {
    registerData(statusFlag)
  }
}
// 登记以及变更 
function registerData(statusFlag) {
  let formKeys = ['basicInfoRef']
  let registrationInfoSave = registrationInfo;
  formKeys.map(formKey => {
    const partFormData = proxy.$refs[formKey].formData
    Object.assign(registrationInfoSave, partFormData)
  })
  registrationInfoSave.status = statusFlag;
  saveData(registrationInfoSave)
}
// 注销
function logoutData(statusFlag) {
  let formKeys = ['basicInfoRef', 'cancelInfoRef']
  const cancelInfoForm = new Promise((resolve, reject) => {
    proxy.$refs['cancelInfoRef'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([cancelInfoForm]).then(() => {
    let registrationInfoSave = registrationInfo;
    formKeys.map(formKey => {
      const partFormData = proxy.$refs[formKey].formData
      if (formKey === 'cancelInfoRef') {
        registrationInfoSave.logoutReason = partFormData.logoutReason
        registrationInfoSave.logoutDescription = partFormData.logoutDescription
      } else {
        Object.assign(registrationInfoSave, partFormData)
      }
    })
    registrationInfoSave.status = statusFlag;
    saveData(registrationInfoSave)
  }).catch(()=>{
    loading.value = false
  })
}

// 数据提交接口
function saveData(data) {
  if (!data.id) {
    //登记
    addRegistered(data).then(response => {
      proxy.$modal.msgSuccess("登记成功");
      loading.value = false;
      closePage()
    });
  } else {
    //编辑
    updateRegistered(data).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      loading.value = false;
      closePage()
    });
  }
}
// 关闭标签页
function closePage() {
  const obj = { path: "/debt/registered", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
  proxy.$tab.closeOpenPage(obj);
}


getRegisteredPage();


</script>
<style lang="scss" scoped>
@import '../../../../assets/styles/infoForm.scss';
</style>