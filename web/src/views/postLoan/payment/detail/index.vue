<template>
  <div class="app-container info-form-container"
       v-loading="loading"
       ref="appContainerView">
    <div class="content">
      <div class="operate-button">
        <el-row :gutter="10"
                justify="end">
          <el-col :span="1.5"
                  v-if="!routerQueryObj.viewFlag">
            <el-button type="primary"
                       icon="List"
                       @click="submitForm(1)">保存</el-button>
          </el-col>
          <!-- <el-col :span="1.5"
                  v-if="!routerQueryObj.viewFlag">
            <el-button type="primary"
                       icon="Checked"
                       @click="submitForm(2)">提交</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary"
                       icon="CircleCloseFilled"
                       @click="closePage">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content-item-scroll info-form"
           ref="formCon">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息"
                            name="basic">
            <Basic v-if="infoFlag"
                   ref="basic"
                   :infoData="assetInfo"
                   :routerQueryObj="routerQueryObj"></Basic>
          </el-collapse-item>
          <el-collapse-item title="金融信息"
                            name="finance">
            <Finance v-if="infoFlag"
                     ref="finance"
                     :infoData="assetInfo"
                     :routerQueryObj="routerQueryObj"></Finance>
          </el-collapse-item>
        </el-collapse>
      </div>

    </div>

  </div>
</template>
<script setup>
import { deepClone } from "@/utils/index"
import { getInfo, updateInfo } from "@/api/postLoan/payment"
import Basic from "./Basic";
import Finance from "./Finance";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const infoFlag = ref(false);
const activeNames = ref(["basic", "finance"])

const data = reactive({
  assetInfo: {},
});
const { assetInfo } = toRefs(data);

const loanId = ref("");
let routerQueryObj = ref({});
watch(route, (newRoute) => {
  loanId.value = newRoute.query && newRoute.query.loanId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

/** 获取信息详情 */
function getProjInfoPage() {
  if (loanId.value) {
    loading.value = true;
    getInfo(loanId.value).then(response => {
      infoFlag.value = true
      assetInfo.value = response.data;
      loading.value = false;
    }).catch(() => {
      infoFlag.value = true
      loading.value = false;
      // assetInfo.value = {
      //   "createBy": null,
      //   "createById": null,
      //   "createTime": null,
      //   "updateBy": null,
      //   "updateById": null,
      //   "updateTime": null,
      //   "delFlag": null,
      //   "remark": null,
      //   "flowId": null,
      //   "userIds": null,
      //   "absConsiderationId": 1,
      //   "loanId": 15,
      //   "entryAccount": "123123123",
      //   "entryAmount": 111333,
      //   "considerationDate": "2024-04-18",
      //   "status": null,
      //   "factoringApplicantName": "中科软科技股份有限公司",
      //   "bussProduct": "1",
      //   "contractNo": "合同编号",
      //   "agreementNo": "同意书1",
      //   "loanNo": "456",
      //   "ownAmount": null,
      //   "loanExpireDate": "2024-03-31",
      //   "loanBalance": null,
      //   "agreeDebtorName": "债务人名称",
      //   "customerId": 69,
      //   "sellDate": "2024-04-17",
      //   "sellAmount": 2000
      // }
    });
  }
}

// 表单验证
function submitForm(statusFlag) {
  loading.value = true
  const basicValid = new Promise((resolve, reject) => {
    proxy.$refs['basic'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  const financeValid = new Promise((resolve, reject) => {
    proxy.$refs['finance'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([basicValid, financeValid]).then(() => {
    saveFormData(statusFlag)
  }).catch(() => {
    loading.value = true
  })
}

function saveFormData(statusFlag) {
  let basicFormData = proxy.$refs['basic'].formData,
    financeFormData = proxy.$refs['finance'].formData
  let infoSave = {
    absConsiderationId: assetInfo.value.absConsiderationId,
    loanId: loanId.value,
    considerationDate: basicFormData.considerationDate,
    entryAccount: basicFormData.entryAccount,
    entryAmount: financeFormData.subList[0].entryAmount,
    status: statusFlag
  }
  // Object.assign(infoSave, basicFormData)
  // infoSave.entryAmount = financeFormData.subList[0].entryAmount
  console.log('提交', infoSave)
  updateInfo(infoSave).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    loading.value = false;
    closePage()
  });
}


function closePage() {
  const obj = { path: "/postLoan/soldOut/payment", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
  proxy.$tab.closeOpenPage(obj);
}


// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

getProjInfoPage();

</script>
<style lang="scss" scoped>
@import "../../../../assets/styles/infoForm.scss";
</style>
