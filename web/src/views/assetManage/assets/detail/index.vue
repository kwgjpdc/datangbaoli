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
        <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="routerQueryObj.viewFlag" :validate-on-rule-change="false">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="买方" prop="partyBuy">
              <el-input v-model="formData.partyBuy" placeholder="请输入买方" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="卖方" prop="partySell">
              <el-input v-model="formData.partySell" placeholder="请输入卖方" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="分合同编号" prop="subContractNo">
              <el-input v-model="formData.subContractNo" placeholder="请输入分合同编号" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="基础交易合同名称" prop="basicContractName">
              <el-input v-model="formData.basicContractName" placeholder="请输入基础交易合同名称" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="拨付总额" prop="totalAppropriation">
              <ElPriceInput :form="formData" prop="totalAppropriation" :rules="rules.totalAppropriation" :placeholder="'请输入'">
              </ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="资产合格标准" prop="qualifiedStandard">
              <el-select v-model="formData.qualifiedStandard" placeholder="请选择">
                <el-option v-for="item in sys_true_or_false" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="资产入池标准" prop="poolingStandard">
              <el-select v-model="formData.poolingStandard" placeholder="请选择">
                <el-option v-for="item in sys_true_or_false" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>

      </div>

    </div>

  </div>
</template>
<script setup>
import { getAssets, addAssets, updateAssets } from "@/api/abs"
import { deepClone } from "@/utils/index"
import ElPriceInput from "@/components/ElPriceInput"

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const { sys_true_or_false } = proxy.useDict( "sys_true_or_false" )
const activeNames = ref(['1'])

const data = reactive({
  formData: {
    status: null,
    absAssociationId: null,
    absId: null,
    partyBuy: "",
    partySell: "",
    subContractNo: "",
    basicContractName: "",
    totalAppropriation: "",
    qualifiedStandard: "1",
    poolingStandard: "1"
  },
  rules: {
    totalAppropriation: [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  }
});
const { formData, rules } = toRefs(data);

const absAssociationId = ref("");
let routerQueryObj = ref({});
watch(route, (newRoute) => {
  absAssociationId.value = newRoute.query && newRoute.query.absAssociationId;
  routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag === 'true' ? true : false;
  routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
}, { immediate: true });

/** 获取回款信息详情 */
function getProjInfoPage() {
  if (absAssociationId.value) {
    loading.value = true;
    getAssets(absAssociationId.value).then(response => {
      formData.value = deepClone(response.data);
      loading.value = false;
    });
  }
}

// 表单验证
function submitForm(statusFlag) {
  loading.value = true
  const elForm = new Promise((resolve, reject) => {
    proxy.$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([elForm]).then(() => {
    saveFormData(statusFlag)
  }).catch(() => {
    loading.value = false
  })
}

function saveFormData(statusFlag) {
  let infoSave = formData.value;
  infoSave.status = statusFlag;
  if (!infoSave.absAssociationId) {
    //新增
    addAssets(infoSave).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      loading.value = false;
      closePage()
    }).catch(() => {
      loading.value = false
    });
  } else {
    //修改
    updateAssets(infoSave).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      loading.value = false;
      closePage()
    }).catch(() => {
      loading.value = false
    });
  }
}

function closePage() {
  const obj = { path: "/assetManage/assets", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
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
