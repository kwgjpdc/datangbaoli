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
      <div class="content-item-scroll" ref="formCon">
        <BasicInfo v-if="infoFlag"
                   ref="basicInfoRef"
                   :infoData="repayInfo"
                   :routerQueryObj="routerQueryObj"></BasicInfo>

        <InterestRateInfo v-if="infoFlag"
                          ref="interestRateInfoRef"
                          :infoData="repayInfo"
                          :routerQueryObj="routerQueryObj"></InterestRateInfo>

        <DefaultInfo v-if="infoFlag"
                     ref="defaultInfoRef"
                     :infoData="repayInfo"
                     :routerQueryObj="routerQueryObj"></DefaultInfo>

        <FinancInfo v-if="infoFlag"  ref="financInfoRef" :infoData="repayInfo" :routerQueryObj="routerQueryObj"></FinancInfo>

      </div>

    </div>

  </div>
</template>
<script setup>
import { deepClone } from "@/utils/index"
import { getInfo, addInfo, updateInfo } from "@/api/postLoan/interestRates"
import BasicInfo from "./BasicInfo"
import InterestRateInfo from "./InterestRateInfo"
import DefaultInfo from "./DefaultInfo"
import FinancInfo from "./FinancInfo"

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

// 表单验证
function submitForm(statusFlag) {
  // loading.value = true
  const basicInfoRefForm = new Promise((resolve, reject) => {
    proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([basicInfoRefForm]).then(() => {
    saveFormData(statusFlag)
  }).catch(() => {
    loading.value = false
    const errDom = proxy.$refs['formCon'].querySelectorAll('.is-error')[0] || {
      scrollIntoView: () => {}
    }
    errDom.scrollIntoView({block: 'center', behavior: 'smooth'})
  })
}

function saveFormData(statusFlag) {
  const formKeys = ['basicInfoRef', 'interestRateInfoRef', 'defaultInfoRef'];
  let repayInfoSave = deepClone(repayInfo.value)
  if (!repayInfoSave.po) repayInfoSave.po = {}; repayInfoSave.po.subList = []
  formKeys.map(formKey => {
    const partFormData = proxy.$refs[formKey].formData
    if (formKey === 'basicInfoRef') {
      if (typeof(partFormData.po.changeType) === "string") {
        repayInfoSave.po.changeType = partFormData.po.changeType
      } else if (partFormData.po.changeType.length > 0) {
        repayInfoSave.po.changeType = partFormData.po.changeType.join(',')
      } else {
        repayInfoSave.po.changeType = ""
      }
      // repayInfoSave.po.changeType = partFormData.po.changeType
      repayInfoSave.po.rateEffectiveDate = partFormData.po.rateEffectiveDate
    } else if (formKey === 'interestRateInfoRef') {
      delete partFormData.po.changeType
      delete partFormData.po.rateEffectiveDate
      Object.assign(repayInfoSave.po, partFormData.po)
    } else if (formKey === 'defaultInfoRef') {
      repayInfoSave.po.subList = deepClone(partFormData.subList)
    }
  })
  repayInfoSave.po.loanId = repayInfoSave.loanId
  repayInfoSave.po.status = statusFlag;
  // repayInfoSave.po.loanId = loanId.value;
  //   接口只需要 loanResult 部分 ；
  // loanResult原来有值是修改 没值是新增；
  // console.log(repayInfoSave);
  if (!repayInfoSave.po.loanInterestRateChangeId) {
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


function closePage() {
  const obj = { path: "/postLoan/interestRates", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
