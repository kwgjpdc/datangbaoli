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
                       @click="submitForm(1)">暂存</el-button>
          </el-col>
          <el-col :span="1.5"
                  v-if="!routerQueryObj.viewFlag">
            <el-button type="primary"
                       icon="Checked"
                       @click="submitForm(2)">提交</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary"
                       icon="CircleCloseFilled"
                       @click="closePage">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content-item-scroll"
           ref="formCon">
        <el-card style="margin-top: 15px; margin-bottom: 15px;">
          <div class="flex-around-center" style="width: 100%; max-width: 280px;">
            <FinancingDetails></FinancingDetails>
            <InterestDetails></InterestDetails>
            <Course></Course>
          </div>
        </el-card>
        <BasicInfo v-if="infoFlag"
                   ref="basicInfoRef"
                   :infoData="repayInfo"
                   :routerQueryObj="routerQueryObj"></BasicInfo>

        <InterestInfo v-if="infoFlag"
                      ref="interestInfoRef"
                      :infoData="repayInfo"
                      :routerQueryObj="routerQueryObj"></InterestInfo>
      </div>

    </div>

  </div>
</template>
<script setup>
import { deepClone } from "@/utils/index"
import { getInfo, addInfo, updateInfo } from "@/api/postLoan/interestAdjustment"
import BasicInfo from "./BasicInfo";
import InterestInfo from "./InterestInfo";

import FinancingDetails from "@/views/popup/FinancingDetails"
import InterestDetails from "@/views/popup/InterestDetails"
import Course from "@/views/popup/Course"

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const infoFlag = ref(false);

const data = reactive({
  repayInfo: {},
});
const { repayInfo } = toRefs(data);

const loanId = ref("");
let routerQueryObj = ref({});
watch(route, (newRoute) => {
  loanId.value = newRoute.query && newRoute.query.loanId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

/** 获取金融回款冲销信息详情 */
function getProjInfoPage() {
  if (loanId.value) {
    loading.value = true;
    getInfo(loanId.value).then(response => {
      infoFlag.value = true
      repayInfo.value = response.data;
      // console.log('信息',repayInfo.value)
      loading.value = false;
    });
  }
}

// 调整利息总金额修改
function interestTotalChange(val) {
  repayInfo.value.interestTotal = repayInfo.value.interestTotal + Number(val)
}

// 表单验证
function submitForm(statusFlag) {
  // const interestInfoForm = new Promise((resolve, reject) => {
  //   proxy.$refs['interestInfoRef'].$refs['elForm'].validate(valid => {
  //     valid ? resolve(valid) : reject(valid)
  //   })
  // })
  // Promise.all([interestInfoForm]).then(() => {
  //   saveFormData(statusFlag)
  // })
  saveFormData(statusFlag)
}

function saveFormData(statusFlag) {
  const partFormData = proxy.$refs['interestInfoRef'].updateForm()
  let repayInfoSave = repayInfo.value
  if (!partFormData.po.adjustAmount || partFormData.po.adjustAmount == "") {
    proxy.$message.error("调整利息金额不能为空")
  } else {
    repayInfoSave.po = deepClone(partFormData.po)
    repayInfoSave.po.status = statusFlag
    if (!repayInfoSave.po.loanInterestAmountAdjustId) {
      //新增
      addInfo(repayInfoSave.po).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        loading.value = false;
        closePage()
      });
    } else {
      //修改
      updateInfo(repayInfoSave.po).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        loading.value = false;
        closePage()
      });
    }
  }
}


function closePage() {
  const obj = { path: "/postLoan/interestAdjustment", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
