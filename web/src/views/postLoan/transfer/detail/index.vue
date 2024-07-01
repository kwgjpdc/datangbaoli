<template>
  <div class="app-container info-form-container" v-loading="loading" ref="appContainerView">
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
      <div class="content-item-scroll info-form" ref="formCon">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basic">
            <Basic v-if="infoFlag" ref="basic" :infoData="assetInfo" :routerQueryObj="routerQueryObj"></Basic>
          </el-collapse-item>
          <el-collapse-item title="扣账账号" name="account">
            <Account v-if="infoFlag" ref="account" :infoData="assetInfo" :routerQueryObj="routerQueryObj"></Account>
          </el-collapse-item>
        </el-collapse>
      </div>

    </div>

  </div>
</template>
<script setup>
import { deepClone } from "@/utils/index"
import { getInfo, updateInfo } from "@/api/postLoan/transfer"
import Basic from "./Basic";
import Account from "./Account";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const infoFlag = ref(false);
const activeNames = ref(["basic", "account"])

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
  const accountValid = new Promise((resolve, reject) => {
    proxy.$refs['account'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([basicValid, accountValid]).then(() => {
    saveFormData(statusFlag)
  }).catch(()=>{
    loading.value = true
  })
}

function saveFormData(statusFlag) {
  let basicFormData = proxy.$refs['basic'].formData,
  accountFormData = proxy.$refs['account'].formData
  let infoSave = deepClone(assetInfo.value)
  Object.assign(infoSave, basicFormData)
  infoSave.deductionList = accountFormData.deductionList
  infoSave.deductionList[0].absTransferId = infoSave.absTransferId
  // console.log('提交',infoSave)
  infoSave.status = statusFlag
  updateInfo(infoSave).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    loading.value = false;
    closePage()
  });
}


function closePage() {
  const obj = { path: "/postLoan/soldOut/transfer", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
