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
        <BasicInfo v-if="infoFlag"
                   ref="basicInfoRef"
                   :infoData="repayInfo"
                   :routerQueryObj="routerQueryObj"></BasicInfo>

        <MarkInfo v-if="infoFlag"
                      ref="markInfoRef"
                      :infoData="repayInfo"
                      :routerQueryObj="routerQueryObj"></MarkInfo>
      </div>

    </div>

  </div>
</template>
<script setup>
import { deepClone } from "@/utils/index"
import { getInfo, getIdentify, addInfo, updateInfo } from "@/api/postLoan/identify"
import BasicInfo from "./BasicInfo";
import MarkInfo from "./MarkInfo";

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
const loanIdentifyId = ref("");
let routerQueryObj = ref({});
watch(route, (newRoute) => {
  loanId.value = newRoute.query && newRoute.query.loanId;
  loanIdentifyId.value = newRoute.query && newRoute.query.loanIdentifyId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

/** 获取金融回款冲销信息详情 */
function getProjInfoPage() {
  loading.value = true;
  if (loanId.value) {
    getInfo(loanId.value).then(response => {
      infoFlag.value = true
      repayInfo.value = response.data;
      loading.value = false;
    });
  } else if (loanIdentifyId.value) {
    getIdentify(loanIdentifyId.value).then(response => {
      infoFlag.value = true
      repayInfo.value = response.data;
      loading.value = false;
    })
  }
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
  loading.value = true
  saveFormData(statusFlag)
}

function saveFormData(statusFlag) {
  const partFormData = proxy.$refs['markInfoRef'].formData
  let repayInfoSave = {}
  console.log('提交',partFormData)
  Object.assign(repayInfoSave, partFormData)
    repayInfoSave.loanId = repayInfo.value.loanId
    repayInfoSave.status = statusFlag
    if (!repayInfoSave.loanIdentifyId) {
      //新增
      addInfo(repayInfoSave).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        loading.value = false;
        closePage()
      });
    } else {
      //修改
      updateInfo(repayInfoSave).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        loading.value = false;
        closePage()
      });
    }
}


function closePage() {
  const obj = { path: "/postLoan/identify", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
