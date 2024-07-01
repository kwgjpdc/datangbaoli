<template>
  <div class="app-container info-form-container" v-loading="loading" ref="appContainerView">
    <div class="content">
      <div class="operate-button">
        <el-row :gutter="10" justify="end">
          <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
            <el-button type="primary" icon="List" @click="submitForm(1)">暂存</el-button>
          </el-col>
          <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
            <el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content-item-scroll">
        <basic-info v-if="infoFlag" ref="basicInfoRef" :infoData="repayInfo" :routerQueryObj="routerQueryObj"></basic-info>

        <payback-info v-if="infoFlag" ref="paybackInfoRef" :infoData="repayInfo.po" :routerQueryObj="routerQueryObj"></payback-info>

      </div>

    </div>

  </div>
</template>
<script setup>
import { getInfo, addInfo, updateInfo } from "@/api/postLoan/buyer"
import BasicInfo from "./BasicInfo"
import PaybackInfo from "./PaybackInfo"
import { deepClone } from "@/utils/index"

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const infoFlag = ref(false);

const data = reactive({
  repayInfo: {
    loanId: null,
    debtId: null,
    contractNo: null,
    bussProduct: null,
    factoringApplicantName: null,
    loanCurrency: "1",
    po: {
      entryItem: "",
      entryDate: null,
      deductionAmount: null,
      entryAccount: "",
      repaymentSource: null,
      entryAmount: null,
      subList: []
    }
  }
});
const { repayInfo } = toRefs(data);

const loanId = ref("");
let routerQueryObj = ref({});
watch(route, (newRoute) => {
  loanId.value = newRoute.query && newRoute.query.loanId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

/** 获取回款信息详情 */
function getProjInfoPage() {
  if (loanId.value) {
    loading.value = true;
    getInfo(loanId.value).then(response => {
      repayInfo.value = deepClone(response.data);
      loading.value = false;
      infoFlag.value = true;
    });
  }
}

// 表单验证
function submitForm(statusFlag) {
  loading.value = true
  const basicInfoRefForm = new Promise((resolve, reject) => {
    proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  const paybackInfoRefForm = new Promise((resolve, reject) => {
    proxy.$refs['paybackInfoRef'].$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([basicInfoRefForm, paybackInfoRefForm]).then(() => {
    saveFormData(statusFlag)
  }).catch(() => {
    loading.value = false
  })
}

function saveFormData(statusFlag) {
  const formKeys = ['basicInfoRef', 'paybackInfoRef'];
  let repayInfoSave = repayInfo.value;
  // console.log('repayInfo', repayInfoSave)
  formKeys.map(formKey => {
    const partFormData = proxy.$refs[formKey].formData
    if (formKey === 'paybackInfoRef') {
      repayInfoSave.po.entryAmount = partFormData.entryAmount
      repayInfoSave.po.subList = partFormData.subList
    }  else {
      repayInfoSave = deepClone(partFormData)
    }
  })
  repayInfoSave.po.status = statusFlag;
  repayInfoSave.po.loanId = loanId.value;
  repayInfoSave.po.debtId = repayInfoSave.debtId ? repayInfoSave.debtId : ""
  // 接口只需要 repayInfoSave.po 部分 ；
  // repayInfoSave.po.id原来有值是修改 没值是新增；
  if (repayInfoSave.po.entryItem && repayInfoSave.po.entryItem.length) {
    repayInfoSave.po.entryItem = repayInfoSave.po.entryItem.join(',')
  } else {
    repayInfoSave.po.entryItem = "";
  }
  console.log(repayInfoSave);
  if (!repayInfoSave.po.id) {
    //新增
    addInfo(repayInfoSave.po).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      loading.value = false;
      closePage()
    }).catch(() => {
      loading.value = false
    });
  } else {
    //修改
    updateInfo(repayInfoSave.po).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      loading.value = false;
      closePage()
    }).catch(() => {
      loading.value = false
    });
  }
}

function closePage() {
  const obj = { path: "/postLoan/buyer", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
@import '../../../../assets/styles/infoForm.scss';
</style>
